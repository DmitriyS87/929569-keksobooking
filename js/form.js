'use strict';


(function () {
  var LOCATION_Y_MIN = 130;
  var LOCATION_X_MIN = 0;


  var pinsOnMap;// ???

  var formExport = {};

  formExport.formStatus = false;
  formExport.firstInit = true;

  formExport.putLocationAddress = function (address) { // ?
    address[0] += LOCATION_X_MIN;
    address[1] += LOCATION_Y_MIN;
    document.querySelector('#address').value = address;
  };


  formExport.setAdressDefault = function () {
    document.querySelector('#address').value = [window.map.sizeMainPin.defaultX, window.map.sizeMainPin.defaultY];
  };


  var setElementEnabled = function (element) {
    element.removeAttribute('disabled', 'disabled');
  };

  var setElementDisabled = function (element) {
    element.setAttribute('disabled', 'disabled');
  };


  formExport.disableForm = function () {
    if (formExport.formStatus) {
      var formHeaderFildset = document.querySelector('.ad-form-header');
      setElementDisabled(formHeaderFildset);
      var elementsFieldset = document.querySelectorAll('.ad-form__element');
      elementsFieldset.forEach(function (element) {
        setElementDisabled(element);
      });
      formExport.formStatus = false;
    }
  };


  formExport.activateForm = function () {
    if (!formExport.formStatus) {
      var formHeaderFildset = document.querySelector('.ad-form-header');
      setElementEnabled(formHeaderFildset);
      var elementsFieldset = document.querySelectorAll('.ad-form__element');
      elementsFieldset.forEach(function (element) {
        setElementEnabled(element);
      });
      if (formExport.firstInit) {
        pinsOnMap = document.querySelectorAll('.map__pin:not(.map__pin--main)');
        pinsOnMap.forEach(function (pin) {
          pin.addEventListener('click', function () {
            window.card.changeCardData(window.map.slicePinId(pin.getAttribute('name')));
            if (!window.card.showedCard === true) {
              window.util.showElement(document.querySelector('.map__card'));
              window.card.showedCard = true;
            }
            window.card.crossAddListner();// // функция работает с формой. а вешает обработчик на карточку... надо исправить
          });
        });
        window.map.removeMainPinListener(); // window.map.mainPinPoint.removeEventListener('mouseup', initMain); // надо делить... или менять
      }


      var getMinPrice = function (index) {
        switch (estateTypeSelect.item(index).textContent) {
          case 'Квартира':
            return 1000;
          case 'Бунгало':
            return 0;
          case 'Дом':
            return 5000;
          case 'Дворец':
            return 10000;
          default:
            return 1000;
        }
      };

      var changePrice = function () {
        var minPrice = getMinPrice(estateTypeSelect.selectedIndex);
        estatePriceInput.min = minPrice;
        estatePriceInput.placeholder = minPrice;
      };

      var synchronizeCheckOut = function () {
        checkOutTimeSelect.removeEventListener('change', synchronizeCheckOut);
        checkOutTimeSelect.selectedIndex = checkInTimeSelect.selectedIndex;
        checkOutTimeSelect.addEventListener('change', synchronizeCheckOut);
      };

      var synchronizeCheckIn = function () {
        checkInTimeSelect.removeEventListener('change', synchronizeCheckIn);
        checkInTimeSelect.selectedIndex = checkOutTimeSelect.selectedIndex;
        checkInTimeSelect.addEventListener('change', synchronizeCheckIn);
      };

      var estateTypeSelect = document.querySelector('#type');
      var estatePriceInput = document.querySelector('#price');
      estateTypeSelect.addEventListener('change', changePrice);

      var addressInput = document.querySelector('#address');
      addressInput.setAttribute('readonly', 'readonly');

      var checkInTimeSelect = document.querySelector('#timein');
      checkInTimeSelect.addEventListener('change', synchronizeCheckOut);

      var checkOutTimeSelect = document.querySelector('#timeout');
      checkOutTimeSelect.addEventListener('change', synchronizeCheckIn);

      var getNumberGuestsByRooms = function (rule) {
        switch (rule) {
          case 0:
            return '1';
          case 1:
            return '2';
          case 2:
            return '3';
          case 3:
            return '0';
          default:
            return '3';
        }
      };

      var synchronizeCapacity = function () {
        var selectedIndx = roomsSelect.selectedIndex;
        var ruleIndex;
        if (selectedIndx < 3) {
          for (var n = 0; n <= selectedIndx; n++) {
            ruleIndex = getNumberGuestsByRooms(n);
            capacity.querySelector('[value = \'' + ruleIndex + '\']').disabled = false;
          }
          for (var k = n; k < capacity.options.length; k++) {
            ruleIndex = getNumberGuestsByRooms(k);
            capacity.querySelector('[value = \'' + ruleIndex + '\']').disabled = true;
          }
        } else {
          for (var m = 0; m < selectedIndx; m++) {
            ruleIndex = getNumberGuestsByRooms(m);
            capacity.querySelector('[value = \'' + ruleIndex + '\']').disabled = true;
          }
          ruleIndex = getNumberGuestsByRooms(selectedIndx);
          capacity.querySelector('[value = \'' + ruleIndex + '\']').disabled = false;
        }
      };

      var roomsSelect = document.querySelector('#room_number');
      var capacity = document.querySelector('#capacity');
      roomsSelect.addEventListener('change', synchronizeCapacity);

      var submitElement = document.querySelector('.ad-form__submit');
      var resetElement = document.querySelector('.ad-form__reset');

      var submitData = function (evt) {
        evt.preventDefault();
        /*    for (var i = 0; i < formElement.elements.length; i++) {
          formElement.elements[i].validity
        }

        if (evt.callback === 'sucess') {
          viewSendMessage();
        }
        if (evt.callback === 'error') {
          viewErrorMessage();
        }
        */
        return false;
      };
      submitElement.addEventListener('click', submitData);
    }


    /*
    var viewSendMessage = function () {
      var sendMessageTemplate = document.querySelector('#success').content;
      var fragmentSuccess = document.createDocumentFragment();
      fragmentSuccess.appendChild(sendMessageTemplate);
      document.body.firstElementChild.appendChild(fragmentSuccess);
      sendMessage = document.querySelector('.success');

      sendMessage.addEventListener('keypress', function (evt) {
        if (evt.keyCode === ESC_CODE) {
          deleteMsg(sendMessage);
        }
      });
      sendMessage.addEventListener('click', function () {
        deleteMsg(sendMessage);
        removeClickListner();
      });
    };

    var viewErrorMessage = function () {
      var erroorMessageTemplate = document.querySelector('#error').content;
      var fragmentError = document.createDocumentFragment();
      fragmentError.appendChild(erroorMessageTemplate);
      document.body.firstElementChild.appendChild(fragmentError);
    };
    target="_blank"
   */

    resetElement.addEventListener('click', window.util.setDefaultPage);
    var formElement = document.querySelector('.ad-form');
    formElement.addEventListener('reset', formExport.setAdressDefault);
    // formElement.addEventListener('submit', submitData);

    formExport.formStatus = true; // нужна для слайдера
    formExport.firstInit = false;
    formExport.pinsOnMap = pinsOnMap;

  };

  window.form = formExport;
})();
