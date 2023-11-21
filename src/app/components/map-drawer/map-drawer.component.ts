import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {Component, OnInit, ViewChild} from '@angular/core';
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
  form: FormGroup;
  storyMarker: StoryMarker;
  selectedLocation: string;
  locationDescription: string;
  hasFailedSubmitAttempt: boolean;
  hasExistingStory = false;
  storyControl: FormControl;
  startDateControl: FormControl;
  endDateControl: FormControl;

  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  constructor(
    private readonly geocoderService: GeocoderService,
    private readonly sharedMapService: SharedMapService,
    private readonly mapOverlayService: MapOverlayService,
  ) {}

  ngOnInit() {
    this.hasExistingStory = this.storyMarker.story.length > 0;
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
    this.storyControl = new FormControl(
      this.storyMarker.story.length === 0 ? this.storyMarker.story : '',
      [Validators.required, Validators.minLength(3)],
    );
    this.startDateControl = new FormControl(null, Validators.required);
    this.endDateControl = new FormControl(null, Validators.required);
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
    this.storyMarker.story = this.storyControl.value;
    this.storyMarker.startDate = this.getDate(this.startDateControl.value);
    this.storyMarker.endDate = this.getDate(this.endDateControl.value);
    this.hasExistingStory = true;
  }

  updateStory() {
    this.hasExistingStory = false;
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
