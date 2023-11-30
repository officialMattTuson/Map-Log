import {ComponentRef, Injectable, Type} from '@angular/core';
import {MapOverlayDirective} from '../directives/map-overlay.directive';
import {MapOverlayComponent} from '../components/map-overlay/map-overlay.component';
import {BehaviorSubject} from 'rxjs';
import {MapDrawerComponent} from '../components/map-drawer/map-drawer.component';
import { StoryMarker } from '../models.ts/marker';

@Injectable({
  providedIn: 'root',
})
export class MapOverlayService {
  private _mapDirective: MapOverlayDirective;
  private _mapOverlayComponentRef: ComponentRef<MapOverlayComponent>;

  private _isOverlayOpen = new BehaviorSubject<boolean>(false);
  public isOverlayOpen$ = this._isOverlayOpen.asObservable();

  public openPanel(
    overlayComponent: Type<MapDrawerComponent>,
    storyMarkers: StoryMarker[],
    data?: any,
    locationDescription?: string
  ): MapOverlayComponent {
    this.createHostComponent(overlayComponent, storyMarkers, data, locationDescription);
    this._isOverlayOpen.next(true);
    return this._mapOverlayComponentRef.instance;
  }

  private createHostComponent(
    overlayComponent: Type<MapDrawerComponent>,
    storyMarkers: StoryMarker[],
    data: any,
    locationDescription?: string
  ) {
    this._mapOverlayComponentRef =
      this._mapDirective.viewContainerRef.createComponent(MapOverlayComponent);
      if (!data && !locationDescription) {
        this._mapOverlayComponentRef.instance.createMapOverlayComponent(
          overlayComponent, storyMarkers
        );
      }
    this._mapOverlayComponentRef.setInput('data', data);
    this._mapOverlayComponentRef.setInput('placeMarkerLocationDescription', locationDescription);
    this._mapOverlayComponentRef.instance.createMapOverlayComponent(
      overlayComponent, storyMarkers, data, locationDescription
    );
  }

  public closeOverlay() {
    this._isOverlayOpen.next(false);
    this._mapOverlayComponentRef.destroy();
  }

  public setOverlayDirective(mapOverlayDirective: MapOverlayDirective) {
    this._mapDirective = mapOverlayDirective;
  }
}
