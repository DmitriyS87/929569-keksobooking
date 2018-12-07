'use strict';

// модуль map отвечает за работу карты, вывод данных карты
(function () {

  var MAIN_PIN_DEFAULT_LEFT = 570;
  var MAIN_PIN_DEFAULT_TOP = 375;

  var mapExport = {};


  mapExport.slicePinId = function (name) {
    return parseInt(name.slice(3), 10);
  };

  var mainPinPoint = document.querySelector('.map__pin--main');

  mapExport.mainPinPoint = mainPinPoint;

  mapExport.sizeMainPin = {
    width: parseInt(getComputedStyle(mainPinPoint).width, 10),
    height: parseInt(getComputedStyle(mainPinPoint).height, 10),
    defaultX: parseInt(mainPinPoint.style.left, 10) + Math.round(parseInt(getComputedStyle(mainPinPoint).width, 10) / 2),
    defaultY: parseInt(mainPinPoint.style.top, 10) + Math.round(parseInt(getComputedStyle(mainPinPoint).height, 10) / 2)
  };

  mapExport.setMainPinDefaultPosition = function () {
    window.map.mainPinPoint.style.left = MAIN_PIN_DEFAULT_LEFT + 'px';
    window.map.mainPinPoint.style.top = MAIN_PIN_DEFAULT_TOP + 'px';
  };

  mapExport.removeMainPinListener = function () {
    mainPinPoint.removeEventListener('mouseup', window.util.initMain);
  };

  mapExport.pushPinsToMap = function (massiveObjects) {
    var fragmentPin = document.createDocumentFragment();
    var insertPlacePin = document.querySelector('.map__pins');
    // var templatePin = document.querySelector('#pin').content; // ???
    for (var i = 0; i < massiveObjects.length; i++) {
      fragmentPin.appendChild(window.pin.getNewPin(massiveObjects[i], i)); // window.newMapPin?!
    }
    insertPlacePin.appendChild(fragmentPin);
    // firstInit = false;
  };

  mapExport.showPins = function () { // параметр - текущие кнопки на карте
    window.form.pinsOnMap.forEach(function (pin) { // надо бы переделать в более общую функцию
      window.util.showElement(pin);
    });
  };

  mapExport.hideMapPins = function () { // параметр - текущие кнопки на карте
    window.form.pinsOnMap.forEach(function (pin) {
      pin.removeEventListener('click', function () {
        window.changeCardData(mapExport.slicePinId(pin.getAttribute('name')));
        if (!window.card.showedCard === true) { // showedCard объявлен в другом модуле
          window.util.showElement(window.card.popupCard); // наверное некая функция в карде или объект в виндоу
          window.card.showedCard = true; // showedCard объявлен в другом модуле
        }
        window.card.crossAddListner();//  задает событие на крестик карточки как исправить?!
      });
      window.util.hideElement(pin);
    });
    mainPinPoint.removeEventListener('mouseup', window.util.initMain); // надо делить или менять иное решение?
  };

  window.map = mapExport;
})();


