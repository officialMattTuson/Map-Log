import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {take} from 'rxjs';
import {GeocoderService} from 'src/app/endpoints/geocoder.service';
import {StoryMarker} from 'src/app/models.ts/marker';
import {DateService} from 'src/app/services/date.service';
import {MapOverlayService} from 'src/app/services/map-overlay.service';
import {SharedMapService} from 'src/app/services/shared-map.service';
import {SnackbarService} from 'src/app/snackbar.service';

@Component({
  selector: 'app-map-drawer',
  templateUrl: './map-drawer.component.html',
  styleUrls: ['./map-drawer.component.scss'],
})
export class MapDrawerComponent implements OnInit {
  storyMarkers: StoryMarker[];
  selectedStoryMarker: StoryMarker;
  selectedLocation: string;
  hasFailedSubmitAttempt: boolean;
  hasExistingStory = false;

  form: FormGroup;
  storyControl: FormControl;
  startDateControl: FormControl;
  endDateControl: FormControl;
  photoControl: FormControl;

  constructor(
    private readonly geocoderService: GeocoderService,
    private readonly sharedMapService: SharedMapService,
    private readonly mapOverlayService: MapOverlayService,
    private readonly snackBarService: SnackbarService,
    private readonly dateService: DateService,
  ) {}

  ngOnInit() {
    this.hasExistingStory = this.selectedStoryMarker.story.length > 0;
    this.createForm();
    const coordinates = this.selectedStoryMarker.marker.getLngLat();
    const mappedCoords = [coordinates.lng, coordinates.lat];
    this.getFeatures(mappedCoords);
  }

  createForm() {
    this.storyControl = new FormControl('', [Validators.required, Validators.minLength(3)]);
    this.startDateControl = new FormControl(null, Validators.required);
    this.endDateControl = new FormControl(null, Validators.required);
    this.photoControl = new FormControl(null, Validators.required);
    this.form = new FormGroup({
      storyControl: this.storyControl,
      startDateControl: this.startDateControl,
      endDateControl: this.endDateControl,
    });
  }

  getFeatures(coordinates: number[]) {
    this.geocoderService
      .getFeaturesFromCoordinates(coordinates)
      .pipe(take(1))
      .subscribe({
        next: (result: any) => {
          this.selectedLocation = this.sharedMapService.getLocationDetails(result);
          this.selectedStoryMarker.location = this.selectedLocation;
        },
      });
  }

  addLocationStory() {
    this.dateService.setInputtedDateValues(this.startDateControl.value, this.endDateControl.value);
    this.hasFailedSubmitAttempt = this.storyControl.invalid;
    this.mapFormValues();
    const overlappingDates = this.dateService.validateSelectedDates(
      this.storyMarkers,
      this.selectedStoryMarker,
    );
    if (overlappingDates.length > 0) {
      this.startDateControl.setErrors({invalidDate: true});
      this.resetForm();
      this.snackBarService.onError('These dates are already in use');
      return;
    }
    if (this.form.invalid) {
      this.storyControl.markAsTouched();
      this.snackBarService.onError('Please resolve errors before submitting story');
      return;
    }
    this.hasExistingStory = true;
    this.dateService.sortMarkersByStartDate(this.storyMarkers);
    this.sharedMapService.setStoryMarkers(this.storyMarkers);
  }

  mapFormValues() {
    this.selectedStoryMarker.story = this.storyControl.value;
    this.selectedStoryMarker.startDate = this.dateService.getDate(this.startDateControl.value);
    this.selectedStoryMarker.endDate = this.dateService.getDate(this.endDateControl.value);
  }

  updateStory() {
    this.hasExistingStory = false;
    this.patchForm();
  }

  resetForm() {
    this.selectedStoryMarker.startDate = '';
    this.selectedStoryMarker.endDate = '';
    this.form.reset();
  }

  patchForm() {
    this.form.patchValue({
      storyControl: this.selectedStoryMarker.story,
      startDateControl: new Date(this.selectedStoryMarker?.startDate ?? ''),
      endDateControl: new Date(this.selectedStoryMarker?.endDate ?? ''),
    });
  }

  uploadPhoto() {
    console.log('Future Integration');
  }

  closeOverlay() {
    this.mapOverlayService.closeOverlay();
  }
}
