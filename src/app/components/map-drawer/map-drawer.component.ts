import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core'
import {FeatureIdentifier, LngLat, Marker} from 'mapbox-gl'
import {take} from 'rxjs'
import {GeocoderService} from 'src/app/endpoints/geocoder.service'

@Component({
  selector: 'app-map-drawer',
  templateUrl: './map-drawer.component.html',
  styleUrls: ['./map-drawer.component.scss'],
})
export class MapDrawerComponent implements OnChanges {
  constructor(private readonly geocoderService: GeocoderService) {}
  @Input() markers: Marker[]
  mappedMarkers: LngLat[]
  selectedLocations: any[] = []

  ngOnChanges(changes: SimpleChanges) {
    this.mappedMarkers = this.markers.map(marker => marker.getLngLat())
    this.getFeatures()
  }

  getFeatures() {
    const convertedCoordinates: number[][] = this.mappedMarkers.map(
      ({lng, lat}) => [lng, lat],
    )
    convertedCoordinates.forEach(coordsSet => {
      this.geocoderService
        .getFeaturesFromCoordinates(coordsSet)
        .pipe(take(1))
        .subscribe({
          next: (result: any) => {
            result.features.forEach((feature: any) => {
              if (feature.place_type[0] === 'locality') {
                this.selectedLocations.push(feature.place_name)
              }
            })
            console.log(this.selectedLocations)
          },
        })
    })
  }
}
