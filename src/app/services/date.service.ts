import {Injectable} from '@angular/core';
import {StoryMarker} from '../models.ts/marker';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  private _inputtedStartDate: string;
  private _inputtedEndDate: string;

  public setInputtedDateValues(startDate: Date, endDate: Date) {
    this._inputtedStartDate = this.getDate(startDate);
    this._inputtedEndDate = this.getDate(endDate);
  }

  public validateSelectedDates(
    storyMarkers: StoryMarker[],
    selectedStoryMarker: StoryMarker,
  ): string[] {
    let currentMarkerSelectedDates: string[] = [];
    let listOfUsedDatesSelected: string[] = [];
    storyMarkers.forEach(marker => {
      if (marker.story === selectedStoryMarker.story) {
        currentMarkerSelectedDates = this.getDatesInRange([
          this._inputtedStartDate,
          this._inputtedEndDate,
        ]);
        return;
      }
      const markerDates: string[] = [marker.startDate, marker.endDate];
      listOfUsedDatesSelected = listOfUsedDatesSelected.concat(
        this.getDatesInRange(markerDates),
      );
    });
    const overlappingDates = this.findCommonValues(
      currentMarkerSelectedDates,
      listOfUsedDatesSelected,
    );
    return overlappingDates;
  }

  private findCommonValues(selectedDates: string[], existingDates: string[]): string[] {
    let overlappingDates: string[] = [];
    existingDates.forEach(date => {
      if (selectedDates.includes(date)) {
        overlappingDates.push(date);
      }
    });
    return overlappingDates;
  }

  private getDatesInRange(setDates: string[]) {
    const startDate = setDates[0];
    const endDate = setDates[1];
    const daysBetweenStartAndEndDates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
      daysBetweenStartAndEndDates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    const formattedDates: string[] = daysBetweenStartAndEndDates.map(date => {
      return this.getDate(date);
    });

    return formattedDates;
  }

  public getDate(selectedDate: Date): string {
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(selectedDate);
    return formattedDate.replace(',', '');
  }

  public compareDateSets(storyMarkers: StoryMarker[]): StoryMarker[] {
    return storyMarkers.sort((a, b) => this.findEarliestDate(a.startDate) - this.findEarliestDate(b.startDate));
  }

  private findEarliestDate(startDate: string): number {
    return new Date(startDate).getTime();
  }
}
