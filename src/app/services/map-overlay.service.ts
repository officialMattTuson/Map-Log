import {ComponentRef, Injectable, Type} from '@angular/core';
import {MapOverlayDirective} from '../directives/map-overlay.directive';
import {MapOverlayComponent} from '../components/map-overlay/map-overlay.component';
import {BehaviorSubject} from 'rxjs';
import {MapDrawerComponent} from '../components/map-drawer/map-drawer.component';
import {StoryMarker} from '../models.ts/marker';
import {MenuOverlayComponent} from '../components/menu-overlay/menu-overlay.component';

@Injectable({
  providedIn: 'root',
})
export class MapOverlayService {
  private _mapDirective: MapOverlayDirective;
  private _mapOverlayComponentRef: ComponentRef<MapOverlayComponent>;

  private _isOverlayOpen = new BehaviorSubject<boolean>(false);
  public isOverlayOpen$ = this._isOverlayOpen.asObservable();

  public openPanel(
    overlayComponent: Type<MapDrawerComponent | MenuOverlayComponent>,
    storyMarkers: StoryMarker[],
    data?: any,
    locationDescription?: string,
  ): MapOverlayComponent {
    if (overlayComponent as Type<MapDrawerComponent>) {
      this.createMapComponent(
        overlayComponent as Type<MapDrawerComponent>,
        storyMarkers,
        data,
        locationDescription,
      );
    } else {
      this.createMenuComponent(overlayComponent as Type<MenuOverlayComponent>);
    }
    this._isOverlayOpen.next(true);
    return this._mapOverlayComponentRef.instance;
  }

  private createMapComponent(
    overlayComponent: Type<MapDrawerComponent>,
    storyMarkers: StoryMarker[],
    data: any,
    locationDescription?: string,
  ) {
    this._mapOverlayComponentRef =
      this._mapDirective.viewContainerRef.createComponent(MapOverlayComponent);
    if (!data && !locationDescription) {
      this._mapOverlayComponentRef.instance.createMapOverlayComponent(
        overlayComponent,
        storyMarkers,
      );
    }
    this._mapOverlayComponentRef.setInput('data', data);
    this._mapOverlayComponentRef.setInput('placeMarkerLocationDescription', locationDescription);
    this._mapOverlayComponentRef.instance.createMapOverlayComponent(
      overlayComponent,
      storyMarkers,
      data,
      locationDescription,
    );
  }

  private createMenuComponent(overlayComponent: Type<MenuOverlayComponent>) {
    this._mapOverlayComponentRef =
      this._mapDirective.viewContainerRef.createComponent(MapOverlayComponent);
    this._mapOverlayComponentRef.instance.createMenuOverlayComponent(overlayComponent);
  }

  public closeOverlay() {
    this._isOverlayOpen.next(false);
    this._mapOverlayComponentRef.destroy();
  }

  public setOverlayDirective(mapOverlayDirective: MapOverlayDirective) {
    this._mapDirective = mapOverlayDirective;
  }
}
