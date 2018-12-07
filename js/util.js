'use strict';

(function () {


  // var estateObjects = window.estateObjects;

  var utilExport = {};

  utilExport.hideElement = function (element) {
    element.classList.add('hidden');
  };

  utilExport.showElement = function (element) {
    element.classList.remove('hidden');
  };

  utilExport.removeChildrens = function (element) {
    element.innerHTML = '';
  };

  utilExport.deleteDOMObj = function (documentObj) {
    documentObj.remove();
  };


  utilExport.initMain = function () { // результат работы функции? отображение данных карты, активация состояния формы для записи
    if (window.form.firstInit) {
      window.card.addHiddenCard();
      window.map.pushPinsToMap(window.estateData.estateObjects);
    } else {
      window.map.showPins();
    }
    window.form.activateForm();
  };


  utilExport.setDefaultPage = function () {
    window.form.disableForm();
    window.map.hideMapPins();
    if (window.card.showedCard) { // showedCard объявлен в другом модуле
      utilExport.hideElement(document.querySelector('.map__card'));
      window.card.showedCard = false; // showedCard объявлен в другом модуле
    }
    window.map.setMainPinDefaultPosition();
    window.form.setAdressDefault();

  };

  /*
  var removeClickListner = function () { // функция не понятная ренейминг пересморт!!!
    document.removeEventListener('click', function () {
      deleteDOMObj(sendMessage);
      removeClickListner();
    });
  };

*/


  // нужно создать совбытие на кнопке?!

  /*


*/
  window.util = utilExport;

})();

