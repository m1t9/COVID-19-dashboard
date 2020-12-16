/* eslint-disable import/extensions */
import createElementWrap from '../utils/wrappers.js';
import moveToPoint from '../index.js';

const urls = [
  'https://corona.lmao.ninja/v3/covid-19/all',
  'https://corona.lmao.ninja/v3/covid-19/countries',
];

function parseJSON(response) {
  return response.json();
}

function checkResponse(response) {
  if (response.status === 200) {
    return Promise.resolve(response);
  }
  return Promise.reject(new Error(response.statusText));
}

const countryTable = document.querySelector('.main__table_country_list');

function clearTable() {
  countryTable.innerHTML = '';
}

let compParam;

export function comparator(a, b) {
  const itemA = a[compParam];
  const itemB = b[compParam];

  let comparsion = 0;

  if (itemA < itemB) {
    comparsion = 1;
  } else if (itemA > itemB) {
    comparsion = -1;
  }

  return comparsion;
}

export default function createTable(param) {
  Promise.all(urls.map((url) => fetch(url)
    .then(checkResponse)
    .then(parseJSON)
    .catch((err) => err.message)))
    .then((data) => {
      // const globalData = data[0];
      const countryData = data[1].sort(comparator);

      compParam = param;
      clearTable();

      countryData.forEach((country) => {
        const item = createElementWrap(
          'li',
          'table-item',
          `<span id="table_case">${country[param]}</span> ${country.country} <img src="${country.countryInfo.flag}" width="20px" height="10px">`,
          country.country,
        );

        countryTable.append(item);

        item.addEventListener('click', () => {
          moveToPoint(country.countryInfo.lat, country.countryInfo.long, country.country);
        });
      });
    });
}

document.querySelector('.button1').addEventListener('click', () => {
  createTable('cases');
});

document.querySelector('.button2').addEventListener('click', () => {
  createTable('todayCases');
});

document.querySelector('.button3').addEventListener('click', () => {
  createTable('todayDeaths');
});
