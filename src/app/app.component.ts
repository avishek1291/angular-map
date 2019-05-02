import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import Directions from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import { Map, GeolocationControl} from 'mapbox-gl';
import { MapService } from './map.service';
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
    constructor(private mapService: MapService) {
        this.markers = this.mapService.getMarker();
        this.data = {


            type: 'FeatureCollection',


            features: this.markers


        };
    }
    ngOnInit() {
        mapboxgl.accessToken = 'pk.eyJ1IjoiYXZpc2hlazEyOTEiLCJhIjoiY2pxM3gxOGIzMWl3dzQzankyNDVpZzJsaiJ9.40Oie47hwbk79cmE4hEndQ';

        this.map = new Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/bright-v8',
            center: [73.8567, 18.5204], // starting position [lng, lat]
            zoom: 9, // starting zoom
            pitchWithRotate: true
        });
        // Add User location

    }
    ngAfterViewInit() {
        this.map.on('load', (e) => {
            console.log(e, 'inside on load');
            this.map.addSource('customMarker', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: []
                }
            });
            this.map.addControl(new Directions({
                accessToken: mapboxgl.accessToken
                }), 'top-left');
            this.map.getSource('customMarker').setData(this.data);
            console.log('custom marker data', this.map.getSource('customMarker'));
            this.map.addLayer({
                'id': 'customMarketid',
                'source': 'customMarker',
                'type': 'symbol',
                'layout': {
                    'text-field': '{message}',
                    'text-size': 24,
                    'text-transform': 'uppercase',
                    'icon-image': 'marker-15',
                    'text-offset': [0, 1.5]
                },
                'paint': {
                    'text-color': '#f16624',
                    'text-halo-color': '#fff',
                    'text-halo-width': 2
                }
            });


            this.map.addLayer({
                'id': 'urban-areas-fill',
                'type': 'fill',
                'source': {
                'type': 'geojson',
                'data': 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_urban_areas.geojson'
                },
                'layout': {
                    'visibility': 'visible'
                },
                'paint': {
                'fill-color': '#f08',
                'fill-opacity': 0.4
                }
                // This is the important part of this example: the addLayer
                // method takes 2 arguments: the layer as an object, and a string
                // representing another layer's name. if the other layer
                // exists in the stylesheet already, the new layer will be positioned
                // right before that layer in the stack, making it possible to put
                // 'overlays' anywhere in the layer stack.
                // Insert the layer beneath the first symbol layer.
                });
        });
    }
}
