import { Injectable } from '@angular/core';

@Injectable()
export class MapService {

  constructor() { }
  getMarker() {
    const geoJson = [{
      'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': ['80.20929129999999', '13.0569951']
        },
        'properties': {
          'message': 'Chennai'
        }

    },
    {
      'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': ['77.350048', '12.953847' ]
        },
        'properties': {
          'message': 'Bengaluru'
        }

    }];
    return geoJson;
  }
}
