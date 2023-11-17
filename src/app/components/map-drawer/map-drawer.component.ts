import {Component, OnInit} from '@angular/core';
import {LngLat, Marker} from 'mapbox-gl';
import {take} from 'rxjs';
import {GeocoderService} from 'src/app/endpoints/geocoder.service';
import {MapOverlayService} from 'src/app/services/map-overlay.service';
import {SharedMapService} from 'src/app/services/shared-map.service';

@Component({
  selector: 'app-map-drawer',
  templateUrl: './map-drawer.component.html',
  styleUrls: ['./map-drawer.component.scss'],
})
export class MapDrawerComponent implements OnInit {
  constructor(
    private readonly geocoderService: GeocoderService,
    private readonly sharedMapService: SharedMapService,
    private readonly mapOverlayService: MapOverlayService,
  ) {}
  markers: Marker[];
  mappedMarkers: LngLat[];
  selectedLocations: any[] = [];
  locationDescription: string;

  ngOnInit() {
    if (this.locationDescription) {
      this.selectedLocations.push(this.locationDescription);
      return;
    }
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
          next: (result: any) =>
            (this.selectedLocations =
              this.sharedMapService.getLocationDetails(result)),
        });
    });
  }

  closeOverlay() {
    this.mapOverlayService.closeOverlay();
  }
}
