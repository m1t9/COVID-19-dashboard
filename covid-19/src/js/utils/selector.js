const tableSelector = document.createElement('select');
// const buttonBox = document.querySelector('.button_box');
// const tableNames = ['cases', 'todayCases', 'deaths'
// , 'todayDeaths', 'recovered', 'todayRecovered'
// , 'active', 'critical', 'casesPerOneMillion', 'deathsPerOneMillion'
// , 'tests', 'testsPerOneMillion', 'population', 'continent'
// , 'oneCasePerPeople', 'oneDeathPerPeople', 'oneTestPerPeople'
// , 'activePerOneMillion', 'recoveredPerOneMillion', 'criticalPerOneMillion'];
const tableNames = ['cases', 'deaths', 'recovered'];

export default function createSSelector() {
  tableNames.forEach((name) => {
    const option = document.createElement('option');
    option.innerHTML = name;
    option.value = name;
    tableSelector.append(option);
  });
  // buttonBox.append(tableSelector);

  return tableSelector;
}
