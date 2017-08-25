import { Injectable } from '@angular/core';

import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';


@Injectable()
export class MapData {
  private mapCache: any = {};
  private spotCache: any = {};

  constructor(public http: Http) { }

  private loadSpot(mapName : string, strategy : string, spotId : string): Observable<any> {
    if (this.spotCache[spotId]) {
      return Observable.of(this.spotCache[spotId]);
    } else {
      return this.http.get('https://csgospots-1f294.firebaseio.com/fspots/'
         + spotId + '.json')
        .map((data) => {
          let spot = data.json();
          this.spotCache[spotId] = spot;
          return spot || { };
        });
    }
  }

  public getSpot(mapName : string, strategy : string, spotId : string) {
    return this.loadSpot(mapName, strategy, spotId);
  }


  // OBSOLETE?
  private loadSpotInformation(spotId : string): Observable<any> {
    return this.http.get('https://csgospots-1f294.firebaseio.com/fspots/'
        + spotId + '.json')
      .map((data) => {
        return data.json();
      });
  }

  public getSpotInformation(spotId : string) {
    return this.loadSpotInformation(spotId);
  }

  private loadSpots(mapName : string, strategy : string): Observable<any> {
    return this.http.get('https://csgospots-1f294.firebaseio.com/spots.json?orderBy="path"&equalTo="'
        + mapName + '/' + strategy + '"')
      .map((data) => {
        return data.json();
      });
  }

  public getSpots(mapName : string, strategy : string) {
    return this.loadSpots(mapName, strategy);
  }


  // USE MENU STRUCTURE ENTITY
  private loadLocations(mapName : string, strategy : string): Observable<any> {
    return this.http.get('https://csgospots-1f294.firebaseio.com/locations/'
        + mapName + '/' + strategy + '.json')
      .map((data) => {
        return data.json();
      });
  }

  public getLocations(mapName : string, strategy : string) {
    return this.loadLocations(mapName, strategy);
  }
}
