'use strict';

// модуль map отвечает за работу карты

(function () {

  var MAIN_PIN_DEFAULT_LEFT = 570;
  var MAIN_PIN_DEFAULT_TOP = 375;
  var SHOW_PINS_COUNT = 5;
  var activePinId;

  var slicePinId = function (id) {
    return parseInt(id.slice(3), 10);
  };

  var mainPinPoint = document.querySelector('.map__pin--main');

  var sizeMainPin = {
    width: parseInt(getComputedStyle(mainPinPoint).width, 10),
    height: parseInt(getComputedStyle(mainPinPoint).height, 10),
    defaultX: parseInt(mainPinPoint.style.left, 10) + Math.round(parseInt(getComputedStyle(mainPinPoint).width, 10) / 2),
    defaultY: parseInt(mainPinPoint.style.top, 10) + Math.round(parseInt(getComputedStyle(mainPinPoint).height, 10) / 2)
  };

  var setMainPinDefault = function () {
    mainPinPoint.removeAttribute('style');
    window.map.mainPinPoint.style.left = MAIN_PIN_DEFAULT_LEFT + 'px';
    window.map.mainPinPoint.style.top = MAIN_PIN_DEFAULT_TOP + 'px';
  };

  var pushPinsToMap = function (esatates) {
    var processedData = esatates;
    if (esatates.length > SHOW_PINS_COUNT) {
      processedData = esatates.slice(0, SHOW_PINS_COUNT);
    }
    var fragmentPin = document.createDocumentFragment();
    var insertPlacePin = document.querySelector('.map__pins');
    processedData.forEach(function (estateObject, i) {
      fragmentPin.appendChild(window.pin.getNewPin(estateObject, i));
    });
    insertPlacePin.appendChild(fragmentPin);
    addEventsPin();
  };

  var changeActivePin = function (pin) {
    if (activePinId) {
      document.getElementById(activePinId).classList.remove('.map__pin--active');
    }
    if (pin) {
      pin.classList.add('.map__pin--active');
    }
  };

  var addEventsPin = function () {
    document.querySelectorAll('.map__pin:not(.map__pin--main)').forEach(function (pin) {
      pin.addEventListener('click', function () {
        changeActivePin(pin);
        activePinId = pin.getAttribute('id');
        window.card.changeCardData(slicePinId(activePinId));
        window.util.showElement(document.querySelector('.map__card'));
        window.card.showedCard = true;
      });
    });
  };

  var showPins = function () {
    document.querySelectorAll('.map__pin:not(.map__pin--main)').forEach(function (pin) {
      window.util.showElement(pin);
    });
  };

  var removeMapPins = function () {
    var mapPins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    if (mapPins) {
      mapPins.forEach(function (pin) {
        pin.remove();
      });
    }
  };

  var rewriteMapPins = function (filtredEstates) {
    removeMapPins();
    pushPinsToMap(filtredEstates);
  };

  window.map = {
    slicePinId: slicePinId,
    mainPinPoint: mainPinPoint,
    sizeMainPin: sizeMainPin,
    setMainPinDefault: setMainPinDefault,
    pushPinsToMap: pushPinsToMap,
    showPins: showPins,
    removeMapPins: removeMapPins,
    addEventsPin: addEventsPin,
    changeActivePin: changeActivePin,
    rewriteMapPins: rewriteMapPins
  };
})();


