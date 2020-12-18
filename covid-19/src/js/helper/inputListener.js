import filterFunction from './filterFunction';

function inputListener () {
  const searchInput = document.querySelector('.search');
  searchInput.addEventListener('keyup', filterFunction);
}  

export default inputListener;