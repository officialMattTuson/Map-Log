import * as mapboxgl from "mapbox-gl";

export interface StoryMarker {
  marker: mapboxgl.Marker;
  story: string;
  date?: any;
  photo?: any;
}
