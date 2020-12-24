import createElementWrap from '../utils/wrappers';
// eslint-disable-next-line import/no-cycle
import { updateMap, moveToPoint } from '../index';
import updateTime from '../utils/lastUpdate';
import getData from '../utils/getData';
import updateGlobalTable from './globalTable';
import { updateGraph } from '../graph/addGraph';

const rangeButton = document.querySelector('#switch_btn_range');
const perButton = document.querySelector('#switch_btn_per');
const searchButton = document.querySelector('.search');
const urls = [
  'https://corona.lmao.ninja/v3/covid-19/all',
  'https://corona.lmao.ninja/v3/covid-19/countries',
];
const tableNames = ['cases', 'deaths', 'recovered'];
const countryTable = document.querySelector('.main__table_country_list');
const data = getData(urls[1]);
const globalData = getData(urls[0]);

let currentTableNum = 0;
let mainTable = [];
let today = false;
let per = false;

// init value
let currentParam = 'cases';

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

  document.querySelector('.table-name').innerHTML = '';
  document.querySelector('.table-name').append(param);

  countryData.forEach((country) => {
    if (!per || (per && country.population !== 0)) {
      const perValue = ((country[param] * 100000) / country.population).toFixed(0);
      const item = createElementWrap(
        'li',
        'table-item',
        `<img src="${country.countryInfo.flag}" width="20px" height="10px"> <span id="table_case">${per ? perValue : country[param]}</span> ${country.country}`,
        country.country,
      );

      if (per) {
        item.setAttribute('value', per ? perValue : country[param]);
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
  uppendTable(mainTable.filter((item) => item.getAttribute('data-table-item').toLowerCase().includes(input)));
}

document.querySelector('.button1').addEventListener('click', () => {
  searchButton.value = '';
  currentTableNum -= 1;

  if (currentTableNum === -1) {
    currentTableNum = tableNames.length - 1;
  }

  if (today) {
    currentParam = `today${tableNames[currentTableNum].charAt(0).toUpperCase()}${tableNames[currentTableNum].slice(1)}`;
  } else {
    currentParam = tableNames[currentTableNum];
  }

  createTable(currentParam);
  updateMap(currentParam, per);
});

document.querySelector('.button2').addEventListener('click', () => {
  searchButton.value = '';
  currentTableNum += 1;

  if (currentTableNum >= tableNames.length) {
    currentTableNum = 0;
  }

  if (today) {
    currentParam = `today${tableNames[currentTableNum].charAt(0).toUpperCase()}${tableNames[currentTableNum].slice(1)}`;
  } else {
    currentParam = tableNames[currentTableNum];
  }

  createTable(currentParam);
  updateMap(currentParam, per);
});

searchButton.addEventListener('keyup', () => {
  search(searchButton.value.toLowerCase());
});

rangeButton.addEventListener('click', () => {
  searchButton.value = '';
  today = !today;
  document.querySelector('#switch_btn_range_global').click();
  document.querySelector('#switch_btn_range_map').click();

  if (today) {
    currentParam = `today${currentParam.charAt(0).toUpperCase()}${currentParam.slice(1)}`;
    createTable(currentParam);
    updateMap(currentParam, per);
  } else {
    currentParam = currentParam.slice(5).toLowerCase();
    createTable(currentParam);
    updateMap(currentParam, per);
  }
});

perButton.addEventListener('click', () => {
  searchButton.value = '';
  per = !per;
  document.querySelector('#switch_btn_per_global').click();
  document.querySelector('#switch_btn_per_map').click();
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
