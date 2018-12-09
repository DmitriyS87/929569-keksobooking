'use strict';

// модуль отвечает за общее состояние страницы

(function () {

  window.form.disableForm();
  window.form.setAdressDefault();

  var initMain = function () {
    if (window.form.firstInit) {
      window.card.addHiddenCard();
      window.map.pushPinsToMap(window.estateData.estateObjects);
      window.map.addEventsPin();
      window.form.firstInit = false;
    } else {
      window.map.showPins();
    }
    window.map.pinsOnMap = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    window.form.activateForm();
    window.form.formStatus = true;
  };


  var setDefaultPage = function () {
    window.form.disableForm();
    window.form.formStatus = false;
    window.map.hideMapPins();
    if (window.card.showedCard) {
      window.util.hideElement(document.querySelector('.map__card'));
      window.card.showedCard = false;
    }
    window.map.setMainPinDefault();
    window.form.setAdressDefault();

  };
  window.init = {
    initMain: initMain,
    setDefaultPage: setDefaultPage
  };
})();
