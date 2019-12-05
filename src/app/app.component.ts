import { Component, ViewChild, AfterViewInit, OnInit, NgZone } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import Directions from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import { Map, GeolocationControl } from 'mapbox-gl';
import { MapService } from './map.service';
import MapboxTraffic from '@mapbox/mapbox-gl-traffic';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('map') map: Map;
  title = 'app';
  markers: any;
  data: any;
  messageCount = 0;
  layerId = '';
  constructor(private mapService: MapService, private zone: NgZone) {}
  ngOnInit() {
    mapboxgl.accessToken =
      'pk.eyJ1IjoiYXZpc2hlazEyOTEiLCJhIjoiY2pxM3gxOGIzMWl3dzQzankyNDVpZzJsaiJ9.40Oie47hwbk79cmE4hEndQ';

    this.map = new Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/dark-v9',
      center: [88.3639, 22.5726], // starting position [lng, lat]
      zoom: 9, // starting zoom
      pitchWithRotate: true,
      pitch: 40,
      showTraffic: false,
      antialias: true

    });

    this.mapService.message.subscribe(data => {
      if (data) {
        this.markers = this.mapService.getMarker(data);
        console.log('markers', this.markers);
        this.data = {
          type: 'FeatureCollection',

          features: this.markers
        };
        this.setDataLayer();
      }
    });
    // Add User location
  }
  ngAfterViewInit() {
    /**
     * Add a source called custom marker
     */
    this.map.on('load', e => {
      console.log(e, 'inside on load');
      this.map.addSource('customMarker', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });
      this.map.addLayer({
        id: 'customMarketid',
        source: 'customMarker',
        type: 'symbol',
        layout: {
          'text-field': '{message}',
          'text-size': 24,
          'text-transform': 'uppercase',
          'icon-image': 'marker-15',
          'text-offset': [0, 1.5]
        },
        paint: {
          'text-color': '#f16624',
          'text-halo-color': '#fff',
          'text-halo-width': 2
        }
      });

      this.zone.runOutsideAngular(() => {
        const layers = this.map.getStyle().layers;
        let labelLayerId;
        for (let i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
        labelLayerId = layers[i].id;
        console.log('layer id', labelLayerId);
        break;
        }
        }
        this.map.addLayer({
        'id': '3d-buildings',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': 15,
        'paint': {
        'fill-extrusion-color': '#aaa',
        // use an 'interpolate' expression to add a smooth transition effect to the
        // buildings as the user zooms in
        'fill-extrusion-height': [
        'interpolate', ['linear'], ['zoom'],
        15, 0,
        15.05, ['get', 'height']
        ],
        'fill-extrusion-base': [
        'interpolate', ['linear'], ['zoom'],
        15, 0,
        15.05, ['get', 'min_height']
        ],
        'fill-extrusion-opacity': .6
        }
        }, labelLayerId);
      });
      /**
       * Add a user control for navigation
       */
      this.map.addControl(
        new Directions({
          accessToken: mapboxgl.accessToken
        }),
        'top-left'
      );
      this.map.addControl(new MapboxTraffic());
      /**
       * Add a sample layer for showing urbaniation of population
       */
    });
  }

  setDataLayer() {
    this.messageCount++;
    console.log(this.messageCount, ')))))');
    this.map.getSource('customMarker').setData(this.data);
    console.log('custom marker data', this.map.getSource('customMarker'));
  }

  removeLayer() {
    if (this.map.getLayer('urban-areas-fill')) {
      this.map.removeLayer('urban-areas-fill');
      this.map.removeSource('urban-areas-fill');
    } else {
      console.log('inside else part');
      this.map.addLayer({
        id: 'urban-areas-fill',
        type: 'fill',
        source: {
          type: 'geojson',
          data:
            'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_urban_areas.geojson'
        },
        layout: {
          visibility: 'visible'
        },
        paint: {
          'fill-color': '#f08',
          'fill-opacity': 0.2
        }
        // This is the important part of this example: the addLayer
        // method takes 2 arguments: the layer as an object, and a string
        // representing another layer's name. if the other layer
        // exists in the stylesheet already, the new layer will be positioned
        // right before that layer in the stack, making it possible to put
        // 'overlays' anywhere in the layer stack.
        // Insert the layer beneath the first symbol layer.
      });
    }
  }

  removeTraffic() {
    console.log('this.map', this.map);
  }
}
