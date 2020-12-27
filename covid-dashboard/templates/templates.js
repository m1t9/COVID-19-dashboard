import { getColorLegend } from '../utils/colors';
import CONSTANTS from '../data/CONSTANTS';

export function getMapAttr(attr) {
  return `&copy; <a href="${attr}">OpenStreetMap</a> contributors`;
}

export function getLegendTitle(title) {
  return `<${CONSTANTS.DIV} style="text-align: center"><b>${title.toUpperCase()}</${CONSTANTS.DIV}>`;
}

export function getLegendItemRange(gradeFirst, gradeSecond, maxValue) {
  return `<i style="background:${getColorLegend(gradeFirst + 1, maxValue)}"></i> ${gradeFirst}${gradeSecond ? `&ndash;${gradeSecond}<br>` : '+'}`;
}

export function getTip(name, value) {
  return `<${CONSTANTS.DIV} class=""><h3>${name}</h5> <p>Data: ${value}</p></${CONSTANTS.DIV}>`;
}

export function getListItem(flag, value, countryName) {
  return `<img src="${flag}" width="20px" height="10px"> <span id="table_case">${value}</span> ${countryName}`;
}

export function todayListTitle(name) {
  return `today${name.charAt(0).toUpperCase()}${name.slice(1)}`;
}

export function globalTableText(data, name, per, today) {
  const globalTable = document.querySelector(`.${CONSTANTS.GLOBAL_TABLE_DATA}`);

  globalTable.innerHTML += `<${CONSTANTS.DIV}><b>${name}</${CONSTANTS.DIV}>`;
  if (per) {
    const cases = ((data[today ? CONSTANTS.TODAY_CASES : CONSTANTS.CASES] * CONSTANTS.PER_100k)
    / data.population).toFixed(0);
    const deaths = ((data[today ? CONSTANTS.TODAY_DEATHS : CONSTANTS.DEATHS] * CONSTANTS.PER_100k)
    / data.population).toFixed(0);
    const recovered = ((data[today ? CONSTANTS.TODAY_RECOVERED : CONSTANTS.RECOVERED]
      * CONSTANTS.PER_100k) / data.population).toFixed(0);

    globalTable.innerHTML += `<${CONSTANTS.DIV}>${today ? CONSTANTS.TODAY : CONSTANTS.TOTAL} ${CONSTANTS.CASES}: ${cases}</${CONSTANTS.DIV}>`;
    globalTable.innerHTML += `<${CONSTANTS.DIV}>${today ? CONSTANTS.TODAY : CONSTANTS.TOTAL} ${CONSTANTS.DEATHS}: ${deaths}</${CONSTANTS.DIV}>`;
    globalTable.innerHTML += `<${CONSTANTS.DIV}>${today ? CONSTANTS.TODAY : CONSTANTS.TOTAL} ${CONSTANTS.RECOVERED}: ${recovered}</${CONSTANTS.DIV}>`;
  } else {
    globalTable.innerHTML += `<${CONSTANTS.DIV}>${today ? CONSTANTS.TODAY : CONSTANTS.TOTAL} ${CONSTANTS.CASES}: ${data[today ? CONSTANTS.TODAY_CASES : CONSTANTS.CASES]}</${CONSTANTS.DIV}>`;
    globalTable.innerHTML += `<${CONSTANTS.DIV}>${today ? CONSTANTS.TODAY : CONSTANTS.TOTAL} ${CONSTANTS.DEATHS}: ${data[today ? CONSTANTS.TODAY_DEATHS : CONSTANTS.DEATHS]}</${CONSTANTS.DIV}>`;
    globalTable.innerHTML += `<${CONSTANTS.DIV}>${today ? CONSTANTS.TODAY : CONSTANTS.TOTAL} ${CONSTANTS.RECOVERED}: ${data[today ? CONSTANTS.TODAY_RECOVERED : CONSTANTS.RECOVERED]}</${CONSTANTS.DIV}>`;
  }
}
