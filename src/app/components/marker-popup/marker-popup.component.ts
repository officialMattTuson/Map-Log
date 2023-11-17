import {Component, EventEmitter, Input, Output} from '@angular/core';
import { MapOverlayService } from 'src/app/services/map-overlay.service';
import { MapDrawerComponent } from '../map-drawer/map-drawer.component';

@Component({
  selector: 'app-marker-popup',
  templateUrl: './marker-popup.component.html',
  styleUrls: ['./marker-popup.component.scss'],
})
export class MarkerPopupComponent {
  @Input() location: string;
  @Input() placeMarkerConfirmationPopup: boolean;
  @Output() placeMarkerClicked = new EventEmitter<void>();

  constructor(private readonly mapOverlayService: MapOverlayService) {}
  onPlaceMarker() {
    this.placeMarkerClicked.emit();
  }

  openOverlay() {
    this.mapOverlayService.openPanel(MapDrawerComponent, null, this.location);
  }
}
