'use strict';

(function () {

  var MAIN_PIN_DEFAULT_LEFT = 570;
  var MAIN_PIN_DEFAULT_TOP = 375;
  var SHOW_PINS_COUNT = 5;

  var mainPinPoint = document.querySelector('.map__pin--main');

  var sizeMainPin = {
    width: parseInt(getComputedStyle(mainPinPoint).width, 10),
    height: parseInt(getComputedStyle(mainPinPoint).height, 10),
    defaultX: parseInt(mainPinPoint.style.left, 10) + Math.round(parseInt(getComputedStyle(mainPinPoint).width, 10) / 2),
    defaultY: parseInt(mainPinPoint.style.top, 10) + Math.round(parseInt(getComputedStyle(mainPinPoint).height, 10) / 2)
  };

  var setMainPinDefault = function () {
    mainPinPoint.removeAttribute('style');
    mainPinPoint.style.left = MAIN_PIN_DEFAULT_LEFT + 'px';
    mainPinPoint.style.top = MAIN_PIN_DEFAULT_TOP + 'px';
  };

  var slicePinId = function (id) {
    return parseInt(id.slice(3), 10);
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

    document.querySelectorAll('.map__pin:not(.map__pin--main)').forEach(function (pin) {
      pin.addEventListener('click', function () {
        window.card.removeCard();
        changeActivePin(pin);
        window.card.createCard(processedData[slicePinId(pin.getAttribute('id'))], pin);
      });
    });
  };

  var changeActivePin = function (pin) {
    var activePin = document.querySelector('.map__pin--active');
    if (activePin) {
      activePin.classList.remove('.map__pin--active');
    }
    pin.classList.add('.map__pin--active');
  };

  var removeMapPins = function () {
    var mapPins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    mapPins.forEach(function (pin) {
      pin.remove();
    });

  };

  var rewriteMapPins = function (filtredEstates) {
    removeMapPins();
    pushPinsToMap(filtredEstates);
  };

  window.map = {
    mainPinPoint: mainPinPoint,
    sizeMainPin: sizeMainPin,
    setMainPinDefault: setMainPinDefault,
    pushPinsToMap: pushPinsToMap,
    removeMapPins: removeMapPins,
    changeActivePin: changeActivePin,
    rewriteMapPins: rewriteMapPins
  };
})();


