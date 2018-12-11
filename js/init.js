'use strict';

// модуль отвечает за общее состояние страницы

(function () {
  var ESC_CODE = 27;
  var serverEstateData = [];

  var onLoad = function (data) {
    data.forEach(function (estateObject) {
      serverEstateData.push(estateObject);
    });
    // window.estateData.estateObjects.push(data[i]);
    // window.estateData.estateObjects = data;
    // console.log(serverEstateData);
  };

  var onError = function (errorMessage) {
    viewMessage('#error', '.error', errorMessage);
  };

  window.form.disableForm();
  window.form.setAdressDefault();
  window.backend.makeGetServerRequest(onLoad, onError);


  var initMain = function () {
    if (window.form.firstInit) {
      window.card.addHiddenCard();
      window.map.pushPinsToMap(serverEstateData);
      window.map.addEventsPin();
      window.form.firstInit = false;
    } else {
      window.map.showPins();
    }
    window.map.pinsOnMap = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    window.form.activateForm();
    window.form.formStatus = true;
  };


  var setDefaultPage = function () {
    window.form.disableForm();
    window.form.formStatus = false;
    window.map.hideMapPins();
    if (window.card.showedCard) {
      window.util.hideElement(document.querySelector('.map__card'));
      window.card.showedCard = false;
    }
    window.map.setMainPinDefault();
    window.form.setAdressDefault();
  };

  // var sendMessageTemplate = document.querySelector('#success').content;
  // var erroorMessageTemplate = document.querySelector('#error').content;
  // messageClass = '.success' or '.error'

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
        sendMessage.remove(); // parentNode.removeChild(sendMessage);
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
