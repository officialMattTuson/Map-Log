import {Component, OnInit} from '@angular/core';
import {LngLat, Marker} from 'mapbox-gl';
import {take} from 'rxjs';
import {GeocoderService} from 'src/app/endpoints/geocoder.service';
import {MapOverlayService} from 'src/app/services/map-overlay.service';

@Component({
  selector: 'app-map-drawer',
  templateUrl: './map-drawer.component.html',
  styleUrls: ['./map-drawer.component.scss'],
})
export class MapDrawerComponent implements OnInit {
  constructor(
    private readonly geocoderService: GeocoderService,
    private readonly mapOverlayService: MapOverlayService,
  ) {}
  markers: Marker[];
  mappedMarkers: LngLat[];
  selectedLocations: any[] = [];

  ngOnInit() {
    this.mappedMarkers = this.markers.map(marker => marker.getLngLat());
    this.getFeatures();
  }

  getFeatures() {
    const convertedCoordinates: number[][] = this.mappedMarkers.map(
      ({lng, lat}) => [lng, lat],
    );
    convertedCoordinates.forEach(coordsSet => {
      this.geocoderService
        .getFeaturesFromCoordinates(coordsSet)
        .pipe(take(1))
        .subscribe({
          next: (result: any) => {
            result.features.forEach((feature: any) => {
              if (feature.place_type[0] === 'locality') {
                this.selectedLocations.push(feature.place_name);
              }
            });
            console.log(this.selectedLocations);
          },
        });
    });
  }

  closeOverlay() {
    this.mapOverlayService.closeOverlay();
  }
}
