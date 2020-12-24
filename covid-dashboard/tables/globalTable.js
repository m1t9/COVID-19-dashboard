import getData from '../utils/getData';
import { resetToGlobal } from '../graph/addGraph';

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
  if (per) {
    const cases = (((await data)[today ? 'todayCases' : 'cases'] * 100000) / (await data).population).toFixed(0);
    const deaths = (((await data)[today ? 'todayDeaths' : 'deaths'] * 100000) / (await data).population).toFixed(0);
    const recovered = (((await data)[today ? 'todayRecovered' : 'recovered'] * 100000) / (await data).population).toFixed(0);

    globalTable.innerHTML += `<div><b>${name}</div>`;
    globalTable.innerHTML += `<div>${today ? 'Today' : 'Total'} cases: ${cases}</div>`;
    globalTable.innerHTML += `<div>${today ? 'Today' : 'Total'} deaths: ${deaths}</div>`;
    globalTable.innerHTML += `<div>${today ? 'Today' : 'Total'} recovered: ${recovered}</div>`;
  } else {
    globalTable.innerHTML += `<div><b>${name}</div>`;
    globalTable.innerHTML += `<div>${today ? 'Today' : 'Total'} cases: ${(await data)[today ? 'todayCases' : 'cases']}</div>`;
    globalTable.innerHTML += `<div>${today ? 'Today' : 'Total'} deaths: ${(await data)[today ? 'todayDeaths' : 'deaths']}</div>`;
    globalTable.innerHTML += `<div>${today ? 'Today' : 'Total'} recovered: ${(await data)[today ? 'todayRecovered' : 'recovered']}</div>`;
  }
}

addParams(globalData, 'GLOBAL');

export default async function updateGlobalTable(iso, countryName) {
  currentIso = iso;
  currentCountryName = countryName;
  const countryData = getData(`https://disease.sh/v3/covid-19/countries/${iso}?strict=true`);
  if (await countryData) {
    globalTable.innerHTML = '';
    addParams((await countryData), `<div><b>${countryName}</div>`);
  } else {
    globalTable.innerHTML = '<div>NO DATA</div>';
  }
}

function updateWrap() {
  if (currentIso === 'GLOBAL') {
    globalTable.innerHTML = '';
    addParams(globalData, '<div>GLOBAL</div>');
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
  addParams(globalData, '<div>GLOBAL</div>');
  resetToGlobal();
});
