/* eslint-disable import/extensions */
// import createElementWrap from './utils/wrappers.js';
// eslint-disable-next-line import/no-cycle

import "../css/styles.scss";
import L from 'leaflet';
// eslint-disable-next-line import/no-cycle
import { createTable } from './tables/createTable.js';
// import countriesData from './data/countries.js';
import countriesGeoData from './data/countriesData.js';
// import countriesGeoData2 from './data/countries.js';
import updateGlobalTable from './tables/globalTable.js';
import { updateGraph } from './graph/addGraph.js';
import createElementWrap from './utils/wrappers.js';

// console.log(countriesData);

// const { L } = window;
const viewData = {};
const countriesGeoLayer = L.layerGroup();
const countriesGeoLayerEmpty = L.layerGroup();

const mapOptions = {
  center: [35, 30],
  maxBounds: [[-90, -180], [90, 180]],
  zoom: 2,
  layers: [
    new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      // new L.TileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
      //   attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
      maxZoom: 7,
      minZoom: 3,
    }),
    countriesGeoLayer,
    countriesGeoLayerEmpty,
  ],
};

const myMap = L.map('mapid', mapOptions);
// const info = L.control();

// const overlayMaps = {
//   layer1: countriesGeoLayer,
// };

// L.control.layers(overlayMaps).addTo(myMap);

let geoJson;
let maxValue = 0;
let currentTable;

function getColor(countryName, id) {
  // const d = viewData[countryName] || viewData[id];
  const d = viewData[id];
  // if (d > maxValue * 0.9) return '#330000';
  // if (d > maxValue * 0.5) return '#800000';
  // if (d > maxValue * 0.1) return '#ff0000';
  // if (d > maxValue * 0.05) return '#ff1a1a';
  // if (d > maxValue * 0.005) return '#ff3333';
  // if (d > maxValue * 0.001) return '#ff4d4d';
  // if (d > maxValue * 0.005) return '#ff6666';
  // if (d > maxValue * 0.0005) return '#ff8080';
  // if (d > maxValue * 0.0001) return '#ff9999';
  // if (d > maxValue * 0.00005) return '#ffcccc';
  // if (d > maxValue * 0.000001) return '#ffe6e6';
  if (d > maxValue * 0.9) return '#330000';
  if (d > maxValue * 0.7) return '#800000';
  if (d > maxValue * 0.5) return '#ff0000';
  if (d > maxValue * 0.3) return '#ff1a1a';
  if (d > maxValue * 0.1) return '#ff3333';
  if (d > maxValue * 0.05) return '#ff4d4d';
  if (d > maxValue * 0.01) return '#ff6666';
  if (d > maxValue * 0.005) return '#ff8080';
  if (d > maxValue * 0.001) return '#ff9999';
  if (d > maxValue * 0.0005) return '#ffcccc';
  if (d > maxValue * 0.0001) return '#ffe6e6';
  // if (d > 0) return '#ff0000';

  return '#ffffff';
}

function getColorLegend(d) {
  if (d > maxValue * 0.75) return '#330000';
  if (d > maxValue * 0.5) return '#800000';
  if (d > maxValue * 0.4) return '#ff0000';
  if (d > maxValue * 0.3) return '#ff1a1a';
  if (d > maxValue * 0.1) return '#ff3333';
  if (d > maxValue * 0.05) return '#ff4d4d';
  if (d > maxValue * 0.01) return '#ff6666';
  if (d > maxValue * 0.005) return '#ff8080';
  if (d > maxValue * 0.001) return '#ff9999';
  if (d > maxValue * 0.0005) return '#ffcccc';
  if (d > maxValue * 0.0001) return '#ffe6e6';
  // if (d > 0) return '#ff0000';
  return '#ffffff';
}

function style(feature) {
  return {
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.4,
    // fillColor: getColor(feature.properties.ADMIN, feature.properties.ISO_A3),
    fillColor: getColor(feature.properties.name, feature.id),
  };
}

const legend = L.control({ position: 'bottomright' });

legend.onAdd = () => {
  const div = L.DomUtil.create('div', 'info legend');
  // grades = [0, 10, 20, 50, 100, 200, 500, 1000],
  const grades = [0,
    (0.0001 * maxValue).toFixed(0),
    (0.0005 * maxValue).toFixed(0),
    (0.001 * +maxValue).toFixed(0),
    (0.005 * +maxValue).toFixed(0),
    (0.01 * +maxValue).toFixed(0),
    (0.05 * +maxValue).toFixed(0),
    (0.1 * +maxValue).toFixed(0),
    (0.2 * +maxValue).toFixed(0),
    (0.3 * +maxValue).toFixed(0),
    (0.5 * +maxValue).toFixed(0),
  ];
  // const labels = [];

  // loop through our density intervals and generate a label with a colored square for each interval
  div.innerHTML += `<div>${currentTable}</div>`;
  for (let i = 0; i < grades.length; i += 1) {
    div.innerHTML
      += `<i style="background:${getColorLegend(grades[i] + 1)}"></i> ${
        grades[i]}${grades[i + 1] ? `&ndash;${grades[i + 1]}<br>` : '+'}`;
  }

  return div;
};

