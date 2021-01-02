/* eslint-disable max-len */
import { getColorLegend } from '../utils/colors';
import CONSTANTS from '../data/CONSTANTS';

export function getMapAttr(attr) {
  return `&copy; <a href="${attr}">OpenStreetMap</a> contributors`;
}

export function getLegendTitle(title) {
  return `<${CONSTANTS.DIV} class="legend_title"><b>${title.toUpperCase()}</${CONSTANTS.DIV}></b>`;
}

export function getLegendItemRange(gradeFirst, gradeSecond, maxValue) {
  return `<i style="background:${getColorLegend(gradeFirst + 1, maxValue)}"></i> ${gradeFirst}${gradeSecond ? `&ndash;${gradeSecond}<br>` : '+'}`;
}

export function getTip(name, value) {
  return `<${CONSTANTS.DIV} class=""><h3>${name}</h3> <p>Data: ${value}</p></${CONSTANTS.DIV}>`;
}

export function getListItem(flag, value, countryName) {
  return `<img src="${flag}" class="flag_pic"> <span id="table_case">${value}</span> ${countryName}`;
}

export function todayListTitle(name) {
  return `today${name.charAt(0).toUpperCase()}${name.slice(1)}`;
}

export function getGlobalTableItem(name) {
  return `<${CONSTANTS.DIV}><b>${name}</b></${CONSTANTS.DIV}>`;
}

export function globalTableText(data, name, isAbsolute, today) {
  const globalTable = document.querySelector(`.${CONSTANTS.GLOBAL_TABLE_DATA}`);
  const range = today ? CONSTANTS.TODAY : CONSTANTS.TOTAL;
  const tag = CONSTANTS.DIV;

  globalTable.innerHTML += `<${CONSTANTS.DIV}><b>${name}</${CONSTANTS.DIV}></b>`;
  if (isAbsolute) {
    const absoluteCoeff = CONSTANTS.PER_100k / data.population;
    const cases = (data[today ? CONSTANTS.TODAY_CASES : CONSTANTS.CASES] * absoluteCoeff).toFixed(0);
    const deaths = (data[today ? CONSTANTS.TODAY_DEATHS : CONSTANTS.DEATHS] * absoluteCoeff).toFixed(0);
    const recovered = (data[today ? CONSTANTS.TODAY_RECOVERED : CONSTANTS.RECOVERED] * absoluteCoeff).toFixed(0);

    globalTable.innerHTML += `<${tag}>${range} ${CONSTANTS.CASES}: ${cases}</${tag}>`;
    globalTable.innerHTML += `<${tag}>${range} ${CONSTANTS.DEATHS}: ${deaths}</${tag}>`;
    globalTable.innerHTML += `<${tag}>${range} ${CONSTANTS.RECOVERED}: ${recovered}</${tag}>`;
  } else {
    const cases = data[today ? CONSTANTS.TODAY_CASES : CONSTANTS.CASES];
    const deaths = data[today ? CONSTANTS.TODAY_DEATHS : CONSTANTS.DEATHS];
    const recovered = data[today ? CONSTANTS.TODAY_RECOVERED : CONSTANTS.RECOVERED];

    globalTable.innerHTML += `<${tag}>${range} ${CONSTANTS.CASES}: ${cases}</${tag}>`;
    globalTable.innerHTML += `<${tag}>${range} ${CONSTANTS.DEATHS}: ${deaths}</${tag}>`;
    globalTable.innerHTML += `<${tag}>${range} ${CONSTANTS.RECOVERED}: ${recovered}</${tag}>`;
  }
}

export function getLastUpdateTime(timeFormat) {
  return `<b>Last Updated</b> at (YYYY/MM/DD): <br>${timeFormat}</b>`;
}
