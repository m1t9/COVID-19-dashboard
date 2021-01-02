import getData from '../utils/getData';
import { resetToGlobal } from '../graph/addGraph';
import { URLS, getGLobalCountryUrl } from '../data/URLS';
import { globalTableText, getGlobalTableItem } from '../templates/templates';
import CONSTANTS from '../data/CONSTANTS';
import {
  listRangeButton,
  listAbsoluteButton,
  globalRange,
  absoluteGlobal,
  reset,
  searchButton,
} from '../utils/buttons';

const globalTable = document.querySelector(`.${CONSTANTS.GLOBAL_TABLE_DATA}`);
const globalData = getData(URLS.ALL);

let today = false;
let isAbsolute = false;
let currentIso = CONSTANTS.GLOBAL;
let currentCountryName = CONSTANTS.GLOBAL;

async function addParams(data, name) {
  globalTableText((await data), name, isAbsolute, today);
}

addParams(globalData, CONSTANTS.GLOBAL);

export default async function updateGlobalTable(iso, countryName) {
  currentIso = iso;
  currentCountryName = countryName;
  const countryData = getData(getGLobalCountryUrl(iso));
  if (await countryData) {
    globalTable.innerHTML = '';
    addParams((await countryData), getGlobalTableItem(countryName));
  } else {
    globalTable.innerHTML = getGlobalTableItem(CONSTANTS.NO_DATA);
  }
}

function updateWrap() {
  if (currentIso === CONSTANTS.GLOBAL) {
    globalTable.innerHTML = '';
    addParams(globalData, getGlobalTableItem(CONSTANTS.GLOBAL));
  } else {
    updateGlobalTable(currentIso, currentCountryName);
  }
}

globalRange.addEventListener('click', () => {
  today = !today;
  listRangeButton.click();
  updateWrap();
});

absoluteGlobal.addEventListener('click', () => {
  isAbsolute = !isAbsolute;
  listAbsoluteButton.click();
  updateWrap();
});

reset.addEventListener('click', () => {
  searchButton.value = '';
  currentIso = CONSTANTS.GLOBAL;
  currentCountryName = CONSTANTS.GLOBAL;
  globalTable.innerHTML = '';
  addParams(globalData, getGlobalTableItem(CONSTANTS.GLOBAL));
  resetToGlobal();
});
