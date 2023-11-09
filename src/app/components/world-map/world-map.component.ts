import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environments';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

@Component({
  selector: 'app-world-map',
  templateUrl: './world-map.component.html',
  styleUrls: ['./world-map.component.scss'],
})
export class WorldMapComponent implements OnInit {
  public markers: mapboxgl.Marker[] = [];
  public aucklandCoordinates = [174.7645, -36.8509];

  constructor(private readonly titleService: Title) {}
  ngOnInit(): void {
    this.titleService.setTitle('Holiday Map');
    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => this.successLocation(position),
      () => this.errorLocation(),
      { enableHighAccuracy: true }
    );
  }

  successLocation(position: GeolocationPosition) {
    const centralCoords = [position.coords.longitude, position.coords.latitude];
    this.setupMap(centralCoords);
  }

  errorLocation() {
    this.setupMap(this.aucklandCoordinates);
  }

  setupMap(coordinates?: any) {
    (mapboxgl as typeof mapboxgl).accessToken = environment.mapboxAccessToken;
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/satellite-streets-v11',
      center: coordinates,
      zoom: 10,
    });
    const nav = new mapboxgl.NavigationControl();
    map.addControl(nav);

    const scale = new mapboxgl.ScaleControl({
      maxWidth: 200,
      unit: 'metric',
    });
    map.addControl(scale, 'bottom-right');

    const fullscreen = new mapboxgl.FullscreenControl();
    map.addControl(fullscreen, 'top-right');
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
    });

    map.addControl(geocoder, 'top-left');
    map.on('click', (e: any) => {
      const coordinates = e.lngLat.toArray();

      const marker = new mapboxgl.Marker().setLngLat(coordinates).addTo(map);
      this.markers.push(marker);
    });

    // const directions = new MapboxDirections({
    //   accessToken: mapboxgl.accessToken,
    //   unit: 'metric', // 'imperial' for miles, 'metric' for kilometers
    // });

    // map.addControl(directions, 'top-left');
  }

  removeAllMarkers() {
    this.markers.forEach((marker) => marker.remove());
    this.markers = [];
  }
}
