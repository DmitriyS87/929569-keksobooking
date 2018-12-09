'use strict';

// модуль map отвечает за работу карты

(function () {

  var MAIN_PIN_DEFAULT_LEFT = 570;
  var MAIN_PIN_DEFAULT_TOP = 375;

  var pinsOnMap;


  var slicePinId = function (name) {
    return parseInt(name.slice(3), 10);
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

  var removeMainPinListener = function () {
    mainPinPoint.removeEventListener('mouseup', window.init.initMain);
  };

  var pushPinsToMap = function (massiveObjects) {
    var fragmentPin = document.createDocumentFragment();
    var insertPlacePin = document.querySelector('.map__pins');
    for (var i = 0; i < massiveObjects.length; i++) {
      fragmentPin.appendChild(window.pin.getNewPin(massiveObjects[i], i));
    }
    insertPlacePin.appendChild(fragmentPin);
  };

  var addEventsPin = function () {
    document.querySelectorAll('.map__pin:not(.map__pin--main)').forEach(function (pin) {
      pin.addEventListener('click', function () {
        window.card.changeCardData(window.map.slicePinId(pin.getAttribute('name')));
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

  var hideMapPins = function () {
    document.querySelectorAll('.map__pin:not(.map__pin--main)').forEach(function (pin) {
      pin.removeEventListener('click', function () {
        window.changeCardData(slicePinId(pin.getAttribute('name')));


        if (!window.card.showedCard === true) {
          window.util.showElement(window.card.popupCard);
          window.card.showedCard = true;
        }


      });
      window.util.hideElement(pin);
    });
    mainPinPoint.removeEventListener('mouseup', window.init.initMain);
  };

  window.map = {
    slicePinId: slicePinId,
    mainPinPoint: mainPinPoint,
    pinsOnMap: pinsOnMap,
    sizeMainPin: sizeMainPin,
    setMainPinDefault: setMainPinDefault,
    removeMainPinListener: removeMainPinListener,
    pushPinsToMap: pushPinsToMap,
    showPins: showPins,
    hideMapPins: hideMapPins,
    addEventsPin: addEventsPin
  };
})();


