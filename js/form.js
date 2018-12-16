'use strict';


(function () {

  var formStatus = false;

  var clearForm = function (form) {
    if (form) {
      var elements = form.elements;
      form.reset();
      for (var i = 0; i < elements.length; i++) {
        var elementType = elements[i].type.toLowerCase();
        switch (elementType) {
          case 'text':
          case 'textarea':
          case 'number':
            elements[i].value = '';
            break;
          case 'select-one':
            var selectOptions = elements[i].options;
            for (var j = 0; j < selectOptions.length; j++) {
              if (selectOptions[j].defaultSelected) {
                selectOptions.selectedIndex = j;
                break;
              }
            }
            break;
            // case 'file':
            //
            //       break;
            // case 'number':
            //
            //     break;
          case 'checkbox':
            if (elements[i].checked) {
              elements[i].checked = false;
            }
            break;
          default:
            break;
        }
      }
      changePrice();
    }
  };

  var putLocationAddress = function (address) {
    document.querySelector('#address').value = address;
  };


  var setDefaultAdress = function () {
    document.querySelector('#address').value = [window.map.sizeMainPin.defaultX, window.map.sizeMainPin.defaultY];
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
    document.querySelector('.ad-form').classList.add('ad-form--disabled');
    document.querySelector('.map').classList.add('map--faded');

    formStatus = false;
  };

  var changePrice = function () {
    var estatePriceInput = document.querySelector('#price');
    var minPrice = minPriceMap[document.querySelector('#type')[document.querySelector('#type').selectedIndex].textContent];
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

    var addressInput = document.querySelector('#address');
    addressInput.setAttribute('readonly', 'readonly');

    var checkInTimeSelect = document.querySelector('#timein');
    checkInTimeSelect.addEventListener('change', synchronizeCheckOut);

    var checkOutTimeSelect = document.querySelector('#timeout');
    checkOutTimeSelect.addEventListener('change', synchronizeCheckIn);


    var synchronizeCapacity = function () {

      var capacity = document.querySelector('#capacity');
      var selectedIndxvalue = roomsSelect[roomsSelect.selectedIndex].value;

      for (var k = 0; k < capacity.children.length; k++) {
        capacity.children[k].disabled = true;
      }

      guestsByRoomsMap[selectedIndxvalue].forEach(function (optionValue) {
        capacity.querySelector('[value = \'' + optionValue + '\']').disabled = false;
      });

    };

    var roomsSelect = document.querySelector('#room_number');
    roomsSelect.addEventListener('change', synchronizeCapacity);

    var resetFormData = function (evt) {
      evt.preventDefault();
      clearForm(evt.target);
      window.init.setDefaultPage();
      dataForm.removeEventListener('reset', resetFormData);
      dataForm.removeEventListener('submit', submitData);
    };

    var submitData = function (evt) {
      evt.preventDefault();
      var data = new FormData(document.querySelector('.ad-form'));
      window.backend.save(onLoad, onError, data);
      return false;
    };

    var dataForm = document.querySelector('.ad-form');
    dataForm.classList.remove('ad-form--disabled');

    dataForm.addEventListener('reset', resetFormData);
    dataForm.addEventListener('submit', submitData);

    window.form.formStatus = true;
  };


  var onLoad = function () {
    var text = 'Данные о Вашем объявлении успешно отправлены на сервер';
    document.querySelector('.ad-form__reset').click();
    window.init.viewMessage('#success', '.success', text);
    var form = document.querySelector('.ad-form');
    clearForm(form);
    window.init.setDefaultPage();
  };

  var onError = function (errorMessage) {
    window.init.viewMessage('#error', '.error', errorMessage);
    // добавить функционал кнопке - попробывать еще раз?
  };

  window.form = {
    formStatus: formStatus,
    putLocationAddress: putLocationAddress,
    disableForm: disableForm,
    activateForm: activateForm,
    setDefaultAdress: setDefaultAdress,
    setElementEnabled: setElementEnabled,
    setElementDisabled: setElementDisabled,
  };
})();
