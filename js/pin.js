'use strict';
(function () {

  var pinExport = {};

  pinExport.getNewPin = function (estateObject, number) {
    var template = document.querySelector('#pin').content;
    var newMapPin = template.cloneNode(true);

    var firstTag = newMapPin.querySelector('.map__pin');
    var secondTag = newMapPin.querySelector('img');

    var styleText = 'left:' + estateObject.location.x + 'px; top:' + estateObject.location.y + 'px;';
    firstTag.style.cssText = styleText;
    firstTag.setAttribute('name', 'pin' + number);
    secondTag.src = estateObject.author.avatar;
    secondTag.alt = estateObject.offer.title;

    return newMapPin;
  };

  window.pin = pinExport;

})();

