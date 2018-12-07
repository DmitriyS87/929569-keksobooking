'use strict';

(function () {
// drag n drop main Pin -----------------------------------------------------------------------------------------------------

  /*
модуль оживляет кнопку
резульат - пользователь получает движение
программа получает координаты и сигнал акитвации страницы

результат функции:
1) данамичная кнопка
2) инициализация карты и формы
3) передаем результат - запуск активной формы да/нет
4) координаты кнопки
*/

  var MOVE_SENSIVITY = 3;

  var LOCATION_Y_MIN = 130;
  var LOCATION_Y_MAX = 630;
  var LOCATION_X_MIN = 0;

  var PIN_WIDTH = 50;

  var getPinMaxX = function () {
    var insertPlacePin = document.querySelector('.map__pins');
    var mapMaxX = parseInt(insertPlacePin.clientWidth, 10) - PIN_WIDTH;
    return mapMaxX;
  };

  var mapPinMaxX = getPinMaxX();
  var mainPinPoint = document.querySelector('.map__pin--main');
  /* var sizeMainPin = {
    width: parseInt(getComputedStyle(mainPinPoint).width, 10),
    height: parseInt(getComputedStyle(mainPinPoint).height, 10),
    defaultX: parseInt(mainPinPoint.style.left, 10) + Math.round(sizeMainPin.width / 2),
    defaultY: parseInt(mainPinPoint.style.top, 10) + Math.round(sizeMainPin.height / 2)
  };
*/

  // -----------------------------------------------------------
  var defaultPosition = {};

  var mainPinMousedownHandler = function (evt) {

    var isDragged = true;


    defaultPosition = {
      x: parseInt(getComputedStyle(mainPinPoint).left, 10),
      y: parseInt(getComputedStyle(mainPinPoint).top, 10)
    };

    var downUpCords = {
      downX: evt.clientX,
      downY: evt.clientY,
    };

    var differenceCords = {
      shiftX: downUpCords.downX - defaultPosition.x,
      shiftY: downUpCords.downY - defaultPosition.y
    };

    var mainPinMousemoveHandler = function (evtMove) {

      if (isDragged) {

        var moveX = evtMove.clientX - downUpCords.downX;
        var moveY = evtMove.clientY - downUpCords.downY;
        if (Math.abs(moveX) < MOVE_SENSIVITY && Math.abs(moveY) < MOVE_SENSIVITY) {
          return;
        } else {
          isDragged = false;
        }

        mainPinPoint.style.zIndex = 9999; // to mainPin
        mainPinPoint.style.position = 'absolute'; // to mainPin
      }

      moveX = evtMove.clientX - differenceCords.shiftX;
      moveY = evtMove.clientY - differenceCords.shiftY;

      if (moveX > mapPinMaxX) {
        moveX = mapPinMaxX;
      }
      if (moveX < LOCATION_X_MIN) {
        moveX = LOCATION_X_MIN;
      }
      if (moveY > LOCATION_Y_MAX) {
        moveY = LOCATION_Y_MAX;
      }
      if (moveY < LOCATION_Y_MIN) {
        moveY = LOCATION_Y_MIN;
      }


      mainPinPoint.style.left = moveX + 'px';
      mainPinPoint.style.top = moveY + 'px';

      downUpCords.upX = moveX;
      downUpCords.upY = moveY;

      window.form.putLocationAddress([moveX, moveY]); // пока решение через window!!!

    };

    document.addEventListener('mousemove', mainPinMousemoveHandler);


    var mainPinMouseupHandler = function (evtUp) {
      if (!isDragged) {
        mainPinPoint.style.left = downUpCords.upX;
        mainPinPoint.style.top = downUpCords.upY;

        if (!window.form.formStatus) {
          window.util.initMain(); // инициирует первый запуск
          window.form.putLocationAddress([evtUp.clientX, evtUp.clientY]); // меняет адрес у поля инпут
        }
      } else {
        window.form.putLocationAddress([evtUp.clientX, evtUp.clientY]); // меняет адрес у поля инпут
      }

      document.removeEventListener('mousemove', mainPinMousemoveHandler);

    };

    document.addEventListener('mouseup', mainPinMouseupHandler);
  };

  mainPinPoint.addEventListener('mousedown', mainPinMousedownHandler);

  // ------------------------------------------------------------------------------------------------------------------------------------------

})();

