function preloadCountry (selector) {
  const regionList= document.querySelector(selector);
  regionList.classList.toggle('opacity');
}

export default preloadCountry;