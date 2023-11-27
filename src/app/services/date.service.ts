import {Injectable} from '@angular/core';
import {StoryMarker} from '../models.ts/marker';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  inputtedStartDate: string;
  inputtedEndDate: string;

  setInputtedDateValues(startDate: Date, endDate: Date) {
    this.inputtedStartDate = this.getDate(startDate);
    this.inputtedEndDate = this.getDate(endDate);
  }

  validateSelectedDates(
    storyMarkers: StoryMarker[],
    selectedStoryMarker: StoryMarker,
  ): string[] {
    let currentMarkerSelectedDates: string[] = [];
    let listOfUsedDatesSelected: string[] = [];
    storyMarkers.forEach(marker => {
      if (marker.story === selectedStoryMarker.story) {
        currentMarkerSelectedDates = this.getDatesInRange([
          this.inputtedStartDate,
          this.inputtedEndDate,
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

  findCommonValues(selectedDates: string[], existingDates: string[]): string[] {
    let overlappingDates: string[] = [];
    existingDates.forEach(date => {
      if (selectedDates.includes(date)) {
        overlappingDates.push(date);
      }
    });
    return overlappingDates;
  }

  getDatesInRange(setDates: string[]) {
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

  getDate(selectedDate: Date): string {
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(selectedDate);
    return formattedDate.replace(',', '');
  }
}
