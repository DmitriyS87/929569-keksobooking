'use strict';


(function () {
  var LOCATION_Y_MIN = 130;
  var LOCATION_X_MIN = 0;

  var formStatus = false; // ?
  var firstInit = true;

  var putLocationAddress = function (address) { // ?
    address[0] += LOCATION_X_MIN;
    address[1] += LOCATION_Y_MIN;
    document.querySelector('#address').value = address;
  };


  var setAdressDefault = function () {
    document.querySelector('#address').value = [window.map.sizeMainPin.defaultX, window.map.sizeMainPin.defaultY];
  };


  var setElementEnabled = function (element) {
    element.removeAttribute('disabled', 'disabled');
  };

  var setElementDisabled = function (element) {
    element.setAttribute('disabled', 'disabled');
  };


  var disableForm = function () {
    if (!formStatus) {
      var formHeaderFildset = document.querySelector('.ad-form-header');
      setElementDisabled(formHeaderFildset);
      var elementsFieldset = document.querySelectorAll('.ad-form__element');
      elementsFieldset.forEach(function (element) {
        setElementDisabled(element);
      });

      document.querySelector('.ad-form').classList.add('ad-form--disabled');
      formStatus = false;
    }
  };


  var activateForm = function () {
    if (!formStatus) {
      var formHeaderFildset = document.querySelector('.ad-form-header');
      setElementEnabled(formHeaderFildset);
      var elementsFieldset = document.querySelectorAll('.ad-form__element');
      elementsFieldset.forEach(function (element) {
        setElementEnabled(element);
      });

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
        checkOutTimeSelect.selectedIndex = checkInTimeSelect.selectedIndex;
      };

      var synchronizeCheckIn = function () {
        checkInTimeSelect.selectedIndex = checkOutTimeSelect.selectedIndex;
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
        var ruleIndex = parseInt(getNumberGuestsByRooms(selectedIndx), 10);
        for (var k = 0; k < capacity.options.length; k++) {
          if (k < ruleIndex) {
            capacity.querySelector('[value = \'' + getNumberGuestsByRooms(k) + '\']').disabled = false;
          } else if (ruleIndex === 0 && k === 3) {
            capacity.querySelector('[value = \'' + getNumberGuestsByRooms(k) + '\']').disabled = false;
          } else {
            capacity.querySelector('[value = \'' + getNumberGuestsByRooms(k) + '\']').disabled = true;
          }
        }
      };

      var roomsSelect = document.querySelector('#room_number');
      var capacity = document.querySelector('#capacity');
      roomsSelect.addEventListener('change', synchronizeCapacity);
    }


    var formElement = document.querySelector('.ad-form');
    formElement.classList.remove('ad-form--disabled');

    formElement.addEventListener('reset', setAdressDefault);

    var resetElement = document.querySelector('.ad-form__reset');
    resetElement.addEventListener('click', window.init.setDefaultPage);
  };

  var onLoad = function () {
    var text = 'Данные о Вашем объявлении успешно отправлены на сервер';
    document.querySelector('.ad-form__reset').click();
    // window.init.setDefaultPage();
    window.init.viewMessage('#success', '.success', text);
    /* for (var i = 0; i < data.length; i++) {
      serverEstateData.push(data[i]);
      // window.estateData.estateObjects.push(data[i]);
    }
    // window.estateData.estateObjects = data;
    console.log(serverEstateData);*/
  };

  var onError = function (errorMessage) {
    window.init.viewMessage('#error', '.error', errorMessage);
    console.log(errorMessage);
  };

  var submitData = function (evt) {
    evt.preventDefault();
    var data = new FormData(document.querySelector('.ad-form'));
    window.backend.makePostServerRequest(data, onLoad, onError);
    return false;
  };

  var submitElement = document.querySelector('.ad-form__submit');
  submitElement.addEventListener('click', submitData);


  window.form = {
    formStatus: formStatus,
    firstInit: firstInit,
    putLocationAddress: putLocationAddress,
    disableForm: disableForm,
    activateForm: activateForm,
    setAdressDefault: setAdressDefault,
    setElementEnabled: setElementEnabled,
    setElementDisabled: setElementDisabled,
  };
})();
