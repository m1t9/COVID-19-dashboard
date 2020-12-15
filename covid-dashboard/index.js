const { L } = window;

const mapOptions = {
  center: [35, 30],
  zoom: 2,
  layers: [
    // new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    new L.TileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
      maxZoom: 7,
      minZoom: 3,
    }),
  ],
};
const myMap = L.map('mapid', mapOptions);

const urls = [
  'https://corona.lmao.ninja/v3/covid-19/all',
  'https://corona.lmao.ninja/v3/covid-19/countries',
];

function parseJSON(response) {
  return response.json();
}

function checkResponse(response) {
  if (response.status === 200) {
    return Promise.resolve(response);
  }
  return Promise.reject(new Error(response.statusText));
}

function markerClick(obj, info) {
  obj.bindPopup(info).openPopup();
}

Promise.all(urls.map((url) => fetch(url)
  .then(checkResponse)
  .then(parseJSON)
  .catch((err) => err.message)))
  .then((data) => {
    // const globalData = data[0];
    const countryData = data[1];

    countryData.forEach((country) => {
      const { lat, long } = country.countryInfo;
      const circle = L.circle([lat, long], {
        color: '#B95FC2',
        fillColor: '#B95FC2',
        fillOpacity: 0.7,
        radius: 100000,
      }).addTo(myMap);

      const today = (new Date()).toUTCString();
      const covidInfo = `<b>${today}</b><br><b>Country: ${country.country}</b><br><b>Cases: ${country.cases}</b><br><b>Deaths: ${country.deaths}</и><br><b>Today cases: ${country.todayCases}</b><br><b>Today Deaths: ${country.todayDeaths}</b>`;
      circle.on('click', () => {
        markerClick(circle, covidInfo);
      });
    });
  });
