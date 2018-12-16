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

  var pushPinsToMap = function (massiveObjects) {
    var fragmentPin = document.createDocumentFragment();
    var insertPlacePin = document.querySelector('.map__pins');
    massiveObjects.forEach(function (estateObject, i) {
      fragmentPin.appendChild(window.pin.getNewPin(estateObject, i));
      window.filtersForm.checkRefreshMap.push(i); // лишнее!!!!!
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
    mainPinPoint.removeEventListener('mouseup', window.init.initMain);
  };

  var refreshMapPins = function (estateIndexes) {
    var mapPins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    // console.log(mapPins);
    if (mapPins) {
      mapPins.forEach(function (pin) {
        // console.log(pin);
        window.util.hideElement(pin);
      });
    }
    for (var i = 0; i < SHOW_PINS_COUNT; i++) {
      var pin = document.getElementById('pin' + estateIndexes[i]);
      window.util.showElement(pin);
    }
    // window.init.serverEstateData;
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
    refreshMapPins: refreshMapPins
  };
})();


