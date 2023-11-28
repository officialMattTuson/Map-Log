import * as mapboxgl from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import {Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild} from '@angular/core';
import {LngLatLike, MapMouseEvent} from 'mapbox-gl';
import {PopupHostDirective} from 'src/app/directives/popup-host.directive';
import {MarkerPopupComponent} from '../marker-popup/marker-popup.component';
import {MatDrawer} from '@angular/material/sidenav';
import {MapOverlayService} from 'src/app/services/map-overlay.service';
import {MapOverlayDirective} from 'src/app/directives/map-overlay.directive';
import {environment} from 'src/environments/environments';
import {GeocoderService} from 'src/app/endpoints/geocoder.service';
import {Observable, Subject, map, take, takeUntil} from 'rxjs';
import {SharedMapService} from 'src/app/services/shared-map.service';
import {StoryMarker} from 'src/app/models.ts/marker';

@Component({
  selector: 'app-world-map',
  templateUrl: './world-map.component.html',
  styleUrls: ['./world-map.component.scss'],
})
export class WorldMapComponent implements OnInit {
  public storyMarkers: StoryMarker[] = [];
  public aucklandCoordinates: LngLatLike = [174.7645, -36.8509];
  public selectedLocation: string;
  public isExistingMarker = false;
  public map: mapboxgl.Map;

  isOverlayOpen$ = this.mapOverlayService.isOverlayOpen$;
  private destroy$ = new Subject<boolean>();

  @ViewChild('drawer') drawer: MatDrawer;
  @ViewChild(PopupHostDirective, {static: true}) popupHost: PopupHostDirective;
  @ViewChild(MapOverlayDirective, {static: true}) overlayDirective: MapOverlayDirective;

  constructor(
    private readonly factoryResolver: ComponentFactoryResolver,
    private readonly mapOverlayService: MapOverlayService,
    private readonly sharedMapService: SharedMapService,
    private readonly geocoderService: GeocoderService,
  ) {}

