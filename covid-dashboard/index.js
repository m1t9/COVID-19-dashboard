// eslint-disable-next-line import/no-cycle
import { createTable } from './tables/createTable';
import countriesGeoData from './data/countriesData';
import updateGlobalTable from './tables/globalTable';
import { updateGraph } from './graph/addGraph';
import CONSTANTS from './data/CONSTANTS';
import getData from './utils/getData';
import { URLS } from './data/URLS';
import fullScreen from './utils/fullScreen';
import {
  getMapAttr,
  getLegendTitle,
  getLegendItemRange,
  getTip,
} from './templates/templates';
import { getColor, getGradesArr } from './utils/colors';
import {
  prevMapButton,
  nextMapButton,
  mapRangeButton,
  mapPerButton,
  nextListButton,
  prevListButton,
  listRangeButton,
  listPerButton,
} from './utils/buttons';
import './css/styles.scss';

const countryData = getData(URLS.COUNTRIES);
const { L } = window;
const viewData = {};
const countriesGeoLayer = L.layerGroup();
const countriesGeoLayerEmpty = L.layerGroup();

const mapOptions = {
  center: [35, 30],
  maxBounds: [[-90, -180], [90, 180]],
  zoom: 2,
  layers: [
    new L.TileLayer(URLS.LIGHT_THEME_LAY, {
      attribution: getMapAttr(URLS.LIGHT_THEME_ATTR),
      maxZoom: 7,
      minZoom: 3,
    }),
    countriesGeoLayer,
    countriesGeoLayerEmpty,
  ],
};

const myMap = L.map(CONSTANTS.MAPID, mapOptions);
const legend = L.control({ position: 'bottomright' });
const tableBox = document.querySelector(`.${CONSTANTS.TABLE_BOX}`);
const mapContainer = document.querySelector(`.${CONSTANTS.MAP_CONTAINER}`);
const globalTable = document.querySelector(`.${CONSTANTS.GLOBAL_TABLE}`);
const maxBtn = document.querySelectorAll(`.${CONSTANTS.MAXIMIZE_BTN}`);

let geoJson;
let maxValue = 0;
let currentTable;

function style(feature) {
  return {
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.4,
    fillColor: getColor(feature.id, maxValue, viewData),
  };
}

legend.onAdd = () => {
  const div = L.DomUtil.create(CONSTANTS.DIV, 'info legend');
  const grades = getGradesArr(maxValue);

  div.innerHTML += getLegendTitle(currentTable);

  for (let i = 0; i < grades.length; i += 1) {
    div.innerHTML
      += getLegendItemRange(grades[i], grades[i + 1], maxValue);
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

  layer.bindTooltip(getTip(layer.feature.properties.name, viewData[layer.feature.id]),
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
  const countryCheck = layer.feature.id === CONSTANTS.RUS || layer.feature.id === CONSTANTS.USA;

  if (countryCheck) {
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

async function updateMap(localCase, per) {
  currentTable = localCase;
  countriesGeoLayer.clearLayers();

  maxValue = 0;

  (await countryData).forEach((country) => {
    const key = localCase;

    if (per) {
      viewData[country.countryInfo.iso3] = country.population
        ? ((country[key] * CONSTANTS.PER_100k) / country.population).toFixed(0) : 0;
    } else {
      viewData[country.countryInfo.iso3] = country[key];
    }

    if (+viewData[country.countryInfo.iso3] > maxValue) {
      maxValue = +viewData[country.countryInfo.iso3];
    }
  });
  geoJson = L.geoJson(countriesGeoData.features.filter((item) => viewData[item.id] >= 0), {
    style,
    onEachFeature,
  }).addTo(countriesGeoLayer);
  legend.addTo(myMap);
}

// init
createTable(CONSTANTS.CASES);
updateMap(CONSTANTS.CASES);

maxBtn.forEach((el, i) => {
  el.addEventListener('click', () => {
    switch (i) {
      case 0:
        fullScreen(tableBox, mapContainer, globalTable);
        break;
      case 1:
        fullScreen(mapContainer, tableBox, globalTable);
        myMap.invalidateSize();
        break;
      case 2:
        fullScreen(globalTable, tableBox, mapContainer);
        break;
      default:
        break;
    }
  });
});

prevMapButton.addEventListener('click', () => {
  nextListButton.click();
});

nextMapButton.addEventListener('click', () => {
  prevListButton.click();
});

mapRangeButton.addEventListener('click', () => {
  listRangeButton.click();
});

mapPerButton.addEventListener('click', () => {
  listPerButton.click();
});

export {
  updateMap,
  moveToPoint,
};
