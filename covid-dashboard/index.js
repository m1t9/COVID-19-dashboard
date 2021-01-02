import { updateMap } from './map';
import { createTable } from './tables/createTable';
import CONSTANTS from './data/CONSTANTS';
import initFullscreenBtns from './utils/fullScreen';

createTable(CONSTANTS.CASES);
updateMap(CONSTANTS.CASES);
initFullscreenBtns();
