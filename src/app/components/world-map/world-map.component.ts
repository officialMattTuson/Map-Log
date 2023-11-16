import * as mapboxgl from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import {
  Component,
  ComponentFactoryResolver,
  OnInit,
  ViewChild,
} from '@angular/core';
import {environment} from 'src/environments/environments';
import {LngLatLike, MapMouseEvent} from 'mapbox-gl';
import {PopupHostDirective} from 'src/app/directives/popup-host.directive';
import {MarkerPopupComponent} from '../marker-popup/marker-popup.component';
import {MatDrawer} from '@angular/material/sidenav';
import {MapOverlayService} from 'src/app/services/map-overlay.service';
import {MapDrawerComponent} from '../map-drawer/map-drawer.component';
import {MapOverlayDirective} from 'src/app/directives/map-overlay.directive';

@Component({
  selector: 'app-world-map',
  templateUrl: './world-map.component.html',
  styleUrls: ['./world-map.component.scss'],
})
export class WorldMapComponent implements OnInit {
  public markers: mapboxgl.Marker[] = [];
  public aucklandCoordinates: LngLatLike = [174.7645, -36.8509];
  public selectedLocation: {name: string; description: string} | null = null;

  isOverlayOpen$ = this.mapOverlayService.isOverlayOpen$;

  @ViewChild('drawer') drawer: MatDrawer;
  @ViewChild(PopupHostDirective, {static: true}) popupHost: PopupHostDirective;
  @ViewChild(MapOverlayDirective, {static: true})
  overlayDirective: MapOverlayDirective;

  constructor(
    private readonly componentFactoryResolver: ComponentFactoryResolver,
    private readonly mapOverlayService: MapOverlayService,
  ) {}

  ngOnInit(): void {
    this.mapOverlayService.setOverlayDirective(this.overlayDirective);
    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => this.onLocationSuccess(position),
      () => this.onLocationError(),
      {enableHighAccuracy: true},
    );
  }

  onLocationSuccess(position: GeolocationPosition) {
    const centralCoords: LngLatLike = [
      position.coords.longitude,
      position.coords.latitude,
    ];
    this.setupMap(centralCoords);
  }

  onLocationError() {
    this.setupMap(this.aucklandCoordinates);
  }

  setupMap(coordinates: LngLatLike) {
    (mapboxgl as typeof mapboxgl).accessToken = environment.mapboxAccessToken;
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/satellite-streets-v11',
      center: coordinates,
      zoom: 10,
    });

    this.setUpMapControls(map);
    this.setDefaultLocationMarker(map, coordinates);
    this.createMarker(map);
    // Popup example, will be removed at a later stage
    this.addAucklandPopup(map);
    this.searchGeocoder(map);
  }

  setUpMapControls(map: mapboxgl.Map) {
    const scale = new mapboxgl.ScaleControl({
      maxWidth: 200,
      unit: 'metric',
    });
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
    });
    map.addControl(scale, 'bottom-right');
    map.addControl(geocoder, 'top-right');
    map.addControl(new mapboxgl.NavigationControl());
    map.addControl(new mapboxgl.FullscreenControl(), 'top-right');
  }

  setDefaultLocationMarker(map: mapboxgl.Map, coordinates: LngLatLike) {
    const defaultMarkerPopup = new mapboxgl.Popup({
      closeOnClick: true,
    }).setHTML('<h1>Hello World!</h1>');
    defaultMarkerPopup.addClassName('home-marker-popup');
    const defaultLocationMarker = new mapboxgl.Marker({
      color: 'red',
      anchor: 'bottom',
    })
      .setLngLat(coordinates)
      .setPopup(defaultMarkerPopup)
      .addTo(map);

    defaultLocationMarker
      .getElement()
      .addEventListener('click', (event: MouseEvent) => {
        event.stopPropagation();
        defaultLocationMarker.togglePopup();
      });
  }

  createMarker(map: mapboxgl.Map) {
    map.on('click', (event: MapMouseEvent) => {
      this.selectedLocation = this.getLocationInfoAtCoordinates(
        event.lngLat.toArray(),
      );
      const clickedMarker = this.markers.find(marker => {
        const markerScreenPoint = map.project(marker.getLngLat());
        return markerScreenPoint.dist(map.project(event.lngLat)) < 45;
      });
      if (clickedMarker) {
        const popupComponentFactory =
          this.componentFactoryResolver.resolveComponentFactory(
            MarkerPopupComponent,
          );
        const popupComponentRef =
          this.popupHost.viewContainerRef.createComponent(
            popupComponentFactory,
          );
        popupComponentRef.instance.title = this.selectedLocation.name;
        popupComponentRef.instance.description =
          this.selectedLocation.description;

        const markerScreenPoint = map.project(clickedMarker.getLngLat());
        const popupLngLat = map.unproject(
          markerScreenPoint.add(new mapboxgl.Point(0, -40)),
        );

        new mapboxgl.Popup()
          .setLngLat(popupLngLat)
          .setDOMContent(popupComponentRef.location.nativeElement)
          .addTo(map);
      } else {
        const popup = new mapboxgl.Popup({closeOnClick: true})
          .setLngLat(event.lngLat)
          .setHTML(
            '<h3>Options</h3><button id="placeMarker">Place Marker</button>',
          )
          .addTo(map);

        popup.getElement().addEventListener('click', popupEvent => {
          const target = popupEvent.target as HTMLElement;

          if (target.id === 'placeMarker') {
            const marker = new mapboxgl.Marker({draggable: true})
              .setLngLat(event.lngLat)
              .addTo(map);
            popup.remove();
            this.markers = [...this.markers, marker];
          }
        });
      }
    });
  }

  getLocationInfoAtCoordinates(coordinates: number[]): {
    name: string;
    description: string;
  } {
    return {
      name: 'Location Name',
      description: 'Location Description',
    };
  }

  searchGeocoder(map: mapboxgl.Map) {
    map.addControl(
      new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        localGeocoder: (query: string) => this.coordinatesGeocoder(query),
        zoom: 10,
        placeholder: 'Search By Coords (Long, Lat)',
        mapboxgl: mapboxgl,
        reverseGeocode: true,
      }),
    );
  }

  coordinatesGeocoder(query: string): MapboxGeocoder.Result[] {
    const matches = query.match(
      /^[ ]*(?:Lat: )?(-?\d+\.?\d*)[, ]+(?:Lng: )?(-?\d+\.?\d*)[ ]*$/i,
    );

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

  addAucklandPopup(map: mapboxgl.Map) {
    const popup = new mapboxgl.Popup({closeOnClick: false})
      .setLngLat(this.aucklandCoordinates)
      .setHTML('<h3>Auckland!</h3>')
      .addTo(map);
  }

  removeAllMarkers() {
    this.markers.forEach(marker => marker.remove());
    this.markers = [];
  }

  openOverlay() {
    this.mapOverlayService.openPanel(MapDrawerComponent, this.markers);
  }
}
