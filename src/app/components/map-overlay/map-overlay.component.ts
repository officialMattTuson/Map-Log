import {Component, ComponentRef, Input, Type, ViewChild} from '@angular/core';
import {MapDrawerComponent} from '../map-drawer/map-drawer.component';
import {MapOverlayDirective} from 'src/app/directives/map-overlay.directive';
import {Subject} from 'rxjs';
import {MapOverlayService} from 'src/app/services/map-overlay.service';

@Component({
  selector: 'app-map-overlay',
  templateUrl: './map-overlay.component.html',
  styleUrls: ['./map-overlay.component.scss'],
})
export class MapOverlayComponent {
  @Input() data: any;
  @Input() placeMarkerLocationDescription: string;

  mapOverlayComponentRef: ComponentRef<MapDrawerComponent>;
  overlayHeader: string;

  @ViewChild(MapOverlayDirective, {static: true})
  mapOverlayDirective: MapOverlayDirective;
  destroy$ = new Subject<boolean>();

  constructor(private readonly mapOverlayService: MapOverlayService) {}

  createMapOverlayComponent(
    overlayComponent: Type<MapDrawerComponent>,
    data: any,
    locationDescription?: string
  ) {
    const containerRef = this.mapOverlayDirective.viewContainerRef;
    this.mapOverlayComponentRef =
      containerRef.createComponent<MapDrawerComponent>(overlayComponent);
    this.mapOverlayComponentRef.instance.markers = data;
    if (locationDescription) {
      this.mapOverlayComponentRef.instance.locationDescription = locationDescription;
    }
  }

  closeOverlay() {
    this.mapOverlayService.closeOverlay();
  }
}
