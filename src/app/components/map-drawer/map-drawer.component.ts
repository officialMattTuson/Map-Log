import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
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
  form: FormGroup;
  markers: Marker[];
  mappedMarkers: LngLat[];
  selectedLocation: string;
  locationDescription: string;
  hasSubmitted: boolean;
  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  constructor(
    private readonly geocoderService: GeocoderService,
    private readonly sharedMapService: SharedMapService,
    private readonly mapOverlayService: MapOverlayService,
    protected formBuilder: FormBuilder,
  ) {}

  ngOnInit() {
    this.createForm();
    if (this.locationDescription) {
      this.selectedLocation = this.locationDescription;
      return;
    }
    this.mappedMarkers = this.markers.map(marker => marker.getLngLat());
    this.getFeatures();
  }

  createForm() {
    this.form = this.formBuilder.group({
      locationStory: ['', Validators.required],
    });
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
            (this.selectedLocation =
              this.sharedMapService.getLocationDetails(result)),
        });
    });
  }

  addLocationStory() {
    this.hasSubmitted = true;
    console.log(this.form.value);
  }

  closeOverlay() {
    this.mapOverlayService.closeOverlay();
  }
}
