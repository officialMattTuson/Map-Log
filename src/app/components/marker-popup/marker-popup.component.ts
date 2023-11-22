import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MapOverlayService} from 'src/app/services/map-overlay.service';
import {MapDrawerComponent} from '../map-drawer/map-drawer.component';
import {StoryMarker} from 'src/app/models.ts/marker';
import {Popup} from 'mapbox-gl';

@Component({
  selector: 'app-marker-popup',
  templateUrl: './marker-popup.component.html',
  styleUrls: ['./marker-popup.component.scss'],
})
export class MarkerPopupComponent {
  @Input() location: string;
  @Input() selectedStoryMarker: StoryMarker;
  @Input() placeMarkerConfirmationPopup: boolean;
  @Input() popup: Popup;
  @Output() placeMarkerClicked = new EventEmitter<void>();

  constructor(private readonly mapOverlayService: MapOverlayService) {}
  onPlaceMarker() {
    this.placeMarkerClicked.emit();
  }

  openOverlay() {
    this.mapOverlayService.openPanel(
      MapDrawerComponent,
      this.selectedStoryMarker,
      this.location,
    );
    this.popup.remove();
    this.placeMarkerConfirmationPopup = false;
  }
}
