function countryRecovered (result) {
  
  const regionList = document.querySelector('.region__list');

  regionList.innerHTML = '';
  
  result.forEach(el => {
    regionList.innerHTML += `
    <div class="region__item" data-code="${el.Code}">
      <div class="region__item__quantity recovered">${el.TotalRecovered}</div>
      <div class="region__item__country">${el.Country}</div>
      <div class="region__img"><img id='myImage' src="${el.flag}" /></div>
    </div>
    `;
  });
}

export default countryRecovered;