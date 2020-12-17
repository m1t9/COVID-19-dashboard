/* eslint-disable import/extensions */
// import createElementWrap from './utils/wrappers.js';
// eslint-disable-next-line import/no-cycle
import createTable from './tables/createTable.js';
// import countriesData from './data/countries.js';
import countriesGeoData from './data/countriesData.js';

// console.log(countriesData);

const { L } = window;
const viewData = {};

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
  ],
};

const myMap = L.map('mapid', mapOptions);
// const info = L.control();

let geoJson;

function getColor(countryName, id) {
  const d = viewData[countryName] || viewData[id];
  if (d > 1000000) return '#ff0000';
  if (d > 500000) return '#ff8080';
  if (d > 100000) return '#ffb3b3';
  if (d > 50000) return '#ffcccc';
  return '#ffe6e6';
}

function style(feature) {
  return {
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.3,
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

  layer.bindTooltip(`<div class=""><h3>${layer.feature.properties.name}</h5> <p>Cases: ${viewData[layer.feature.properties.name] || viewData[layer.feature.id]}</p></div>`,
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
let popups = {};

function parseJSON(response) {
  return response.json();
}

function checkResponse(response) {
  if (response.status === 200) {
    return Promise.resolve(response);
  }

  return Promise.reject(new Error(response.statusText));
}

function markerClick(obj, info) {
  obj.bindPopup(info).openPopup();
}

createTable('cases');

function updateMap(localCase) {
  Promise.all(urls.map((url) => fetch(url)
    .then(checkResponse)
    .then(parseJSON)
    .catch((err) => err.message)))
    .then((data) => {
      const countryData = data[1];

      popups = {};

      countryData.forEach((country) => {
        const { lat, long } = country.countryInfo;
        const circle = L.circle([lat, long], {
          color: '#B95FC2',
          fillColor: '#B95FC2',
          fillOpacity: 0.7,
          radius: 100000,
          className: country.country,
        });
        // }).addTo(myMap);

        // const today = (new Date()).toUTCString();
        const key = localCase;
        viewData[country.country] = country[key];
        const covidInfo = `<b>${country.country}</b><br><b>${key}: ${country[key]}</b>`;

        popups[country.country] = circle.bindPopup(covidInfo);

        circle.on('mouseover', () => {
          markerClick(circle, covidInfo);
        });

        circle.on('mouseout', () => {
          circle.closePopup();
        });
      });
    })
    .then(() => {
      geoJson = L.geoJson(countriesGeoData.features, {
        style,
        onEachFeature,
        // style : dafaultGeoJSONStyle, onEachFeature : onEachFeature,
      }).addTo(myMap);
    });
}
updateMap('cases');
// updateMap();

export default function moveToPoint(lat, long, country) {
  myMap.flyTo([lat, long], 4);
  popups[country].openPopup();
}
