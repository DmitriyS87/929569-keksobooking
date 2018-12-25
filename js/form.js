'use strict';

(function () {

  var ESTATE_PHOTO_WIDTH = 70;
  var ESTATE_PHOTO_HEIGHT = 70;

  var INPUT_FORM_CSS = '.ad-form';
  var ADDRESS_CSS = '#address';

  var DEFAULT_AVATAR_SRC = 'img/muffin-grey.svg';

  var defaultContainer = document.querySelector('.ad-form__photo').cloneNode(true);
  var estatePhotoContainer = document.querySelector('.ad-form__photo-container');
  var avatarPreview = document.querySelector('.ad-form-header__preview img');

  var putLocationAddress = function (address) {
    document.querySelector(ADDRESS_CSS).value = address;
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
    [].forEach.call(elementsFieldset, function (element) {
      setElementDisabled(element);
    });
    document.querySelector(INPUT_FORM_CSS).classList.add('ad-form--disabled');
    document.querySelector('.map').classList.add('map--faded');
    document.querySelector(ADDRESS_CSS).value = [window.map.sizeMainPin.defaultX, window.map.sizeMainPin.defaultY];

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

  var deletePhotos = function () {
    var estatePreviewContainers = document.querySelectorAll('.ad-form__photo');
    [].forEach.call(estatePreviewContainers, function (block) {
      block.remove();
    });
    estatePhotoContainer.appendChild(defaultContainer);
    avatarPreview.src = DEFAULT_AVATAR_SRC;
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
    [].forEach.call(elementsFieldset, function (element) {
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

    var checkVailidCapacity = function () {
      var validityMessage = 'Для данного количества комнат требуется указать иное количество гостей';

      if (capacity[capacity.selectedIndex].disabled) {
        capacity.setCustomValidity(validityMessage);
      } else {
        capacity.setCustomValidity('');
      }
    };

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

    synchronizeCapacity();

    var resetFormData = function (evt) {
      evt.preventDefault();
      resetButton.removeEventListener('reset', resetFormData);
      dataForm.removeEventListener('reset', resetFormData);
    };

    var submitData = function (evt) {
      evt.preventDefault();
      var data = new FormData(document.querySelector(INPUT_FORM_CSS));
      window.backend.save(onLoad, onError, data);
      return false;
    };

    var dataForm = document.querySelector(INPUT_FORM_CSS);
    dataForm.classList.remove('ad-form--disabled');

    dataForm.addEventListener('submit', submitData);

    var resetButton = document.querySelector('.ad-form__reset');

    var resetClickHandler = function () {
      document.querySelector(INPUT_FORM_CSS).reset();
      dataForm.addEventListener('reset', resetFormData);
      window.init.setDefaultPage();
      dataForm.removeEventListener('submit', submitData);
      resetButton.removeEventListener('click', resetClickHandler);
      capacity.removeEventListener('change', checkVailidCapacity);
      roomsSelect.removeEventListener('change', synchronizeCapacity);
      estateTypeSelect.removeEventListener('change', changePrice);
      checkInTimeSelect.removeEventListener('change', synchronizeCheckOut);
      checkOutTimeSelect.removeEventListener('change', synchronizeCheckIn);
      avatarPhotoinput.removeEventListener('change', avatarPhotoChangeHandler);
      estatePhotoinput.removeEventListener('change', estatePhotoChangeHandler);
    };

    resetButton.addEventListener('click', resetClickHandler);

    var avatarPhotoinput = document.querySelector('.ad-form__field input');

    var avatarPhotoChangeHandler = function () {
      window.inputImage.makePreview(avatarPhotoinput, avatarPreview);
    };

    avatarPhotoinput.addEventListener('change', avatarPhotoChangeHandler);

    var estatePhotoinput = document.querySelector('.ad-form__upload input');

    var makePreviewPhotoContainer = function () {
      var div = defaultContainer.cloneNode();
      div.innerHTML = '<img src="" alt="Фото вашего объявления" width=' + ESTATE_PHOTO_WIDTH + 'px height=' + ESTATE_PHOTO_HEIGHT + 'px >';
      var fragment = document.createDocumentFragment();
      fragment.appendChild(div);
      estatePhotoContainer.insertBefore(fragment, estatePhotoContainer.children[1]);

      var imageClickHandler = function (evt) {
        if (evt.target.tagName === 'IMG') {
          window.photoViewer.showFullScreen(evt.target);
        }
      };

      estatePhotoContainer.children[1].addEventListener('click', imageClickHandler);
    };

    var estatePhotoChangeHandler = function () {
      makePreviewPhotoContainer();
      var estatePreview = document.querySelector('.ad-form__photo img');
      window.inputImage.makePreview(estatePhotoinput, estatePreview);
    };

    estatePhotoinput.addEventListener('change', estatePhotoChangeHandler);

  };

  var onLoad = function () {
    var text = 'Данные о Вашем объявлении успешно отправлены на сервер';
    document.querySelector('.ad-form__reset').click();
    window.init.viewMessage('#success', '.success', text);
    window.init.setDefaultPage();
  };

  var onError = function (errorMessage) {
    window.init.viewMessage('#error', '.error', errorMessage);
  };


  window.form = {
    putLocationAddress: putLocationAddress,
    disableForm: disableForm,
    activateForm: activateForm,
    deletePhotos: deletePhotos
  };
})();
