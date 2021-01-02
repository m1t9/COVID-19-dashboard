import CONSTANTS from '../data/CONSTANTS';
import { resize } from '../map';

const maxBtn = document.querySelectorAll(`.${CONSTANTS.MAXIMIZE_BTN}`);
const tableBox = document.querySelector(`.${CONSTANTS.TABLE_BOX}`);
const mapContainer = document.querySelector(`.${CONSTANTS.MAP_CONTAINER}`);
const globalTable = document.querySelector(`.${CONSTANTS.GLOBAL_TABLE}`);

function fullScreen(full, hide1, hide2) {
  full.classList.toggle(CONSTANTS.FULLSCREEN);
  hide1.classList.toggle(CONSTANTS.NONE);
  hide2.classList.toggle(CONSTANTS.NONE);
}

export default function initFullscreenBtns() {
  maxBtn.forEach((el, i) => {
    el.addEventListener('click', () => {
      switch (i) {
        case 0:
          fullScreen(tableBox, mapContainer, globalTable);
          break;
        case 1:
          fullScreen(mapContainer, tableBox, globalTable);
          resize();
          break;
        case 2:
          fullScreen(globalTable, tableBox, mapContainer);
          break;
        default:
          break;
      }
    });
  });
}
