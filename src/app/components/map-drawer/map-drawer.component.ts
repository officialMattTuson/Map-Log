import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {take} from 'rxjs';
import {GeocoderService} from 'src/app/endpoints/geocoder.service';
import {StoryMarker} from 'src/app/models.ts/marker';
import {MapOverlayService} from 'src/app/services/map-overlay.service';
import {SharedMapService} from 'src/app/services/shared-map.service';

@Component({
  selector: 'app-map-drawer',
  templateUrl: './map-drawer.component.html',
  styleUrls: ['./map-drawer.component.scss'],
})
export class MapDrawerComponent implements OnInit {
  storyMarker: StoryMarker;
  selectedLocation: string;
  locationDescription: string;
  hasFailedSubmitAttempt: boolean;
  storyControl: FormControl;

  constructor(
    private readonly geocoderService: GeocoderService,
    private readonly sharedMapService: SharedMapService,
    private readonly mapOverlayService: MapOverlayService,
  ) {}

  ngOnInit() {
    this.createForm();
    if (this.locationDescription) {
      this.selectedLocation = this.locationDescription;
      return;
    }
    const coordinates = this.storyMarker.marker.getLngLat();
    const mappedCoords = [coordinates.lng, coordinates.lat];
    this.getFeatures(mappedCoords);
  }

  createForm() {
    this.storyControl = new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]);
  }

  getFeatures(coordinates: number[]) {
    this.geocoderService
      .getFeaturesFromCoordinates(coordinates)
      .pipe(take(1))
      .subscribe({
        next: (result: any) =>
          (this.selectedLocation =
            this.sharedMapService.getLocationDetails(result)),
      });
  }

  addLocationStory() {
    this.hasFailedSubmitAttempt = this.storyControl.invalid;
    if (this.storyControl.invalid) {
      this.storyControl.markAsTouched();
      return;
    }
    this.storyMarker.story = this.storyControl.value;
  }

  closeOverlay() {
    this.mapOverlayService.closeOverlay();
  }
}
