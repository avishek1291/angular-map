import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable} from 'rxjs/observable';
import { Subject } from 'rxjs/Subject';
@Injectable()
export class MapService {
  private chatUrl = 'http://localhost:9000/';

  private socket;

  public message = new Subject<any>();
  constructor() {
    this.socket = io(this.chatUrl);
    this.socket.on('new-message', (message) => {
// console.log(message, 'received');
      this.message.next(message.results);
    });

  }
  getMarker(data: Array<any>) {
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
    data.forEach(aPosition => {
      if (aPosition.position) {
      const tempObj = {
         type: 'Feature',
         geometry: {
           'type': 'Point',
           coordinates: [aPosition.position[1], aPosition.position[0]]
         },
         'properties': {
           'message': aPosition.title + '20',
            'icon': {
              className: 'my-icon', // class name to style
              html: '★', // add content inside the marker, in this case a star
              iconSize: null // size of icon, use null to set the size in CSS
            }
         }
      };
      geoJson.push(tempObj);
  }
     });
    return geoJson;
  }
}
