import createElementWrap from '../utils/wrappers';
// eslint-disable-next-line import/no-cycle
// import { updateMap, moveToPoint } from '../index';
import { updateMap, moveToPoint } from '../map';
import updateTime from '../utils/lastUpdate';
import getData from '../utils/getData';
import updateGlobalTable from './globalTable';
import { updateGraph } from '../graph/addGraph';
import CONSTANTS from '../data/CONSTANTS';
import { URLS } from '../data/URLS';
import { getListItem, todayListTitle } from '../templates/templates';
import {
  listRangeButton,
  listAbsoluteButton,
  searchButton,
  prevListButton,
  nextListButton,
  globalRange,
  mapRange,
  absoluteGlobal,
  absoluteMap,
} from '../utils/buttons';

const tableNames = ['cases', 'deaths', 'recovered'];
const tableName = document.querySelector(`.${CONSTANTS.LIST_NAME}`);
const countryTable = document.querySelector(`.${CONSTANTS.TABLE_LIST}`);
const data = getData(URLS.COUNTRIES);
const globalData = getData(URLS.ALL);

let currentTableNum = 0;
let currentTableName;
let mainTable = [];
let today = false;
let isAbsolute = false;

// init value
let currentParam = CONSTANTS.CASES;

function clearTable() {
  countryTable.innerHTML = '';
  mainTable = [];
}

export function comparator(a, b) {
  const itemA = a[currentParam];
  const itemB = b[currentParam];

  if (itemA < itemB) {
    return 1;
  } if (itemA > itemB) {
    return -1;
  }

  return 0;
}

function uppendTable(table) {
  countryTable.innerHTML = '';
  table.forEach((item) => {
    countryTable.append(item);
  });
}

async function createTable(param) {
  currentParam = param;
  const countryData = (await data).sort(comparator);

  clearTable();

  tableName.innerHTML = '';
  tableName.append(param);

  countryData.forEach((country) => {
    if (!isAbsolute || (isAbsolute && country.population !== 0)) {
      const absoluteValue = ((country[param] * CONSTANTS.PER_100k) / country.population).toFixed(0);
      const item = createElementWrap(
        'li',
        CONSTANTS.LIST_ITEM,
        getListItem(country.countryInfo.flag,
          isAbsolute
            ? absoluteValue
            : country[param],
          country.country),
        country.country,
      );

      if (isAbsolute) {
        item.setAttribute(CONSTANTS.VALUE, isAbsolute ? absoluteValue : country[param]);
      }

      mainTable.push(item);

      item.addEventListener('click', () => {
        moveToPoint(country.countryInfo.lat, country.countryInfo.long);
        updateGlobalTable(country.countryInfo.iso3, country.country);
        updateGraph(country.country);
      });
    }
  });

  if (isAbsolute) {
    mainTable.sort((a, b) => {
      const f = +a.value;
      const s = +b.value;

      return s - f;
    });
  }

  uppendTable(mainTable);
}

function search(input) {
  uppendTable(mainTable.filter((item) => item.getAttribute(CONSTANTS.LIST_DATA_ITEM)
    .toLowerCase().includes(input)));
}

function changeTitle() {
  currentTableName = tableNames[currentTableNum];

  if (today) {
    todayListTitle(currentTableName);
  } else {
    currentParam = currentTableName;
  }

  createTable(currentParam);
  updateMap(currentParam, isAbsolute);
}

prevListButton.addEventListener('click', () => {
  searchButton.value = '';
  currentTableNum -= 1;

  if (currentTableNum === -1) {
    currentTableNum = tableNames.length - 1;
  }

  changeTitle();
});

nextListButton.addEventListener('click', () => {
  searchButton.value = '';
  currentTableNum += 1;

  if (currentTableNum >= tableNames.length) {
    currentTableNum = 0;
  }

  changeTitle();
});

searchButton.addEventListener('keyup', () => {
  search(searchButton.value.toLowerCase());
});

listRangeButton.addEventListener('click', () => {
  searchButton.value = '';
  today = !today;
  globalRange.click();
  mapRange.click();

  if (today) {
    currentParam = todayListTitle(currentParam);
    createTable(currentParam);
    updateMap(currentParam, isAbsolute);
  } else {
    currentParam = currentParam.slice(5).toLowerCase();
    createTable(currentParam);
    updateMap(currentParam, isAbsolute);
  }
});

listAbsoluteButton.addEventListener('click', () => {
  searchButton.value = '';
  isAbsolute = !isAbsolute;
  absoluteGlobal.click();
  absoluteMap.click();
  createTable(currentParam);
  updateMap(currentParam, isAbsolute);
});

(async () => {
  const time = (await globalData).updated;
  updateTime(time);
})();

export { createTable };
