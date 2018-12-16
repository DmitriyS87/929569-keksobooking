'use strict';
(function () {

  var getNewPin = function (estateObject, number) {
    var template = document.querySelector('#pin').content;
    var newMapPin = template.cloneNode(true);

    var firstTag = newMapPin.querySelector('.map__pin');
    var secondTag = newMapPin.querySelector('img');

    var styleText = 'left:' + estateObject.location.x + 'px; top:' + estateObject.location.y + 'px;';
    firstTag.style.cssText = styleText;
    firstTag.setAttribute('id', 'pin' + number);
    secondTag.src = estateObject.author.avatar;
    secondTag.alt = estateObject.offer.title;

    return newMapPin;
  };

  window.pin = {
    getNewPin: getNewPin
  };

})();

