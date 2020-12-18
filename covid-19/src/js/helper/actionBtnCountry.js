function actionBtnCountry(selector, allBtnSelector, btnActive) {
  const btn = document.querySelector(selector);
  const btnAll = document.querySelectorAll(allBtnSelector);

  btnAll.forEach((el) => {
    el.classList.remove(btnActive);
  });

  btn.classList.add(btnActive);
}

export default actionBtnCountry;
