import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FeatureCollection } from "geojson";

async function load() {
  const map = L.map("map").setView([52.092876, 5.10448], 7);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 7,
    minZoom: 7,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  const provinces: string[] = [
    "Drenthe",
    "Flevoland",
    "Friesland",
    "Gelderland",
    "Groningen",
    "Limburg",
    "Noord-Brabant",
    "Noord-Holland",
    "Overijssel",
    "Zuid-Holland",
    "Utrecht",
    "Zeeland",
  ];
  const promises: Promise<void>[] = [];
  let currentProvince = (Math.random() * provinces.length) | 0;
  const questionElement = document.createElement("div");
  questionElement.className = "overlay";
  for (const province of provinces) {
    promises.push(
      (async () => {
        const json: FeatureCollection = await import(
          `./geojson/${province.toLowerCase()}.json`
        );
        L.geoJSON(json.features[0], {
          onEachFeature: (feature, layer) => {
            layer.on("click", (e) => {
              if (provinces[currentProvince] === province) {
                const text = document.createElement("div");
                text.textContent = "🚀";
                L.popup().setLatLng(e.latlng).setContent(text).openOn(map);
                
                currentProvince = (Math.random() * provinces.length) | 0;
                questionElement.textContent = provinces[currentProvince];
              }
            });
          },
        }).addTo(map);
      })()
    );
  }
  Promise.all(promises);
  questionElement.textContent = provinces[currentProvince];
  map.getContainer().appendChild(questionElement);
}

load();
