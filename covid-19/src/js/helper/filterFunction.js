function filterFunction() {
  const searchInput = document.querySelector('.search');
  const filter = searchInput.value.toUpperCase();
  const element = document.querySelectorAll('.region__item__country');

  for (let i = 0; i < element.length; i+=1) {
    const txtValue = element[i].textContent || element[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      element[i].parentNode.style.display = "flex";
    } else {
      element[i].parentNode.style.display = "none";
    }
  }
}

export default filterFunction;