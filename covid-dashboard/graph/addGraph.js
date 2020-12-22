/* eslint-disable import/extensions */
import getData from '../utils/getData.js';

const { Chart } = window;
const globalUrl = 'https://disease.sh/v3/covid-19/historical/all?lastdays=30';

const previousGraph = document.querySelector('.previous-graph');
const nextGraph = document.querySelector('.next-graph');

const graphNames = ['cases', 'deaths', 'recovered'];
const graphColors = ['red', 'yellow', 'green'];

let data = getData(globalUrl);
let currentPos = 0;
let currentGraphName = 'GLOBAL';

// let valuesArr;
// let labelsArr;

// (async () => {
//   valuesArr = Object.values((await globalData).cases);
//   labelsArr = Object.keys((await globalData).cases);
// })();

// const ctx = document.getElementById('myChart').getContext('2d');
let myChart;

async function createGraph(value, name) {
  const ctx = document.getElementById('myChart').getContext('2d');
  myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      // labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      labels: Object.keys((await data)[value]),
      datasets: [{
        label: name ? `${value} ${name}` : value,
        // data: [12, 19, 3, 5, 2, 3],
        data: Object.values((await data)[value]),
        backgroundColor: graphColors[currentPos],
        borderColor: graphColors[currentPos],
        borderWidth: 1,
      }],
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: false,
          },
          scaleLabel: {
            display: true,
            labelString: value,
          },
        }],
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Time',
          },
        }],
      },
    },
  });
}

async function updateGraph(iso) {
  data = (await getData(`https://disease.sh/v3/covid-19/historical/${iso}?lastdays=30`)).timeline;
  myChart.destroy();
  currentGraphName = iso;
  createGraph(graphNames[currentPos], currentGraphName);
  // console.log(data);
}

async function resetToGlobal() {
  data = (await getData('https://disease.sh/v3/covid-19/historical/all?lastdays=30'));
  myChart.destroy();
  currentGraphName = 'GLOBAL';
  createGraph(graphNames[currentPos], currentGraphName);
}

createGraph('cases', currentGraphName);

nextGraph.addEventListener('click', () => {
  currentPos += 1;
  if (currentPos > 2) {
    currentPos = 0;
  }
  myChart.destroy();
  createGraph(graphNames[currentPos], currentGraphName);
});

previousGraph.addEventListener('click', () => {
  currentPos -= 1;
  if (currentPos < 0) {
    currentPos = 2;
  }
  myChart.destroy();
  createGraph(graphNames[currentPos], currentGraphName);
});

export {
  updateGraph,
  resetToGlobal,
};