function highlightFeature(e) {
  const layer = e.target;

  layer.setStyle({
    weight: 5,
    color: '#666',
    dashArray: '',
    fillOpacity: 0.5,
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }

  // info.update(layer.feature.properties, layer.feature.id);

  // layer.bindTooltip(`<div class=""><h3>${layer.feature.properties.ADMIN}</h5>
  //  <p>Data: ${viewData[layer.feature.properties.ADMIN] ||
  //  viewData[layer.feature.properties.ISO_A3] || 'no data'}</p></div>`,

  // layer.bindTooltip(`<div class=""><h3>${layer.feature.properties.name}</h5> <p>Data:
  // ${viewData[layer.feature.properties.name] || viewData[layer.feature.id]
  //  || 'no data'}</p></div>`,
  layer.bindTooltip(`<div class=""><h3>${layer.feature.properties.name}</h5> <p>Data: ${viewData[layer.feature.id]}</p></div>`,
    {
      direction: 'top',
      sticky: true,
      className: 'leaflet-tooltip-own',
    }).openTooltip();
}

function resetHighlight(e) {
  geoJson.resetStyle(e.target);
  // info.update();
}

function moveToPoint(lat, long, zoom) {
  if (zoom) {
    myMap.flyTo([lat, long], zoom);
  } else {
    myMap.flyTo([lat, long], 5);
  }
}

function zoomToFeature(e) {
  myMap.fitBounds(e.target.getBounds());
  // updateGlobalTable(e.target.feature.properties.ADMIN);
  updateGlobalTable(e.target.feature.id, e.target.feature.properties.name);
  updateGraph(e.target.feature.properties.name);
  // moveToPoint(e.latlng.lat, e.latlng.lng);
}

function zoomToFeatureFixed(e) {
  moveToPoint(e.latlng.lat, e.latlng.lng, 3);
  // updateGlobalTable(e.target.feature.properties.ADMIN);
  updateGlobalTable(e.target.feature.id, e.target.feature.properties.name);
  updateGraph(e.target.feature.properties.name);
}

function onEachFeature(feature, layer) {
  // if (layer.feature.properties.ISO_A3 === 'RUS'
  // || layer.feature.properties.ISO_A3 === 'USA') {
  if (layer.feature.id === 'RUS'
    || layer.feature.id === 'USA') {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeatureFixed,
    });
  } else {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature,
    });
  }
}

const urls = [
  'https://corona.lmao.ninja/v3/covid-19/all',
  'https://corona.lmao.ninja/v3/covid-19/countries',
];
// let popups = {};

function parseJSON(response) {
  return response.json();
}

function checkResponse(response) {
  if (response.status === 200) {
    return Promise.resolve(response);
  }

  return Promise.reject(new Error(response.statusText));
}

createTable('cases');

function updateMap(localCase, per) {
  currentTable = localCase;
  Promise.all(urls.map((url) => fetch(url, { mode: 'cors' })
    .then(checkResponse)
    .then(parseJSON)
    .catch((err) => err.message)))
    .then((data) => {
      countriesGeoLayer.clearLayers();
      // const globalData = data[0];
      const countryData = data[1];

      maxValue = 0;

      countryData.forEach((country) => {
        const key = localCase;
        viewData[country.countryInfo.iso3] = per
          ? ((country[key] * 100000) / country.population).toFixed(0)
          : country[key];

        if (country[key] > maxValue) {
          maxValue = per ? ((country[key] * 100000) / country.population).toFixed(0)
            : country[key];
        }
      });
    })
    .then(() => {
      geoJson = L.geoJson(countriesGeoData.features.filter((item) => viewData[item.id] >= 0), {
        // console.log(countriesGeoData.features);
        // geoJson = L.geoJson(countriesGeoData.features, {
        style,
        onEachFeature,
      }).addTo(countriesGeoLayer);
      legend.addTo(myMap);
    });
}
updateMap('cases');

const tableBox = document.querySelector('.table_box');
// const mapidBox = document.querySelector('#mapid');

const mapContainer = document.querySelector('.map_container');

const globalTable = document.querySelector('.global-table');

// const maximize = document.querySelectorAll('.maximize');

// const overlay = document.querySelector('.fullscreen');

const maxBtn = document.querySelectorAll('.max');

maxBtn.forEach((el, i) => {
  el.addEventListener('click', () => {
    switch (i) {
      case 0:
        tableBox.classList.toggle('fullscreen');
        mapContainer.classList.toggle('none');
        mapContainer.classList.toggle('none');
        break;
      case 1:
        mapContainer.classList.toggle('fullscreen');
        tableBox.classList.toggle('none');
        globalTable.classList.toggle('none');
        // updateMap();
        myMap.invalidateSize();
        break;
      case 2:
        globalTable.classList.toggle('fullscreen');
        tableBox.classList.toggle('none');
        mapContainer.classList.toggle('none');
        break;
      default:
        break;
    }
  });
});

export {
  updateMap,
  moveToPoint,
};
