/* eslint-disable import/extensions */
// import createElementWrap from '../utils/wrappers.js';
import getData from '../utils/getData.js';

const urls = [
  'https://corona.lmao.ninja/v3/covid-19/all',
  'https://corona.lmao.ninja/v3/covid-19/countries',
];

const globalTable = document.querySelector('.global-table');

const globalData = getData(urls[0]);

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
  globalTable.innerHTML += `<br>${name}`;
  globalTable.innerHTML += `<br>Total cases: ${(await data).cases}<br>`;
  globalTable.innerHTML += `Total deaths: ${(await data).deaths}<br>`;
  globalTable.innerHTML += `Total deaths: ${(await data).recovered}<br`;
}

addParams(globalData, 'GLOBAL');

export default async function updateGlobalTable(iso, countryName) {
  const countryData = getData(`https://disease.sh/v3/covid-19/countries/${iso}?strict=true`);
  if (await countryData) {
    globalTable.innerHTML = 'INFO';
    addParams((await countryData), `<b>${countryName}`);
  } else {
    globalTable.innerHTML = 'NO DATA';
  }
}
