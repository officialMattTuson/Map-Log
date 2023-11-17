import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-marker-popup',
  templateUrl: './marker-popup.component.html',
  styleUrls: ['./marker-popup.component.scss'],
})
export class MarkerPopupComponent {
  @Input() location: string;
  @Input() placeMarkerConfirmationPopup: boolean;
  @Output() placeMarkerClicked = new EventEmitter<void>();

  onPlaceMarker() {
    this.placeMarkerClicked.emit();
  }
}
