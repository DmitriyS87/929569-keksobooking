'use strict';

// модуль отвечает за общее состояние страницы

(function () {

  var ESC_CODE = 27;
  var serverEstateData = [];
  var firstInit = true;

  var onLoad = function (data) {
    data.forEach(function (estateObject) {
      serverEstateData.push(estateObject);
    });
    checkLoadedData(serverEstateData);
    window.form.activateForm();
    if (firstInit) {
      window.card.addHiddenCard();
      firstInit = false;
      window.filtersForm.activateFilters(serverEstateData);
    }
    window.map.pushPinsToMap(serverEstateData); // передать данные через модуль фильтра??? ГОВ.фильтр.колбэк??
    // var filtredEstates = window.filtersForm.doFilterEstate(serverEstateData);
  //  window.map.refreshMapPins(filtredEstates);
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
  };

  window.form.disableForm();
  window.form.setDefaultAdress();


  var initMain = function () {
    window.backend.load(onLoad, onError);
  };


  var setDefaultPage = function () {
    window.map.removeMapPins();
    window.map.setMainPinDefault();
    window.form.setDefaultAdress();
    window.form.disableForm();
    window.form.formStatus = false;
    if (window.card.showedCard) {
      window.util.hideElement(document.querySelector('.map__card'));
      window.card.showedCard = false;
    }

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
      if (evt.keyCode === ESC_CODE) {
        sendMessage.remove();
        document.removeEventListener('keypress', documentKeyPressHandler);
      }
    };

    document.addEventListener('keypress', documentKeyPressHandler);

    sendMessage.addEventListener('click', function () {
      sendMessage.remove();
      document.removeEventListener('keypress', documentKeyPressHandler);
    });
  };


  window.init = {
    initMain: initMain,
    setDefaultPage: setDefaultPage,
    viewMessage: viewMessage,
    serverEstateData: serverEstateData
  };
})();
