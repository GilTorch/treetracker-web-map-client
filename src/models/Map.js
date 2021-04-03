/*
 * The main model for the treetracker model
 */
import  log from "loglevel";
import expect from "expect-runtime";

export default class Map{

  constructor(options){

    options = {...{
      L: window.L,
      minZoom: 2,
      maxZoom: 20,
      initialCenter: [20, 0],
      tileServerUrl: process.env.REACT_APP_TILE_SERVER_URL,
    }, ...options};

    Object.keys(options).forEach(key => {
      this[key] = options[key];
    });
    log.info("options:", options);
  }

  mount(domElement){
    const mapOptions = {
      minZoom: this.minZoom,
      center: this.initialCenter,
    }
    this.map = this.L.map(domElement, mapOptions);

    //google satillite map
    this.layerGoogle = this.L.gridLayer.googleMutant({
      maxZoom: this.maxZoom,
      type: 'satellite'
    });
    this.layerGoogle.addTo(this.map);

    //tile 
    this.layerTile = new this.L.tileLayer(
      `${this.tileServerUrl}{z}/{x}/{y}.png`,
      {
        minZoom: this.minZoom,
        maxZoom: this.maxZoom,
      }
    );
    this.layerTile.addTo(this.map);

    this.layerUtfGrid = new this.L.utfGrid(
      `${this.tileServerUrl}{z}/{x}/{y}.grid.json`,
      {
        minZoom: this.minZoom,
        maxZoom: this.maxZoom,
      }
    );
    this.layerUtfGrid.addTo(this.map);

    this.map.on("load", () => {
      log.info("map loaded");
      expect(this.onLoad).defined();
      this.onLoad && this.onLoad();
    });

    this.map.setView(this.initialCenter, this.minZoom);
  }

}