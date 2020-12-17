/* eslint-disable import/extensions */
// import createElementWrap from './utils/wrappers.js';
// eslint-disable-next-line import/no-cycle
import createTable from './tables/createTable.js';
// import countriesData from './data/countries.js';
import countriesGeoData from './data/countriesData.js';

// console.log(countriesData);

const { L } = window;
const viewData = {};
const countriesGeoLayer = L.layerGroup();
const countriesGeoLayerEmpty = L.layerGroup();

const mapOptions = {
  center: [35, 30],
  maxBounds: [[-90, -180], [90, 180]],
  zoom: 2,
  layers: [
    // new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    new L.TileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
      maxZoom: 7,
      minZoom: 3,
    }),
    countriesGeoLayer,
    countriesGeoLayerEmpty,
  ],
};

const myMap = L.map('mapid', mapOptions);
// const info = L.control();

const overlayMaps = {
  layer1: countriesGeoLayer,
};

L.control.layers(overlayMaps).addTo(myMap);

let geoJson;
let maxValue = 0;

function getColor(countryName, id) {
  const d = viewData[countryName] || viewData[id];
  if (d > maxValue * 0.9) return '#330000';
  if (d > maxValue * 0.5) return '#800000';
  if (d > maxValue * 0.1) return '#ff0000';
  if (d > maxValue * 0.05) return '#ff1a1a';
  if (d > maxValue * 0.005) return '#ff3333';
  if (d > maxValue * 0.001) return '#ff4d4d';
  if (d > maxValue * 0.005) return '#ff6666';
  if (d > maxValue * 0.0005) return '#ff8080';
  if (d > maxValue * 0.0001) return '#ff9999';
  if (d > maxValue * 0.00005) return '#ffcccc';
  if (d > maxValue * 0.000001) return '#ffe6e6';
  // if (d > 0) return '#ff0000';

  return '#ffffff';
}

function style(feature) {
  return {
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7,
    fillColor: getColor(feature.properties.name, feature.id),
  };
}

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

  layer.bindTooltip(`<div class=""><h3>${layer.feature.properties.name}</h5> <p>Cases: ${viewData[layer.feature.properties.name] || viewData[layer.feature.id] || 'no data'}</p></div>`,
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

function zoomToFeature(e) {
  myMap.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: zoomToFeature,
  });
}

// info.onAdd = function (map) {
//   this._div = L.DomUtil.create('div', 'info');
//   // this.update();
//   return this._div;
// };

// method that we will use to update the control based on feature properties passed
// info.update = function (props, id) {
// console.log(props);
// const data = props ? (viewData[props.name] || viewData[id]) : 'none';
// console.log(data);
// this._div.innerHTML = props ? `${data}` : 'out data';
// this._div.innerHTML = `<h4>US Population Density</h4>${props
//   ? `<b>${props.name}</b><br />${props.density} people / mi<sup>2</sup>`
//   : 'Hover over a state'}`;
// };

// info.addTo(myMap);

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

function updateMap(localCase) {
  Promise.all(urls.map((url) => fetch(url, { mode: 'cors' })
    .then(checkResponse)
    .then(parseJSON)
    .catch((err) => err.message)))
    .then((data) => {
      countriesGeoLayer.clearLayers();
      const countryData = data[1];

      maxValue = 0;

      countryData.forEach((country) => {
        const key = localCase;
        viewData[country.countryInfo.iso3] = country[key];

        if (country[key] > maxValue) {
          maxValue = country[key];
        }
      });
    })
    .then(() => {
      geoJson = L.geoJson(countriesGeoData.features, {
        style,
        onEachFeature,
      }).addTo(countriesGeoLayer);
    });
}
updateMap('cases');

function moveToPoint(lat, long) {
  myMap.flyTo([lat, long], 5);
}

export {
  updateMap,
  moveToPoint,
};
