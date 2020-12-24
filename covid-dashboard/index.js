// import createElementWrap from './utils/wrappers.js';
// eslint-disable-next-line import/no-cycle
import { createTable } from './tables/createTable';
import countriesGeoData from './data/countriesData';
import updateGlobalTable from './tables/globalTable';
import { updateGraph } from './graph/addGraph';
import './css/styles.scss';

const { L } = window;
const viewData = {};
const countriesGeoLayer = L.layerGroup();
const countriesGeoLayerEmpty = L.layerGroup();
const urls = [
  'https://corona.lmao.ninja/v3/covid-19/all',
  'https://corona.lmao.ninja/v3/covid-19/countries',
];

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
const legend = L.control({ position: 'bottomright' });
const tableBox = document.querySelector('.table_box');
const mapContainer = document.querySelector('.map_container');
const globalTable = document.querySelector('.global-table');
const maxBtn = document.querySelectorAll('.max');

let geoJson;
let maxValue = 0;
let currentTable;

function getColor(countryName, id) {
  const d = viewData[id];
  if (d > maxValue * 0.9) return '#330000';
  if (d > maxValue * 0.8) return '#b30000';
  if (d > maxValue * 0.7) return '#ff0000';
  if (d > maxValue * 0.6) return '#ff1a1a';
  if (d > maxValue * 0.5) return '#ff3333';
  if (d > maxValue * 0.4) return '#ff4d4d';
  if (d > maxValue * 0.3) return '#ff6666';
  if (d > maxValue * 0.1) return '#ff8080';
  if (d > maxValue * 0.05) return '#ff9999';
  if (d > maxValue * 0.01) return '#ffcccc';
  if (d > maxValue * 0.005) return '#ffe6e6';

  return '#ffffff';
}

function getColorLegend(d) {
  if (d > maxValue * 0.9) return '#800000';
  if (d > maxValue * 0.5) return '#ff3333';
  if (d > maxValue * 0.3) return '#ff6666';
  if (d > maxValue * 0.1) return '#ff9999';
  if (d > maxValue * 0.01) return '#ffe6e6';

  return '#ffffff';
}

function style(feature) {
  return {
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.4,
    fillColor: getColor(feature.properties.name, feature.id),
  };
}

legend.onAdd = () => {
  const div = L.DomUtil.create('div', 'info legend');
  const grades = [0,
    (0.01 * maxValue).toFixed(0),
    (0.05 * +maxValue).toFixed(0),
    (0.1 * +maxValue).toFixed(0),
    (0.3 * +maxValue).toFixed(0),
    (0.5 * +maxValue).toFixed(0),
    (0.9 * +maxValue).toFixed(0),
  ];

  div.innerHTML += `<div style="text-align: center"><b>${currentTable.toUpperCase()}</div>`;
  for (let i = 0; i < grades.length; i += 1) {
    div.innerHTML
      += `<i style="background:${getColorLegend(grades[i] + 1)}"></i> ${grades[i]}${grades[i + 1] ? `&ndash;${grades[i + 1]}<br>` : '+'}`;
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

  layer.bindTooltip(`<div class=""><h3>${layer.feature.properties.name}</h5> <p>Data: ${viewData[layer.feature.id]}</p></div>`,
    {
      direction: 'top',
      sticky: true,
      className: 'leaflet-tooltip-own',
    }).openTooltip();
}

function resetHighlight(e) {
  geoJson.resetStyle(e.target);
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
  updateGlobalTable(e.target.feature.id, e.target.feature.properties.name);
  updateGraph(e.target.feature.properties.name);
}

function zoomToFeatureFixed(e) {
  moveToPoint(e.latlng.lat, e.latlng.lng, 5);
  updateGlobalTable(e.target.feature.id, e.target.feature.properties.name);
  updateGraph(e.target.feature.properties.name);
}

function onEachFeature(feature, layer) {
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
      const countryData = data[1];

      maxValue = 0;

      countryData.forEach((country) => {
        const key = localCase;

        if (per) {
          viewData[country.countryInfo.iso3] = country.population
            ? ((country[key] * 100000) / country.population).toFixed(0) : 0;
        } else {
          viewData[country.countryInfo.iso3] = country[key];
        }

        if (+viewData[country.countryInfo.iso3] > maxValue) {
          maxValue = +viewData[country.countryInfo.iso3];
        }
      });
    })
    .then(() => {
      geoJson = L.geoJson(countriesGeoData.features.filter((item) => viewData[item.id] >= 0), {
        style,
        onEachFeature,
      }).addTo(countriesGeoLayer);
      legend.addTo(myMap);
    });
}
updateMap('cases');

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
        // resize();
        globalTable.classList.toggle('fullscreen');
        tableBox.classList.toggle('none');
        mapContainer.classList.toggle('none');
        break;
      default:
        break;
    }
  });
});

document.querySelector('#prev_map').addEventListener('click', () => {
  document.querySelector('.button1').click();
});

document.querySelector('#next_map').addEventListener('click', () => {
  document.querySelector('.button2').click();
});

document.querySelector('#switch_btn_range_map').addEventListener('click', () => {
  document.querySelector('#switch_btn_range').click();
});

document.querySelector('#switch_btn_per_map').addEventListener('click', () => {
  document.querySelector('#switch_btn_per').click();
});

export {
  updateMap,
  moveToPoint,
};
