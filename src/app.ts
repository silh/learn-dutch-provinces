import "ol/ol.css";
import { Map, Overlay, View } from "ol";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { OSM, Vector as VectorSource } from "ol/source";
import { GeoJSON } from "ol/format";
import { Style, Stroke, Fill, Icon } from "ol/style";
import { fromLonLat } from "ol/proj";
import { Select } from "ol/interaction";
import { click } from "ol/events/condition";

async function load() {
  const select = new Select({
    condition: click,
    style: null,
  });

  const map = new Map({
    target: "map",
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
      new VectorLayer({
        source: new VectorSource({
          url: `./geojson/provinces.json`,
          format: new GeoJSON(),
        }),
        style: new Style({
          stroke: new Stroke({
            color: "black",
            width: 1,
          }),
          fill: new Fill({
            color: "rgba(51, 136, 255, 0.5)",
          }),
        }),
      }),
    ],
    view: new View({
      projection: "EPSG:3857",
      center: fromLonLat([5.10448, 52.092876]),
      zoom: 7, // TODO add optimal zoom level
    }),
    interactions: [select],
  });

  const provinces: string[] = [
    "Drenthe",
    "Flevoland",
    // "Friesland",
    "Frisia",
    "Gelderland",
    "Groningen",
    "Limburg",
    // "Noord-Brabant",
    "North Brabant",
    // "Noord-Holland",
    "North Holland",
    "Overijssel",
    // "Zuid-Holland",
    "South Holland",
    "Utrecht",
    "Zeeland",
  ];

  let currentProvince = (Math.random() * provinces.length) | 0;
  const questionElement = document.createElement("div");
  questionElement.className = "overlay";
  questionElement.textContent = provinces[currentProvince];
  document.body.appendChild(questionElement);

  const featureOverlay = new VectorLayer({
    source: new VectorSource(),
    map: map,
    style: new Style({
      fill: new Fill({
        color: "rgba(255, 0, 0, 0.5)",
      }),
    }),
  });

  select.on("select", async (event) => {
    const selectedFeature = event.selected[0];
    if (selectedFeature.get("name") === provinces[currentProvince]) {
      currentProvince = (Math.random() * provinces.length) | 0;
      questionElement.textContent = provinces[currentProvince];
      featureOverlay.getSource()?.addFeature(selectedFeature);
      setTimeout(() => {
        featureOverlay.getSource()?.removeFeature(selectedFeature);
      }, 300);
    }
    select.getFeatures().clear();
  });
}

load();
