import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class GeocoderService {
  constructor(private http: HttpClient) {}

  getFeaturesFromCoordinates(lngLat: number[]): Observable<any> {
    const accessToken = environment.mapboxAccessToken;
    const apiUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lngLat[0]},${lngLat[1]}.json`;

    return this.http.get(apiUrl, {params: {access_token: accessToken}});
  }
}
