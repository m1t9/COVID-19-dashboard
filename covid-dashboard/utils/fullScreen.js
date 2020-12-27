import CONSTANTS from '../data/CONSTANTS';

export default function fullScreen(full, hide1, hide2) {
  full.classList.toggle(CONSTANTS.FULLSCREEN);
  hide1.classList.toggle(CONSTANTS.NONE);
  hide2.classList.toggle(CONSTANTS.NONE);
}
