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
    selectedStoryMarker?: StoryMarker,
    locationDescription?: string,
  ): MapOverlayComponent {
    if (selectedStoryMarker) {
      this.createMapComponent(
        overlayComponent as Type<MapDrawerComponent>,
        storyMarkers,
        selectedStoryMarker,
        locationDescription,
        );
      } else {
      this.createMenuComponent(overlayComponent as Type<MenuOverlayComponent>, storyMarkers);
    }
    this._isOverlayOpen.next(true);
    return this._mapOverlayComponentRef.instance;
  }

  private createMapComponent(
    overlayComponent: Type<MapDrawerComponent>,
    storyMarkers: StoryMarker[],
    selectedStoryMarker: StoryMarker,
    locationDescription?: string,
  ) {
    this._mapOverlayComponentRef =
      this._mapDirective.viewContainerRef.createComponent(MapOverlayComponent);
    if (!selectedStoryMarker && !locationDescription) {
      this._mapOverlayComponentRef.instance.createMapOverlayComponent(
        overlayComponent,
        storyMarkers,
      );
    }
    this._mapOverlayComponentRef.setInput('storyMarker', selectedStoryMarker);
    this._mapOverlayComponentRef.setInput('placeMarkerLocationDescription', locationDescription);
    this._mapOverlayComponentRef.instance.createMapOverlayComponent(
      overlayComponent,
      storyMarkers,
      selectedStoryMarker,
      locationDescription,
    );
  }

  private createMenuComponent(
    overlayComponent: Type<MenuOverlayComponent>,
    storyMarkers: StoryMarker[],
  ) {

    this._mapOverlayComponentRef =
      this._mapDirective.viewContainerRef.createComponent(MapOverlayComponent);
    this._mapOverlayComponentRef.instance.createMenuOverlayComponent(overlayComponent, storyMarkers);
  }

  public closeOverlay() {
    this._isOverlayOpen.next(false);
    this._mapOverlayComponentRef.destroy();
  }

  public setOverlayDirective(mapOverlayDirective: MapOverlayDirective) {
    this._mapDirective = mapOverlayDirective;
  }
}