  ngOnInit(): void {
    this.mapOverlayService.setOverlayDirective(this.overlayDirective);
    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => this.onLocationSuccess(position),
      () => this.onLocationError(),
      {enableHighAccuracy: true},
    );
    this.observeStoryMarkers();
  }

  onLocationSuccess(position: GeolocationPosition) {
    const centralCoords: LngLatLike = [position.coords.longitude, position.coords.latitude];
    this.setupMap(centralCoords);
  }

  onLocationError() {
    this.setupMap(this.aucklandCoordinates);
  }

  setupMap(coordinates: LngLatLike) {
    (mapboxgl as typeof mapboxgl).accessToken = environment.mapboxAccessToken;
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/satellite-streets-v11',
      center: coordinates,
      zoom: 8,
    });

    this.searchGeocoder();
    this.setUpMapControls();
    this.handleMarkerAndPopupCreation();
  }

  setUpMapControls() {
    const scale = new mapboxgl.ScaleControl({
      maxWidth: 200,
      unit: 'metric',
    });
    this.map.addControl(scale, 'bottom-right');
    this.map.addControl(new mapboxgl.NavigationControl());
    this.map.addControl(new mapboxgl.FullscreenControl(), 'top-right');
  }

  handleMarkerAndPopupCreation() {
    this.map.on('click', (event: MapMouseEvent) => {
      const coordinates = event.lngLat.toArray();

      this.getLocationInfoAtCoordinates(coordinates).subscribe({
        next: (locationInfo: string) => {
          this.selectedLocation = locationInfo;
          const clickedMarker = this.findMarkerByCoordinates(event.lngLat);
          const popupComponentRef = this.createPopupComponentRef();
          popupComponentRef.instance.location = this.selectedLocation;
          clickedMarker
            ? this.onExistingPopupClick(popupComponentRef, clickedMarker)
            : this.addMarkerToMap(popupComponentRef, event);
        },
      });
    });
  }

  createPopupComponentRef(): ComponentRef<MarkerPopupComponent> {
    const popupFactory = this.factoryResolver.resolveComponentFactory(MarkerPopupComponent);
    return this.popupHost.viewContainerRef.createComponent(popupFactory);
  }

  onExistingPopupClick(
    popupComponentRef: ComponentRef<MarkerPopupComponent>,
    clickedMarker: StoryMarker,
  ) {
    let popup: mapboxgl.Popup;
    this.isExistingMarker = true;
    popupComponentRef.instance.selectedStoryMarker = clickedMarker;
    popupComponentRef.instance.storyMarkers = this.storyMarkers;
    const markerScreenPoint = this.map.project(clickedMarker.marker.getLngLat());
    const popupLngLat = this.map.unproject(markerScreenPoint.add(new mapboxgl.Point(0, -40)));
    popup = new mapboxgl.Popup()
      .setLngLat(popupLngLat)
      .setDOMContent(popupComponentRef.location.nativeElement)
      .addTo(this.map);
    this.overridePopupStyles(popup);
    popupComponentRef.instance.popup = popup;
  }

  addMarkerToMap(popupComponentRef: ComponentRef<MarkerPopupComponent>, event: MapMouseEvent) {
    let popup: mapboxgl.Popup;
    this.isExistingMarker = false;
    popup = new mapboxgl.Popup({closeOnClick: true})
      .setLngLat(event.lngLat)
      .setDOMContent(popupComponentRef.location.nativeElement)
      .addTo(this.map);

    popupComponentRef.instance.placeMarkerConfirmationPopup = true;
    popupComponentRef.instance.placeMarkerClicked.subscribe({
      next: () => this.handleMarkerPlacedEvent(popup, event),
    });
  }

  findMarkerByCoordinates(lngLat: mapboxgl.LngLat): StoryMarker | undefined {
    return this.storyMarkers.find(storyMarker => {
      const markerScreenPoint = this.map.project(storyMarker.marker.getLngLat());
      return markerScreenPoint.dist(this.map.project(lngLat)) < 45;
    });
  }

  handleMarkerPlacedEvent(popup: mapboxgl.Popup, event: mapboxgl.MapMouseEvent) {
    popup.getElement().addEventListener('click', () => {
      const marker = new mapboxgl.Marker().setLngLat(event.lngLat).addTo(this.map);
      popup.remove();
      const newStoryMarker: StoryMarker = {
        marker: marker,
        story: '',
        startDate: '',
        endDate: '',
      };
      this.storyMarkers = [...this.storyMarkers, newStoryMarker];
    });
  }

  getLocationInfoAtCoordinates(coordinates: number[]): Observable<string> {
    return this.geocoderService.getFeaturesFromCoordinates(coordinates).pipe(
      take(1),
      map(result => {
        return this.sharedMapService.getLocationDetails(result);
      }),
    );
  }

  searchGeocoder() {
    this.map.addControl(
      new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        localGeocoder: (query: string) => this.coordinatesGeocoder(query),
        zoom: 10,
        placeholder: 'Search By Coords or Location',
        mapboxgl: mapboxgl,
        reverseGeocode: true,
      }),
    );
  }

  coordinatesGeocoder(query: string): MapboxGeocoder.Result[] {
    const matches = query.match(/^[ ]*(?:Lat: )?(-?\d+\.?\d*)[, ]+(?:Lng: )?(-?\d+\.?\d*)[ ]*$/i);

    if (!matches) {
      return [];
    }

    function coordinateFeature(lng: number, lat: number): any {
      return {
        center: [lng, lat],
        geometry: {
          type: 'Point',
          coordinates: [lng, lat],
        },
        place_name: 'Lat: ' + lat + ' Lng: ' + lng,
        place_type: ['coordinate'],
        properties: {},
        type: 'Feature',
      };
    }

    const coord1: number = Number(matches[1]);
    const coord2: number = Number(matches[2]);
    const geoCodes: any[] = [];

    if (coord1 < -90 || coord1 > 90) {
      geoCodes.push(coordinateFeature(coord1, coord2));
    }

    if (coord2 < -90 || coord2 > 90) {
      geoCodes.push(coordinateFeature(coord2, coord1));
    }

    if (geoCodes.length === 0) {
      geoCodes.push(coordinateFeature(coord1, coord2));
      geoCodes.push(coordinateFeature(coord2, coord1));
    }

    return geoCodes;
  }

  removeAllMarkers() {
    this.storyMarkers.forEach(storyMarker => storyMarker.marker.remove());
    this.map.removeLayer('lines');
    this.map.removeSource('lines');
    this.storyMarkers = [];
  }

  overridePopupStyles(popup: mapboxgl.Popup) {
    const popupElement = popup
      .getElement()
      .parentElement?.getElementsByClassName('mapboxgl-popup-content')[0] as HTMLElement;
    popupElement.style.borderRadius = '0.5rem';
    popupElement.style.width = '15rem';
    popupElement.style.height = '15rem';
    const closeButtonElement = popup
      .getElement()
      .parentElement?.getElementsByClassName('mapboxgl-popup-close-button')[0] as HTMLElement;
    closeButtonElement.style.top = '-114%';
    closeButtonElement.style.left = '100%';
  }

  observeStoryMarkers() {
    this.sharedMapService.$storyMarkers.pipe(takeUntil(this.destroy$)).subscribe(storyMarkers => {
      this.storyMarkers = storyMarkers;
      this.updateLinesOnMap(storyMarkers);
    });
  }

  updateLinesOnMap(storyMarkers: StoryMarker[]) {
    const coordinates = storyMarkers.map(marker => marker.marker.getLngLat());

    if (this.map.getLayer('lines')) {
      this.map.removeLayer('lines');
      this.map.removeSource('lines');
    }

    this.map.addSource('lines', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: coordinates.map(coord => [coord.lng, coord.lat]),
        },
      },
    });

    this.map.addLayer({
      id: 'lines',
      type: 'line',
      source: 'lines',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#FF00FF',
        'line-width': 8,
      },
    });
  }
}
