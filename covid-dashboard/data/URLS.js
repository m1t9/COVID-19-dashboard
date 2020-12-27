const URLS = {
  ALL: 'https://corona.lmao.ninja/v3/covid-19/all',
  COUNTRIES: 'https://corona.lmao.ninja/v3/covid-19/countries',
  LIGHT_THEME_LAY: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  LIGHT_THEME_ATTR: 'https://www.openstreetmap.org/copyright',
  GRAPH_DATA: 'https://disease.sh/v3/covid-19/historical/all?lastdays=30',
};

function getGLobalCountryUrl(iso) {
  return `https://disease.sh/v3/covid-19/countries/${iso}?strict=true`;
}

function getGraphCountryUrl(iso) {
  return `https://disease.sh/v3/covid-19/historical/${iso}?lastdays=30`;
}

export {
  URLS,
  getGLobalCountryUrl,
  getGraphCountryUrl,
};
