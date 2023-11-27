import * as mapboxgl from "mapbox-gl";

export interface StoryMarker {
  marker: mapboxgl.Marker;
  story: string;
  startDate: string;
  endDate: string;
  photo?: any;
}
