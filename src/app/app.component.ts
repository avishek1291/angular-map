import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { Map } from 'mapbox-gl';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild("map") map: Map;
  title = 'app';

  ngOnInit() {

    mapboxgl.accessToken = 'secret';   

    this.map = new Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v9',
      zoom: 5,
      center: [-78.880453, 42.897852]
    });

    this.map.on('load', this.onLoad);
  }

  onLoad(){
    console.log("map is loaded, can I still talk to it?");

    this.map.addLayer({
      "id": "points",
      "type": "symbol",
      "source": {
          "type": "geojson",
          "data": {
              "type": "FeatureCollection",
              "features": [{
                  "type": "Feature",
                  "geometry": {
                      "type": "Point",
                      "coordinates": [-77.03238901390978, 38.913188059745586]
                  },
                  "properties": {
                      "title": "Mapbox DC",
                      "icon": "monument"
                  }
              }, {
                  "type": "Feature",
                  "geometry": {
                      "type": "Point",
                      "coordinates": [-122.414, 37.776]
                  },
                  "properties": {
                      "title": "Mapbox SF",
                      "icon": "harbor"
                  }
              }]
          }
      },
      "layout": {
          "icon-image": "{icon}-15",
          "text-field": "{title}",
          "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
          "text-offset": [0, 0.6],
          "text-anchor": "top"
      }
  });

  }

}
