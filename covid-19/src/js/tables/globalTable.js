/* eslint-disable import/extensions */
// import createElementWrap from '../utils/wrappers.js';
import getData from '../utils/getData.js';
import { resetToGlobal } from '../graph/addGraph.js';

const urls = [
  'https://corona.lmao.ninja/v3/covid-19/all',
  'https://corona.lmao.ninja/v3/covid-19/countries',
];
const rangeButton = document.querySelector('#switch_btn_range_global');
const perButton = document.querySelector('#switch_btn_per_global');
const reset = document.querySelector('.reset');
const globalTable = document.querySelector('.global-table-data');
const globalData = getData(urls[0]);

let today = false;
let per = false;
let currentIso = 'GLOBAL';
let currentCountryName = 'GLOBAL';

async function addParams(data, name) {
  // console.log('wow');
  // const globalCases = (await data);
  // console.log(await data);
  // globalTable.append(createElementWrap(
  //   'div',
  //   'global-item',
  //   `Total cases: ${(await data).cases}`,
  // ));

  // globalTable.append(createElementWrap(
  //   'div',
  //   'global-item',
  //   `Total deaths: ${(await data).deaths}`,
  // ));

  // globalTable.append(createElementWrap(
  //   'div',
  //   'global-item',
  //   `Total deaths: ${(await data).recovered}`,
  // ));
  if (per) {
    const cases = (((await data)[today ? 'todayCases' : 'cases'] * 100000) / (await data).population).toFixed(0);
    const deaths = (((await data)[today ? 'todayDeaths' : 'deaths'] * 100000) / (await data).population).toFixed(0);
    const recovered = (((await data)[today ? 'todayRecovered' : 'recovered'] * 100000) / (await data).population).toFixed(0);
    globalTable.innerHTML += `<br>${name}`;
    globalTable.innerHTML += `<br>${today ? 'Today' : 'Total'} cases: ${cases}<br>`;
    globalTable.innerHTML += `${today ? 'Today' : 'Total'} deaths: ${deaths}<br>`;
    globalTable.innerHTML += `${today ? 'Today' : 'Total'} recovered: ${recovered}<br`;
  } else {
    globalTable.innerHTML += `<br>${name}`;
    globalTable.innerHTML += `<br>${today ? 'Today' : 'Total'} cases: ${(await data)[today ? 'todayCases' : 'cases']}<br>`;
    globalTable.innerHTML += `${today ? 'Today' : 'Total'} deaths: ${(await data)[today ? 'todayDeaths' : 'deaths']}<br>`;
    globalTable.innerHTML += `${today ? 'Today' : 'Total'} recovered: ${(await data)[today ? 'todayRecovered' : 'recovered']}<br`;
  }
}

addParams(globalData, 'GLOBAL');

export default async function updateGlobalTable(iso, countryName) {
  currentIso = iso;
  currentCountryName = countryName;
  const countryData = getData(`https://disease.sh/v3/covid-19/countries/${iso}?strict=true`);
  if (await countryData) {
    // globalTable.innerHTML = 'INFO';
    globalTable.innerHTML = '';
    addParams((await countryData), `<b>${countryName}`);
  } else {
    globalTable.innerHTML = 'NO DATA';
  }
}

function updateWrap() {
  if (currentIso === 'GLOBAL') {
    globalTable.innerHTML = '';
    addParams(globalData, 'GLOBAL');
  } else {
    updateGlobalTable(currentIso, currentCountryName);
  }
}

rangeButton.addEventListener('click', () => {
  today = !today;
  document.querySelector('#switch_btn_range').click();
  updateWrap();
});

perButton.addEventListener('click', () => {
  per = !per;
  document.querySelector('#switch_btn_per').click();
  updateWrap();
});

reset.addEventListener('click', () => {
  document.querySelector('.search').value = '';
  currentIso = 'GLOBAL';
  currentCountryName = 'GLOBAL';
  globalTable.innerHTML = '';
  addParams(globalData, 'GLOBAL');
  resetToGlobal();
});
