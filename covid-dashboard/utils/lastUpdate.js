const lastUpdateBlock = document.querySelector('.update-time');

export default function updateTime(time) {
  const localTime = new Date(time);
  const timeFormat = `${localTime.getUTCFullYear()}/${
    (`0${localTime.getUTCMonth() + 1}`).slice(-2)}/${
    (`0${localTime.getUTCDate()}`).slice(-2)} ${
    (`0${localTime.getUTCHours()}`).slice(-2)}:${
    (`0${localTime.getUTCMinutes()}`).slice(-2)}:${
    (`0${localTime.getUTCSeconds()}`).slice(-2)}`;

  lastUpdateBlock.innerHTML = `<b>Last Updated</b> at (YYYY/MM/DD): <br>${timeFormat}`;
}
