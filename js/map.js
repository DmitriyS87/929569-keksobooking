'use strict';

// модуль map отвечает за работу карты

(function () {

  var MAIN_PIN_DEFAULT_LEFT = 570;
  var MAIN_PIN_DEFAULT_TOP = 375;

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
    var i = 0;
    massiveObjects.forEach(function (estateObject) {
      if (estateObject.offer.title && estateObject.offer.price && estateObject.location.x && estateObject.location.y) {
        fragmentPin.appendChild(window.pin.getNewPin(estateObject, i));
        i++;
      } else {
        massiveObjects = massiveObjects.splice(i, 1);
      }
    });
    insertPlacePin.appendChild(fragmentPin);
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

  window.map = {
    slicePinId: slicePinId,
    mainPinPoint: mainPinPoint,
    sizeMainPin: sizeMainPin,
    setMainPinDefault: setMainPinDefault,
    pushPinsToMap: pushPinsToMap,
    showPins: showPins,
    removeMapPins: removeMapPins,
    addEventsPin: addEventsPin,
    changeActivePin: changeActivePin
  };
})();


