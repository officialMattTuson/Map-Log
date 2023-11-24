import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
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

  listOfUsedDatesSelected: any[] = [];

  constructor(
    private readonly geocoderService: GeocoderService,
    private readonly sharedMapService: SharedMapService,
    private readonly mapOverlayService: MapOverlayService,
  ) {}

  ngOnInit() {
    this.hasExistingStory = this.selectedStoryMarker.story.length > 0;
    this.createForm();
    const coordinates = this.selectedStoryMarker.marker.getLngLat();
    const mappedCoords = [coordinates.lng, coordinates.lat];
    this.getFeatures(mappedCoords);
  }

  createForm() {
    this.storyControl = new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]);
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
        next: (result: any) =>
          (this.selectedLocation =
            this.sharedMapService.getLocationDetails(result)),
      });
  }

  addLocationStory() {
    this.hasFailedSubmitAttempt = this.storyControl.invalid;
    if (this.form.invalid) {
      this.storyControl.markAsTouched();
      return;
    }
    this.selectedStoryMarker.story = this.storyControl.value;
    this.selectedStoryMarker.startDate = this.getDate(
      this.startDateControl.value,
      );
      this.selectedStoryMarker.endDate = this.getDate(this.endDateControl.value);
      this.validateSelectedDates();
    this.hasExistingStory = true;
  }

  validateSelectedDates() {
    let currentMarkerSelectedDates: string[] = [];
    this.storyMarkers.forEach(marker => {
      if (!marker.startDate || !marker.endDate) {
        return;
      }
      if (marker.story === this.selectedStoryMarker.story) {
        currentMarkerSelectedDates.push(this.getDatesInRange([this.startDateControl.value, this.endDateControl.value]));
        return;
      }
      const markerDates: string[] = [marker.startDate, marker.endDate];
      this.listOfUsedDatesSelected.push(this.getDatesInRange(markerDates));
    });
  }

  getDatesInRange(setDates: string[]) {
    const startDate = setDates[0];
    const endDate = setDates[1];
    const daysBetweenStartAndEndDates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
      daysBetweenStartAndEndDates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    const formattedDates: string[] = daysBetweenStartAndEndDates.map(date => {
      return this.getDate(date);
    });

    return formattedDates.join(' ');
  }

  updateStory() {
    this.hasExistingStory = false;
    this.patchForm();
  }

  patchForm() {
    this.form.patchValue({
      storyControl: this.selectedStoryMarker.story,
      startDateControl: new Date(this.selectedStoryMarker?.startDate ?? ''),
      endDateControl: new Date(this.selectedStoryMarker?.endDate ?? ''),
    });
  }

  getDate(selectedDate: Date): string {
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(selectedDate);
    return formattedDate;
  }

  uploadPhoto() {
    console.log('Future Integration');
  }

  closeOverlay() {
    this.mapOverlayService.closeOverlay();
  }
}
