import createElementWrap from '../utils/wrappers';
// eslint-disable-next-line import/no-cycle
import { updateMap, moveToPoint } from '../index';
import updateTime from '../utils/lastUpdate';
import getData from '../utils/getData';
import updateGlobalTable from './globalTable';
import { updateGraph } from '../graph/addGraph';
import CONSTANTS from '../data/CONSTANTS';
import { URLS } from '../data/URLS';
import { getListItem, todayListTitle } from '../templates/templates';
import {
  listRangeButton,
  listPerButton,
  searchButton,
  prevListButton,
  nextListButton,
  globalRange,
  mapRange,
  perGlobal,
  perMap,
} from '../utils/buttons';

const urls = [URLS.ALL, URLS.COUNTRIES];
const tableNames = ['cases', 'deaths', 'recovered'];
const tableName = document.querySelector(`.${CONSTANTS.LIST_NAME}`);
const countryTable = document.querySelector(`.${CONSTANTS.TABLE_LIST}`);
const data = getData(urls[1]);
const globalData = getData(urls[0]);

let currentTableNum = 0;
let currentTableName;
let mainTable = [];
let today = false;
let per = false;

// init value
let currentParam = CONSTANTS.CASES;

function clearTable() {
  countryTable.innerHTML = '';
  mainTable = [];
}

export function comparator(a, b) {
  const itemA = a[currentParam];
  const itemB = b[currentParam];

  let comparsion = 0;

  if (itemA < itemB) {
    comparsion = 1;
  } else if (itemA > itemB) {
    comparsion = -1;
  }

  return comparsion;
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
    if (!per || (per && country.population !== 0)) {
      const perValue = ((country[param] * CONSTANTS.PER_100k) / country.population).toFixed(0);
      const item = createElementWrap(
        'li',
        CONSTANTS.LIST_ITEM,
        getListItem(country.countryInfo.flag,
          per
            ? perValue
            : country[param],
          country.country),
        country.country,
      );

      if (per) {
        item.setAttribute(CONSTANTS.VALUE, per ? perValue : country[param]);
      }

      mainTable.push(item);

      item.addEventListener('click', () => {
        moveToPoint(country.countryInfo.lat, country.countryInfo.long);
        updateGlobalTable(country.countryInfo.iso3, country.country);
        updateGraph(country.country);
      });
    }
  });

  if (per) {
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
  updateMap(currentParam, per);
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
    updateMap(currentParam, per);
  } else {
    currentParam = currentParam.slice(5).toLowerCase();
    createTable(currentParam);
    updateMap(currentParam, per);
  }
});

listPerButton.addEventListener('click', () => {
  searchButton.value = '';
  per = !per;
  perGlobal.click();
  perMap.click();
  createTable(currentParam);
  updateMap(currentParam, per);
});

(async () => {
  const time = (await globalData).updated;
  updateTime(time);
})();

export {
  createTable,
  search,
};
