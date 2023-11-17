import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedMapService {
  constructor() {}
  public getLocationDetails(result: any): any {
    let conditionMet = false;
    let selectedLocations: any = [];
    result.features.forEach((feature: any) => {
      if (!conditionMet && feature.place_type[0] === 'locality') {
        selectedLocations.push(feature.place_name);
        conditionMet = true;
      } else if (!conditionMet && feature.place_type[0] === 'place') {
        selectedLocations.push(feature.place_name);
        conditionMet = true;
      } else if (!conditionMet && feature.place_type[0] === 'region') {
        selectedLocations.push(feature.place_name);
        conditionMet = true;
      }
    });
    return selectedLocations;
  }
}
