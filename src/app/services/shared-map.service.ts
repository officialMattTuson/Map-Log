import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {StoryMarker} from '../models.ts/marker';

@Injectable({
  providedIn: 'root',
})
export class SharedMapService {
  constructor() {}

  private _storyMarkers = new Subject<StoryMarker[]>();
  public $storyMarkers = this._storyMarkers.asObservable();

  public setStoryMarkers(storyMarkers: StoryMarker[]) {
    this._storyMarkers.next(storyMarkers);
  }

  public getLocationDetails(result: any): string {
    let conditionMet = false;
    let selectedLocations = '';
    result.features.forEach((feature: any) => {
      if (!conditionMet && feature.place_type[0] === 'locality') {
        selectedLocations = feature.place_name;
        conditionMet = true;
      } else if (!conditionMet && feature.place_type[0] === 'place') {
        selectedLocations = feature.place_name;
        conditionMet = true;
      } else if (!conditionMet && feature.place_type[0] === 'region') {
        selectedLocations = feature.place_name;
        conditionMet = true;
      }
    });
    return selectedLocations;
  }
}
