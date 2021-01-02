import {
  getMapAttr,
  getLegendTitle,
  getLegendItemRange,
  getTip,
  getListItem,
  todayListTitle,
  getGlobalTableItem,
  getLastUpdateTime,
} from '../templates/templates';

const { test } = window;
const { expect } = window;

test('Test getMapAttr template', async () => {
  expect('&copy; <a href="name">OpenStreetMap</a> contributors').toBe(getMapAttr('name'));
});

test('Test getLegendTitle template', async () => {
  expect('<div class="legend_title"><b>NAME</div></b>').toBe(getLegendTitle('name'));
});

test('Test getLegendItemRange template', async () => {
  expect('<i style="background:#ff3333"></i> 1&ndash;2<br>').toBe(getLegendItemRange(1, 2, 3));
});

test('Test getTip template', async () => {
  expect('<div class=""><h3>name</h3> <p>Data: value</p></div>').toBe(getTip('name', 'value'));
});

test('Test getListItem template', async () => {
  expect('<img src="flag" class="flag_pic"> <span id="table_case">value</span> name').toBe(getListItem('flag', 'value', 'name'));
});

test('Test todayListTitle template', async () => {
  expect('todayName').toBe(todayListTitle('name'));
});

test('Test getGlobalTableItem template', async () => {
  expect('<div><b>name</b></div>').toBe(getGlobalTableItem('name'));
});

test('Test getLastUpdateTime template', async () => {
  expect('<b>Last Updated</b> at (YYYY/MM/DD): <br>123</b>').toBe(getLastUpdateTime(123));
});
