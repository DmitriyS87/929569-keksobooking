'use strict';

(function () {


  var serverEstateData = [];

  var onLoad = function (data) {
    serverEstateData = data.slice(0);
    checkLoadedData(serverEstateData);
    window.form.activateForm();
    window.filtersForm.activateFilters(serverEstateData);
    window.map.pushPinsToMap(serverEstateData);
  };

  var checkLoadedData = function (estateData) {
    estateData.forEach(function (estateObject, index) {
      if (!estateObject.offer.title && !estateObject.offer.price && !estateObject.location.x && !estateObject.location.y) {
        estateData = estateData.splice(index, 1);
      }
    });
  };

  var onError = function (errorMessage) {
    viewMessage('#error', '.error', errorMessage);
    window.form.disableForm();
    window.map.setMainPinDefault();
    makeListenerToLoad();
  };

  var makeListenerToLoad = function () {
    var documentMouseUpHandler = function () {
      window.backend.load(onLoad, onError);
      document.querySelector('.map__pin--main').removeEventListener('mouseup', documentMouseUpHandler);
    };
    document.querySelector('.map__pin--main').addEventListener('mouseup', documentMouseUpHandler);
  };

  window.form.disableForm();
  makeListenerToLoad();


  var setDefaultPage = function () {
    window.map.removeMapPins();
    window.map.setMainPinDefault();
    window.form.disableForm();
    window.form.deletePhotos();
    window.card.removeCard();
    window.filtersForm.resetFilters();
    makeListenerToLoad();
  };

  var viewMessage = function (templateClass, messageClass, text) {
    var fragmentMessage = document.createDocumentFragment();
    var templateMessage = document.querySelector(templateClass).content;
    fragmentMessage.appendChild(templateMessage.cloneNode(true));
    document.body.firstElementChild.appendChild(fragmentMessage);

    var sendMessage = document.querySelector(messageClass);
    if (text) {
      sendMessage.querySelector('p').textContent = text;
    }

    var documentKeyPressHandler = function (evt) {
      if (evt.keyCode === window.util.ESC_CODE) {
        sendMessage.remove();
        document.removeEventListener('keydown', documentKeyPressHandler);
      }
    };

    document.addEventListener('keydown', documentKeyPressHandler);

    sendMessage.addEventListener('click', function () {
      sendMessage.remove();
      document.removeEventListener('keydown', documentKeyPressHandler);
    });
  };

  window.init = {
    setDefaultPage: setDefaultPage,
    viewMessage: viewMessage,
  };
})();
