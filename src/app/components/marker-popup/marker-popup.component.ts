import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MapOverlayService} from 'src/app/services/map-overlay.service';
import {MapDrawerComponent} from '../map-drawer/map-drawer.component';
import {StoryMarker} from 'src/app/models.ts/marker';
import {Popup} from 'mapbox-gl';

@Component({
  selector: 'app-marker-popup',
  templateUrl: './marker-popup.component.html',
  styleUrls: ['./marker-popup.component.scss'],
})
export class MarkerPopupComponent implements OnInit {
  @Input() location: string;
  @Input() selectedStoryMarker: StoryMarker;
  @Input() storyMarkers: StoryMarker[];
  @Input() placeMarkerConfirmationPopup: boolean;
  @Input() popup: Popup;
  @Output() placeMarkerClicked = new EventEmitter<string>();

  dateMessage: string;

  constructor(private readonly mapOverlayService: MapOverlayService) {}

  ngOnInit(): void {
    this.setDateMessage();
  }

  setDateMessage() {
    const {startDate, endDate} = this.selectedStoryMarker;
    if (startDate && endDate) {
      this.dateMessage = `${startDate} - ${endDate}`;
    }
  }

  onPlaceMarker() {
    this.placeMarkerClicked.emit(this.location);
  }

  openOverlay() {
    this.popup.remove();
    const element = document.querySelector('.map-drawer') as HTMLElement;
    element.style.width = '100vw';
    element.style.height = '42vh';
    element.style.transform = 'translate3d(0, 100%, 0)';
    this.mapOverlayService.openPanel(
      MapDrawerComponent,
      this.storyMarkers,
      this.selectedStoryMarker,
      this.location,
    );
    this.placeMarkerConfirmationPopup = false;
  }
}
