function staticThounds(result) {

  const tableStatic = document.querySelector(".table__static");

  tableStatic.innerHTML = "";

  result.forEach((el) => {
    tableStatic.innerHTML += `
    <tr class="country" data-code="${el.Code}">
      <td class="table__country">${el.Country}</td>
      <td class="table__all">${ Math.floor((el.TotalConfirmed/el.Population)*100000) }</td>
      <td class="table__deaths">${ Math.floor((el.TotalDeaths/el.Population)*100000) }</td>
      <td class="table__recovered">${ Math.floor((el.TotalRecovered/el.Population)*100000) }</td>
    </tr>
    `;
  });
}

export default staticThounds;
