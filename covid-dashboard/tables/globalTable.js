import getData from '../utils/getData';
import { resetToGlobal } from '../graph/addGraph';
import { URLS, getGLobalCountryUrl } from '../data/URLS';
import { globalTableText } from '../templates/templates';
import CONSTANTS from '../data/CONSTANTS';
import {
  listRangeButton,
  listPerButton,
  globalRange,
  perGlobal,
  reset,
  searchButton,
} from '../utils/buttons';

const globalTable = document.querySelector(`.${CONSTANTS.GLOBAL_TABLE_DATA}`);
const globalData = getData(URLS.ALL);

let today = false;
let per = false;
let currentIso = CONSTANTS.GLOBAL;
let currentCountryName = CONSTANTS.GLOBAL;

async function addParams(data, name) {
  globalTableText((await data), name, per, today);
}

addParams(globalData, CONSTANTS.GLOBAL);

export default async function updateGlobalTable(iso, countryName) {
  currentIso = iso;
  currentCountryName = countryName;
  const countryData = getData(getGLobalCountryUrl(iso));
  if (await countryData) {
    globalTable.innerHTML = '';
    addParams((await countryData), `<${CONSTANTS.DIV}><b>${countryName}</${CONSTANTS.DIV}>`);
  } else {
    globalTable.innerHTML = `<${CONSTANTS.DIV}>${CONSTANTS.NO_DATA}</${CONSTANTS.DIV}>`;
  }
}

function updateWrap() {
  if (currentIso === CONSTANTS.GLOBAL) {
    globalTable.innerHTML = '';
    addParams(globalData, `<${CONSTANTS.DIV}>${CONSTANTS.GLOBAL}</${CONSTANTS.DIV}>`);
  } else {
    updateGlobalTable(currentIso, currentCountryName);
  }
}

globalRange.addEventListener('click', () => {
  today = !today;
  listRangeButton.click();
  updateWrap();
});

perGlobal.addEventListener('click', () => {
  per = !per;
  listPerButton.click();
  updateWrap();
});

reset.addEventListener('click', () => {
  searchButton.value = '';
  currentIso = CONSTANTS.GLOBAL;
  currentCountryName = CONSTANTS.GLOBAL;
  globalTable.innerHTML = '';
  addParams(globalData, `<${CONSTANTS.DIV}>${CONSTANTS.GLOBAL}</${CONSTANTS.DIV}>`);
  resetToGlobal();
});
