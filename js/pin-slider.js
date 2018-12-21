'use strict';

(function () {

  var MOVE_SENSIVITY = 3;

  var LOCATION_Y_MIN = 130;
  var LOCATION_Y_MAX = 630;
  var LOCATION_X_MIN = 0;

  var PIN_WIDTH = 65;
  var PIN_SHARP_END_X = 32;
  var PIN_SHARP_END_Y = 84;

  var getPinMaxX = function () {
    var insertPlacePin = document.querySelector('.map__pins');
    var mapMaxX = parseInt(insertPlacePin.clientWidth, 10) - PIN_WIDTH;
    return mapMaxX;
  };

  var mapPinMaxX = getPinMaxX();
  var mainPinPoint = document.querySelector('.map__pin--main');

  var defaultPosition = {};

  var mainPinMousedownHandler = function (evt) {

    var isDragged = false;


    defaultPosition = {
      x: parseInt(getComputedStyle(mainPinPoint).left, 10),
      y: parseInt(getComputedStyle(mainPinPoint).top, 10)
    };

    var downCords = {
      downX: evt.clientX,
      downY: evt.clientY,
    };

    var differenceCords = {
      shiftX: downCords.downX - defaultPosition.x,
      shiftY: downCords.downY - defaultPosition.y
    };

    var mainPinMousemoveHandler = function (evtMove) {

      if (!isDragged) {

        var moveX = evtMove.clientX - downCords.downX;
        var moveY = evtMove.clientY - downCords.downY;
        if (Math.abs(moveX) < MOVE_SENSIVITY && Math.abs(moveY) < MOVE_SENSIVITY) {
          return;
        }
        isDragged = true;

        mainPinPoint.style.zIndex = 9999;
        mainPinPoint.style.position = 'absolute';
      }

      moveX = evtMove.clientX - differenceCords.shiftX;
      moveY = evtMove.clientY - differenceCords.shiftY;

      if (moveX > mapPinMaxX) {
        moveX = mapPinMaxX;
      }
      if (moveX < LOCATION_X_MIN) {
        moveX = LOCATION_X_MIN;
      }
      if (moveY > (LOCATION_Y_MAX - PIN_SHARP_END_Y / 2)) {
        moveY = LOCATION_Y_MAX - PIN_SHARP_END_Y / 2;
      }
      if (moveY < LOCATION_Y_MIN - PIN_SHARP_END_Y / 2) {
        moveY = LOCATION_Y_MIN - PIN_SHARP_END_Y / 2;
      }


      mainPinPoint.style.left = moveX + 'px';
      mainPinPoint.style.top = moveY + 'px';

      window.form.putLocationAddress([moveX + PIN_SHARP_END_X, moveY + PIN_SHARP_END_Y / 2]);

    };

    document.addEventListener('mousemove', mainPinMousemoveHandler);


    var mainPinMouseupHandler = function () {
      document.removeEventListener('mousemove', mainPinMousemoveHandler);
      document.removeEventListener('mouseup', mainPinMouseupHandler);
    };

    document.addEventListener('mouseup', mainPinMouseupHandler);
  };

  mainPinPoint.addEventListener('mousedown', mainPinMousedownHandler);

})();

