import * as mapboxgl from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environments';
import { LngLatLike, MapMouseEvent } from 'mapbox-gl';

@Component({
  selector: 'app-world-map',
  templateUrl: './world-map.component.html',
  styleUrls: ['./world-map.component.scss'],
})
export class WorldMapComponent implements OnInit {
  public markers: mapboxgl.Marker[] = [];
  public aucklandCoordinates: LngLatLike = [174.7645, -36.8509];

  ngOnInit(): void {
    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => this.onLocationSuccess(position),
      () => this.onLocationError(),
      { enableHighAccuracy: true }
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
    this.createMarker(map);
    this.setDefaultMarker(map, coordinates);
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

  setDefaultMarker(map: mapboxgl.Map, coordinates: LngLatLike) {
    const defaultLocationMarker = new mapboxgl.Marker({
      color: 'red',
      anchor: 'bottom',
    })
      .setLngLat(coordinates)
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
      const popup = new mapboxgl.Popup()
        .setLngLat(event.lngLat)
        .setHTML(
          '<h3>Options</h3><button id="placeMarker">Place Marker</button>'
        )
        .addTo(map);

      popup.getElement().addEventListener('click', (popupEvent) => {
        const target = popupEvent.target as HTMLElement;

        if (target.id === 'placeMarker') {
          const marker = new mapboxgl.Marker()
            .setLngLat(event.lngLat)
            .addTo(map);
          popup.remove();
          this.markers.push(marker);
        }
      });
    });
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
      })
    );
  }

  coordinatesGeocoder(query: string): MapboxGeocoder.Result[] {
    const matches = query.match(
      /^[ ]*(?:Lat: )?(-?\d+\.?\d*)[, ]+(?:Lng: )?(-?\d+\.?\d*)[ ]*$/i
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
    const popup = new mapboxgl.Popup({ closeOnClick: false })
    .setLngLat(this.aucklandCoordinates)
    .setHTML('<h3>Auckland!</h3>')
    .addTo(map);
  }

  removeAllMarkers() {
    this.markers.forEach((marker) => marker.remove());
    this.markers = [];
  }
}
