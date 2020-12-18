import countryConfirmed from './country/countryConfirmed';
import staticAllPeriod from './table/staticAllPeriod';

function fetchCountryArr(result, arrTotalDeaths, arrTotalRecovered, arrTotalConfirmed, arrAllTotal, arrLastDay, arrThousand) {

    result.forEach(element => {
      // console.log(element)
      arrTotalDeaths.push({ Country: element.country, TotalDeaths: element.deaths, Code: element.countryInfo.iso2, flag: element.countryInfo.flag,  });
      arrTotalRecovered.push({ Country: element.country, TotalRecovered: element.recovered, Code: element.countryInfo.iso2, flag: element.countryInfo.flag });
      arrTotalConfirmed.push({ Country: element.country, TotalConfirmed: element.cases, Code: element.countryInfo.iso2, flag: element.countryInfo.flag });
      arrAllTotal.push({ Country: element.country, TotalDeaths: element.deaths, TotalRecovered: element.recovered, TotalConfirmed: element.cases, flag: element.countryInfo.flag, Code: element.countryInfo.iso2 });
      arrLastDay.push({ Country: element.country, TotalDeaths: element.todayDeaths, TotalRecovered: element.todayRecovered, TotalConfirmed: element.todayCases, Code: element.countryInfo.iso2 });
      arrThousand.push ({ Country: element.country, TotalDeaths: element.deaths, TotalRecovered: element.recovered, TotalConfirmed: element.cases, Code: element.countryInfo.iso2, Population: element.population});
    });
  
    arrTotalDeaths.sort((a, b) => {
      if (a.TotalDeaths > b.TotalDeaths) {
        return 1;
      }
      if (a.TotalDeaths < b.TotalDeaths) {
        return -1;
      }
      return 0;
    }).reverse();
  
    arrTotalRecovered.sort((a, b) => {
      if (a.TotalRecovered > b.TotalRecovered) {
        return 1;
      }
      if (a.TotalRecovered < b.TotalRecovered) {
        return -1;
      }
      return 0;
    }).reverse();
  
    arrTotalConfirmed.sort((a, b) => {
      if (a.TotalConfirmed > b.TotalConfirmed) {
        return 1;
      }
      if (a.TotalConfirmed < b.TotalConfirmed) {
        return -1;
      }
      return 0;
    }).reverse();

    countryConfirmed(arrTotalConfirmed);
    staticAllPeriod(arrAllTotal);

    document.querySelectorAll('.region__item').forEach(el => {
      
   
      
      el.addEventListener('click', function () {
        const arrTouchCountry = [];
        const codeCountry =  el.dataset.code;
        result.forEach(element => {
          if (element.countryInfo.iso2 === codeCountry) {
            arrTouchCountry.push({ Country: element.country, TotalDeaths: element.deaths, TotalRecovered: element.recovered, TotalConfirmed: element.cases, flag: element.countryInfo.flag, Code: element.countryInfo.iso2 });
            staticAllPeriod(arrTouchCountry);
          }
        });
        // document.querySelectorAll('.country').forEach(elem => {
        //   elem.classList.add('hide');
        //   if(elem.dataset.code === codeCountry) {
        //     elem.classList.remove('hide');
        //     elem.classList.add('show');
        //   }
        // });
      });
      
    });
  }

  export default fetchCountryArr;



