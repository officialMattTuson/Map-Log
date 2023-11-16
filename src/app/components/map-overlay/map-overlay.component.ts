import {Component, ComponentRef, Input, Type, ViewChild} from '@angular/core';
import {MapDrawerComponent} from '../map-drawer/map-drawer.component';
import {MapOverlayDirective} from 'src/app/directives/map-overlay.directive';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-map-overlay',
  templateUrl: './map-overlay.component.html',
  styleUrls: ['./map-overlay.component.scss'],
})
export class MapOverlayComponent {
  @Input() data: any;

  mapOverlayComponentRef: ComponentRef<MapDrawerComponent>;
  overlayHeader: string;

  @ViewChild(MapOverlayDirective, {static: true})
  mapOverlayDirective: MapOverlayDirective;
  destroy$ = new Subject<boolean>();

  createMapOverlayComponent(overlayComponent: Type<MapDrawerComponent>) {
    const containerRef = this.mapOverlayDirective.viewContainerRef;
    this.mapOverlayComponentRef =
      containerRef.createComponent<MapDrawerComponent>(overlayComponent);
  }
}
