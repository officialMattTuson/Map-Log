import {Component, ComponentRef, Input, Type, ViewChild} from '@angular/core';
import {MapDrawerComponent} from '../map-drawer/map-drawer.component';
import {MapOverlayDirective} from 'src/app/directives/map-overlay.directive';
import {Subject} from 'rxjs';
import {MapOverlayService} from 'src/app/services/map-overlay.service';
import {StoryMarker} from 'src/app/models.ts/marker';

@Component({
  selector: 'app-map-overlay',
  templateUrl: './map-overlay.component.html',
  styleUrls: ['./map-overlay.component.scss'],
})
export class MapOverlayComponent {
  @Input() storyMarker: StoryMarker;
  @Input() placeMarkerLocationDescription: string;

  mapOverlayComponentRef: ComponentRef<MapDrawerComponent>;
  overlayHeader: string;

  @ViewChild(MapOverlayDirective, {static: true})
  mapOverlayDirective: MapOverlayDirective;
  destroy$ = new Subject<boolean>();

  constructor(private readonly mapOverlayService: MapOverlayService) {}

  createMapOverlayComponent(
    overlayComponent: Type<MapDrawerComponent>,
    storyMarkers: StoryMarker[],
    storyMarker?: StoryMarker,
    selectedLocation?: string,
  ) {
    const containerRef = this.mapOverlayDirective.viewContainerRef;
    this.mapOverlayComponentRef =
    containerRef.createComponent<MapDrawerComponent>(overlayComponent);
    storyMarker && (this.mapOverlayComponentRef.instance.selectedStoryMarker = storyMarker);
    this.mapOverlayComponentRef.instance.storyMarkers = storyMarkers;
    if (selectedLocation) {
      this.mapOverlayComponentRef.instance.selectedLocation =
      selectedLocation;
    }
  }

  closeOverlay() {
    this.mapOverlayService.closeOverlay();
  }
}
