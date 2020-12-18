import "normalize.css";
import "../css/style.scss";
import CONSTANTS from "./CONSTANTS";

import countryConfirmed from "./helper/country/countryConfirmed";
import countryDeaths from "./helper/country/countryDeaths";
import countryRecovered from "./helper/country/countryRecovered";

import actionBtnCountry from "./helper/actionBtnCountry";

import fetchCountryArr from "./helper/fetchCountryArr";
import inputListener from "./helper/inputListener";
import filterFunction from "./helper/filterFunction";
import preloadCountry from "./helper/preloadCountry";
import staticAllPeriod from './helper/table/staticAllPeriod';
import staticLastDay from './helper/table/staticLastDay';
import staticThounds from './helper/table/staticThounds';

import countriesGeoData from './data/countriesData';

const arrTotalDeaths = [];
const arrTotalRecovered = [];
const arrTotalConfirmed = [];
const arrAllTotal = [];
const arrLastDay = [];
const arrThousand = [];

const regionItem = document.querySelectorAll('.region__item');

const regionBtnTotal = document.querySelector(".region__btn__total");
const regionBtnDeaths = document.querySelector(".region__btn__deaths");
const regionBtnRecovered = document.querySelector(".region__btn__recovered");

const staticBtnAll = document.querySelector('.static__btn__all'); 
const staticBtnDeaths = document.querySelector('.static__btn__deaths');
const staticBtnThousand = document.querySelector('.static__btn__thousand');
const staticBtnAbsolute = document.querySelector('.static__btn__absolute'); 

document.addEventListener("DOMContentLoaded", function () {
  fetch("https://corona.lmao.ninja/v2/countries?yesterday&sort", { method: "GET" })
    .then((response) => response.json())
    .then((result) => fetchCountryArr(result, arrTotalDeaths, arrTotalRecovered, arrTotalConfirmed, arrAllTotal, arrLastDay, arrThousand))
    .then(preloadCountry(".region__list"))
    .then(inputListener())
    .then(countryListener())
    .catch((error) => console.log("error", error));
});

regionBtnTotal.addEventListener("click", function () {
  countryConfirmed(arrTotalConfirmed);
  actionBtnCountry(".region__btn__total", ".region__btn__item", "region__active");
  filterFunction();
});

regionBtnDeaths.addEventListener("click", function () {
  countryDeaths(arrTotalDeaths);
  actionBtnCountry(".region__btn__deaths", ".region__btn__item", "region__active");
  filterFunction();
});

regionBtnRecovered.addEventListener("click", function () {
  countryRecovered(arrTotalRecovered);
  actionBtnCountry(".region__btn__recovered", ".region__btn__item", "region__active");
  filterFunction();
});


staticBtnDeaths.addEventListener('click', function() {
  staticLastDay(arrLastDay);
  actionBtnCountry('.static__btn__deaths', '.static__btn__item', 'static__active__day');
});

staticBtnAll.addEventListener('click', function() {
  staticAllPeriod(arrAllTotal);
  actionBtnCountry('.static__btn__all', '.static__btn__item', 'static__active__day');
});

staticBtnThousand.addEventListener('click', function() {
  staticThounds(arrThousand);
  actionBtnCountry('.static__btn__thousand', '.static__btn__item', 'static__active__absolute');
});

staticBtnAbsolute.addEventListener('click', function() {
  staticAllPeriod(arrAllTotal);
  actionBtnCountry('.static__btn__absolute', '.static__btn__item', 'static__active__absolute');
});

function countryListener () {
  console.log(document.querySelectorAll('.region__item'))
  document.querySelectorAll('.region__item').forEach(el => {
    el.addEventListener('click', function () {
      console.log(el);
      console.log(el.dataset.code);
      console.log('ds');
    });
  });
}


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

// createTable('cases');

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

