export function getColor(d, maxValue) {
  if (d > maxValue * 0.9) { return '#330000'; }
  if (d > maxValue * 0.8) { return '#b30000'; }
  if (d > maxValue * 0.7) { return '#ff0000'; }
  if (d > maxValue * 0.6) { return '#ff1a1a'; }
  if (d > maxValue * 0.5) { return '#ff3333'; }
  if (d > maxValue * 0.4) { return '#ff4d4d'; }
  if (d > maxValue * 0.3) { return '#ff6666'; }
  if (d > maxValue * 0.1) { return '#ff8080'; }
  if (d > maxValue * 0.05) { return '#ff9999'; }
  if (d > maxValue * 0.01) { return '#ffcccc'; }
  if (d > maxValue * 0.005) { return '#ffe6e6'; }

  return '#ffffff';
}

export function getColorLegend(d, maxValue) {
  if (d > maxValue * 0.9) { return '#800000'; }
  if (d > maxValue * 0.5) { return '#ff3333'; }
  if (d > maxValue * 0.3) { return '#ff6666'; }
  if (d > maxValue * 0.1) { return '#ff9999'; }
  if (d > maxValue * 0.01) { return '#ffe6e6'; }

  return '#ffffff';
}

export function getGradesArr(maxValue) {
  return [
    0,
    (0.01 * maxValue).toFixed(0),
    (0.05 * +maxValue).toFixed(0),
    (0.1 * +maxValue).toFixed(0),
    (0.3 * +maxValue).toFixed(0),
    (0.5 * +maxValue).toFixed(0),
    (0.9 * +maxValue).toFixed(0),
  ];
}
