import getData from '../utils/getData';
import { URLS, getGraphCountryUrl } from '../data/URLS';
import CONSTANTS from '../data/CONSTANTS';
import { previousGraph, nextGraph } from '../utils/buttons';

const { Chart } = window;
const globalUrl = URLS.GRAPH_DATA;
const graphNames = ['cases', 'deaths', 'recovered'];
const graphColors = ['red', 'yellow', 'green'];

let data = getData(globalUrl);
let currentPos = 0;
let currentGraphName = CONSTANTS.GLOBAL;
let myChart;

async function createGraph(value, name) {
  const ctx = document.getElementById(CONSTANTS.CHART).getContext('2d');

  myChart = new Chart(ctx, {
    type: 'bar',

    data: {
      labels: Object.keys((await data)[value]),
      datasets: [{
        label: name ? `${value} ${name}` : value,
        data: Object.values((await data)[value]),
        backgroundColor: graphColors[currentPos],
        borderColor: graphColors[currentPos],
        borderWidth: 1,
      }],
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,
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
  data = (await getData(getGraphCountryUrl(iso))).timeline;

  myChart.destroy();
  currentGraphName = iso;
  createGraph(graphNames[currentPos], currentGraphName);
}

async function resetToGlobal() {
  data = (await getData(URLS.GRAPH_DATA));

  myChart.destroy();
  currentGraphName = CONSTANTS.GLOBAL;
  createGraph(graphNames[currentPos], currentGraphName);
}

createGraph(CONSTANTS.CASES, currentGraphName);

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
