import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { LngLat, Marker } from 'mapbox-gl';

@Component({
  selector: 'app-map-drawer',
  templateUrl: './map-drawer.component.html',
  styleUrls: ['./map-drawer.component.scss']
})
export class MapDrawerComponent implements OnChanges {

  @Input() markers: Marker[];
  mappedMarkers: LngLat[];
  
  ngOnChanges(changes: SimpleChanges) {
    console.log(changes)
    this.mappedMarkers = this.markers.map(marker => marker.getLngLat());
  }
}
