import * as mapboxgl from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environments';
import { LngLatLike } from 'mapbox-gl';

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

    const marker2 = new mapboxgl.Marker({ color: 'red', anchor: 'center' })
      .setLngLat(coordinates)
      .addTo(map);

    const popup = new mapboxgl.Popup({ closeOnClick: false })
      .setLngLat(this.aucklandCoordinates)
      .setHTML('<h3>Auckland!</h3>')
      .addTo(map)

    map.on('click', (e: any) => {
      const clickedCoordinates = e.lngLat.toArray();

      const marker = new mapboxgl.Marker()
        .setLngLat(clickedCoordinates)
        .addTo(map);
      this.markers.push(marker);
    });
  }

  removeAllMarkers() {
    this.markers.forEach((marker) => marker.remove());
    this.markers = [];
  }
}
function addClassName(arg0: string) {
  throw new Error('Function not implemented.');
}

