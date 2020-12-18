function staticLastDay(result) {

  const tableStatic = document.querySelector('.table__static');

  tableStatic.innerHTML = '';

  result.forEach(el => {
    tableStatic.innerHTML += `
    <tr class="country" data-code="${el.Code}">
      <td class="table__country">${el.Country}</td>
      <td class="table__all">${el.TotalConfirmed}</td>
      <td class="table__deaths">${el.TotalDeaths}</td>
      <td class="table__recovered">${el.TotalRecovered}</td>
    </tr>
    `;
  });

}

export default staticLastDay;