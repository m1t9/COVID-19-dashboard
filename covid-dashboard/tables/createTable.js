/* eslint-disable import/extensions */
import createElementWrap from '../utils/wrappers.js';
// eslint-disable-next-line import/no-cycle
import { updateMap, moveToPoint } from '../index.js';
import createSSelector from '../utils/selector.js';
import updateTime from '../utils/lastUpdate.js';
import getData from '../utils/getData.js';
import updateGlobalTable from './globalTable.js';

const rangeButton = document.querySelector('#switch_btn_range');
const perButton = document.querySelector('#switch_btn_per');
const searchButton = document.querySelector('.search');
const urls = [
  'https://corona.lmao.ninja/v3/covid-19/all',
  'https://corona.lmao.ninja/v3/covid-19/countries',
];
// let tableNames;
const tableNames = ['cases', 'deaths', 'recovered'];
let currentTableNum = 0;
let mainTable = [];
let today = false;
let per = false;

const selector = createSSelector();

// function parseJSON(response) {
//   return response.json();
// }

// function checkResponse(response) {
//   if (response.status === 200) {
//     return Promise.resolve(response);
//   }
//   return Promise.reject(new Error(response.statusText));
// }

const countryTable = document.querySelector('.main__table_country_list');

function clearTable() {
  countryTable.innerHTML = '';
  mainTable = [];
}

// init value
let currentParam = 'cases';

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

// async function getData(num) {
//   const rez = await fetch(urls[num])
//     .then(checkResponse)
//     .then(parseJSON)
//     .catch((err) => err.message);

//   return rez;
// }

// const data = getData(1);
// const globalData = getData(0);
const data = getData(urls[1]);
const globalData = getData(urls[0]);

// (async () => {
//   data = await getData();
//   console.log(data);
// })();
// getData().then((result) => { data = result; });

async function createTable(param) {
  // Promise.all(urls.map((url) => fetch(url)
  //   .then(checkResponse)
  //   .then(parseJSON)
  //   .catch((err) => err.message)))
  //   .then((data) => {
  //   });
  // const globalData = data[0];
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
        `<span id="table_case">${per ? perValue : country[param]}</span> ${country.country} <img src="${country.countryInfo.flag}" width="20px" height="10px">`,
        country.country,
      );

      if (per) {
        item.setAttribute('value', per ? perValue : country[param]);
      }

      mainTable.push(item);

      item.addEventListener('click', () => {
        moveToPoint(country.countryInfo.lat, country.countryInfo.long);
        updateGlobalTable(country.countryInfo.iso3, country.country);
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

  selector.selectedIndex = currentTableNum;
  createTable(currentParam);
  updateMap(currentParam);
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

  selector.selectedIndex = currentTableNum;
  createTable(currentParam);
  updateMap(currentParam);
});

searchButton.addEventListener('keyup', () => {
  search(searchButton.value.toLowerCase());
});

rangeButton.addEventListener('click', () => {
  searchButton.value = '';
  today = !today;
  if (today) {
    currentParam = `today${currentParam.charAt(0).toUpperCase()}${currentParam.slice(1)}`;
    createTable(currentParam);
    updateMap(currentParam);
  } else {
    currentParam = currentParam.slice(5).toLowerCase();
    createTable(currentParam);
    updateMap(currentParam);
  }
});

perButton.addEventListener('click', () => {
  searchButton.value = '';
  per = !per;
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
