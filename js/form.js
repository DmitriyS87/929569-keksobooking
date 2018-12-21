'use strict';

(function () {

  var inputFormCSS = '.ad-form';
  var addressCSS = '#address';

  var putLocationAddress = function (address) {
    document.querySelector(addressCSS).value = address;
  };


  var setElementEnabled = function (element) {
    element.removeAttribute('disabled', 'disabled');
  };

  var setElementDisabled = function (element) {
    element.setAttribute('disabled', 'disabled');
  };


  var disableForm = function () {
    var formHeaderFildset = document.querySelector('.ad-form-header');
    setElementDisabled(formHeaderFildset);
    var formFilters = document.querySelector('.map__filters');
    formFilters.classList.add('ad-form--disabled');
    setElementDisabled(formFilters);
    var elementsFieldset = document.querySelectorAll('.ad-form__element');
    elementsFieldset.forEach(function (element) {
      setElementDisabled(element);
    });
    document.querySelector(inputFormCSS).classList.add('ad-form--disabled');
    document.querySelector('.map').classList.add('map--faded');

    document.querySelector(addressCSS).value = [window.map.sizeMainPin.defaultX, window.map.sizeMainPin.defaultY];

  };

  var changePrice = function () {
    var estatePriceInput = document.querySelector('#price');
    var minPrice = minPriceMap[document.querySelector('#type option:checked').textContent];
    estatePriceInput.min = minPrice;
    estatePriceInput.placeholder = minPrice;
  };

  var minPriceMap = {
    'Квартира': 1000,
    'Бунгало': 0,
    'Дом': 5000,
    'Дворец': 10000
  };

  var activateForm = function () {

    var capacity = document.querySelector('#capacity');

    var guestsByRoomsMap = {
      '1': ['1'],
      '2': ['1', '2'],
      '3': ['1', '2', '3'],
      '100': ['0']
    };

    var formHeaderFildset = document.querySelector('.ad-form-header');
    setElementEnabled(formHeaderFildset);
    var formFilters = document.querySelector('.map__filters');
    formFilters.classList.remove('ad-form--disabled');
    setElementEnabled(formFilters);
    document.querySelector('.map').classList.remove('map--faded');
    var elementsFieldset = document.querySelectorAll('.ad-form__element');
    elementsFieldset.forEach(function (element) {
      setElementEnabled(element);
    });


    var synchronizeCheckOut = function () {
      checkOutTimeSelect.selectedIndex = checkInTimeSelect.selectedIndex;
    };

    var synchronizeCheckIn = function () {
      checkInTimeSelect.selectedIndex = checkOutTimeSelect.selectedIndex;
    };

    var estateTypeSelect = document.querySelector('#type');
    estateTypeSelect.addEventListener('change', changePrice);

    var checkInTimeSelect = document.querySelector('#timein');
    checkInTimeSelect.addEventListener('change', synchronizeCheckOut);

    var checkOutTimeSelect = document.querySelector('#timeout');
    checkOutTimeSelect.addEventListener('change', synchronizeCheckIn);


    var synchronizeCapacity = function () {

      var selectedIndxvalue = roomsSelect[roomsSelect.selectedIndex].value;

      for (var k = 0; k < capacity.children.length; k++) {
        capacity.children[k].disabled = true;
      }

      guestsByRoomsMap[selectedIndxvalue].forEach(function (optionValue) {
        capacity.querySelector('[value = "' + optionValue + '"]').disabled = false;
      });

      checkVailidCapacity();
    };

    var capacityClickHandler = function () {
      capacity.setCustomValidity('');
    };


    var roomsSelect = document.querySelector('#room_number');
    roomsSelect.addEventListener('change', synchronizeCapacity);
    capacity.addEventListener('change', capacityClickHandler);

    var resetFormData = function (evt) {
      evt.preventDefault();
      resetButton.removeEventListener('reset', resetFormData);
      dataForm.removeEventListener('reset', resetFormData);
    };

    var submitData = function (evt) {
      evt.preventDefault();
      var data = new FormData(document.querySelector(inputFormCSS));
      window.backend.save(onLoad, onError, data);
      return false;
    };

    var dataForm = document.querySelector(inputFormCSS);
    dataForm.classList.remove('ad-form--disabled');

    dataForm.addEventListener('submit', submitData);

    var checkVailidCapacity = function () {
      var validityMessage = 'Для данного количества комнат требуется указать иное количество гостей';

      if (capacity[capacity.selectedIndex].disabled) {
        capacity.setCustomValidity(validityMessage);
      } else {
        capacity.setCustomValidity('');
      }
    };

    var resetButton = document.querySelector('.ad-form__reset');

    var resetClickHandler = function () {
      document.querySelector(inputFormCSS).reset();
      dataForm.addEventListener('reset', resetFormData);
      window.init.setDefaultPage();
      dataForm.removeEventListener('submit', submitData);
      resetButton.removeEventListener('click', resetClickHandler);
      capacity.removeEventListener('change', checkVailidCapacity);
      roomsSelect.removeEventListener('change', synchronizeCapacity);
      estateTypeSelect.removeEventListener('change', changePrice);
      checkInTimeSelect.removeEventListener('change', synchronizeCheckOut);
      checkOutTimeSelect.removeEventListener('change', synchronizeCheckIn);
    };

    resetButton.addEventListener('click', resetClickHandler);

  };

  var onLoad = function () {
    var text = 'Данные о Вашем объявлении успешно отправлены на сервер';
    document.querySelector('.ad-form__reset').click();
    window.init.viewMessage('#success', '.success', text);
    window.init.setDefaultPage();
  };

  var onError = function (errorMessage) {
    window.init.viewMessage('#error', '.error', errorMessage);
    // добавить функционал кнопке - попробывать еще раз?
  };


  window.form = {
    putLocationAddress: putLocationAddress,
    disableForm: disableForm,
    activateForm: activateForm,
  };
})();
