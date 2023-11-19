import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedMapService {
  constructor() {}
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
        selectedLocations= feature.place_name;
        conditionMet = true;
      }
    });
    return selectedLocations;
  }
}
