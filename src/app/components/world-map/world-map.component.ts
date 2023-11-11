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

    const marker2 = new mapboxgl.Marker({ color: 'red', anchor: 'bottom' })
      .setLngLat(coordinates)
      .addTo(map);

    const popup = new mapboxgl.Popup({ closeOnClick: false })
      .setLngLat(this.aucklandCoordinates)
      .setHTML('<h3>Auckland!</h3>')
      .addTo(map);

    map.on('click', (event: MapMouseEvent) => {
      const clickedCoordinates: LngLatLike = event.lngLat;
      const marker = new mapboxgl.Marker()
        .setLngLat(clickedCoordinates)
        .addTo(map);
      this.markers.push(marker);
    });

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
    const geocodes: any[] = [];

    if (coord1 < -90 || coord1 > 90) {
      geocodes.push(coordinateFeature(coord1, coord2));
    }

    if (coord2 < -90 || coord2 > 90) {
      geocodes.push(coordinateFeature(coord2, coord1));
    }

    if (geocodes.length === 0) {
      geocodes.push(coordinateFeature(coord1, coord2));
      geocodes.push(coordinateFeature(coord2, coord1));
    }

    return geocodes;
  }

  removeAllMarkers() {
    this.markers.forEach((marker) => marker.remove());
    this.markers = [];
  }
}
function addClassName(arg0: string) {
  throw new Error('Function not implemented.');
}
