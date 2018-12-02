'use strict';

var AVATARS_PATH = 'img/avatars/user0';
var AUTHORS_COUNT = 8;
var MIN_PRICE_UNIT = 1000;
var MAX_PRICE_UNIT = 1000000;
var MIN_ROOMS_COUNT = 1;
var MAX_ROOMS_COUNT = 5;
var MAX_GUESTS_IN_ROOMS = 3;
var LOCATION_Y_MIN = 130;
var LOCATION_Y_MAX = 630;
var NUMBER_ESTATE_OBJECTS = 8;
var ESTATE_TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var ESTATE_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var CHECK_IN_OUT_VARIANTS = ['12:00', '13:00', '14:00'];
var FEATURES_VARIANTS = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
// var ESC_CODE = '27';

var EstatePhotos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var firstInit = true;
var formStatus = true;
var showedCard = false;
var popupCard;
var pinsOnMap;
var cross;
var sendMessage;

var getArraySequence = function (max) {
  var sequence = [];
  for (var index = 0; index < max; index++) {
    sequence[index] = index;
  }
  return sequence;
};

var getArrayRandomSequence = function (massive) {
  var sequence = [];
  var randomIndex;
  var auxiliarySequence = getArraySequence(massive.length);
  for (var j = 0; j < massive.length; j++) {
    randomIndex = getRandomMinMax(0, massive.length - 1 - j);
    sequence.push(auxiliarySequence[randomIndex]);
    auxiliarySequence.splice(randomIndex, 1);
  }
  return sequence;

};

var getArrayPhotos = function (massivePhotos) {
  var randomSequence = getArrayRandomSequence(massivePhotos);
  var photosString = [];
  for (var j = 0; j < massivePhotos.length; j++) {
    photosString.push(EstatePhotos[randomSequence[j]]);
  }
  return photosString;

};

var getRandomMinMax = function (min, max) {
  var randomCount = Math.round(min + Math.random() * (max - min));
  return randomCount;
};

var getLocationXOrY = function (min, max) {
  return getRandomMinMax(min, max);
};

var cropArray = function (massive, endItem) {
  var outputMassive = [];
  for (var i = 0; i < endItem; i++) {
    outputMassive.push(massive[i]);
  }
  return outputMassive;
};

var getRandomItem = function (array) {
  return array[getRandomMinMax(0, array.length - 1)];
};

var getRandomEstateObject = function (numberEstateOblect) {
  var locationX = getLocationXOrY(MinMaxXMapPin[0], MinMaxXMapPin[1]);
  var locationY = getLocationXOrY(LOCATION_Y_MIN, LOCATION_Y_MAX);
  var countRooms = getRandomMinMax(MIN_ROOMS_COUNT, MAX_ROOMS_COUNT);

  var makedEstateOgj = {
    author: {
      avatar: AVATARS_PATH + (avatarsRandomSequenceIndex[numberEstateOblect] + 1) + '.png'},
    offer: {
      title: ESTATE_TITLES[estateTitlesIndex[numberEstateOblect]],
      address: [locationX, locationY],
      price: getRandomMinMax(MIN_PRICE_UNIT, MAX_PRICE_UNIT),
      type: getRandomItem(ESTATE_TYPES),
      rooms: countRooms,
      guests: getRandomMinMax(1, (countRooms * MAX_GUESTS_IN_ROOMS)),
      checkin: getRandomItem(CHECK_IN_OUT_VARIANTS),
      checkout: getRandomItem(CHECK_IN_OUT_VARIANTS),
      features: cropArray(FEATURES_VARIANTS, getRandomMinMax(0, FEATURES_VARIANTS.length)),
      description: '',
      photos: getArrayPhotos(EstatePhotos)
    },

    location: {
      x: locationX,
      y: locationY
    }

  };

  return makedEstateOgj;
};

var getEstateTypeTranslate = function (currentObject) {
  switch (currentObject.offer.type) {
    case 'flat':
      return 'Квартира';
    case 'bungalo':
      return 'Бунгало';
    case 'house':
      return 'Дом';
    case 'palace':
      return 'Дворец';
    default:
      return 'Шалаш';
  }
};

var getMaxXPin = function () {
  var insertPlacePin = document.querySelector('.map__pins');
  var templatePin = document.querySelector('#pin').content;
  var pinTemplateWidth = getComputedStyle(templatePin.querySelector('.map__pin')).width;
  var mapMaxX = insertPlacePin.clientWidth - parseInt(pinTemplateWidth, 10);
  var mapMinX = 0 + parseInt(pinTemplateWidth, 10);
  return [mapMinX, mapMaxX];
};

var getNewPin = function (estateObject, template, number) {
  var newMapPin = template.cloneNode(true);
  var firstTag = newMapPin.querySelector('.map__pin');
  var secondTag = newMapPin.querySelector('img');
  firstTag.style = 'left: ' + estateObject.location.x + 'px; top: ' + estateObject.location.y + 'px;';
  firstTag.setAttribute('name', 'pin' + number);
  secondTag.src = estateObject.author.avatar;
  secondTag.alt = estateObject.offer.title;
  return newMapPin;
};

var pushPinsToMap = function (massiveObjects) {
  var fragmentPin = document.createDocumentFragment();
  var insertPlacePin = document.querySelector('.map__pins');
  var templatePin = document.querySelector('#pin').content;
  for (var i = 0; i < massiveObjects.length; i++) {
    fragmentPin.appendChild(getNewPin(massiveObjects[i], templatePin, i));
  }
  insertPlacePin.appendChild(fragmentPin);
};

var slicePinId = function (name) {
  return parseInt(name.slice(3), 10);
};

var changeCardData = function (index) {

  popupCard.querySelector('.popup__title').textContent = estateObjects[index].offer.title;
  popupCard.querySelector('.popup__text--address').textContent = estateObjects[index].offer.address;
  popupCard.querySelector('.popup__text--price').textContent = estateObjects[index].offer.price + '₽/ночь';
  popupCard.querySelector('.popup__type').textContent = getEstateTypeTranslate(estateObjects[index]);

  var roomsText = 'ы';
  if (estateObjects[index].offer.rooms < 2) {
    roomsText = 'а';
  } else if (estateObjects[index].offer.rooms > 4) {
    roomsText = '';
  }
  var guestsText = 'ей';
  if (estateObjects[index].offer.guests < 2) {
    guestsText = 'я';
  }

  popupCard.querySelector('.popup__text--capacity').textContent = estateObjects[index].offer.rooms + ' комнат' + roomsText + ' для ' + estateObjects[index].offer.guests + ' гост' + guestsText + '.';
  popupCard.querySelector('.popup__text--time').textContent = 'Заезд после ' + estateObjects[index].offer.checkin + ', выезд до ' + estateObjects[index].offer.checkout + '.';

  var featuresLi = popupCard.querySelectorAll('.popup__features li');
  for (var j = 0; j < estateObjects[index].offer.features.length; j++) {
    featuresLi[j].textContent = estateObjects[index].offer.features;
  }

  popupCard.querySelector('.popup__description').textContent = estateObjects[index].offer.description;
  var estatePhotosDiv = popupCard.querySelector('.popup__photos');
  var estateOfferPictures = popupCard.querySelector('.popup__photos img');
  removeChildrens(estatePhotosDiv);
  for (var k = 0; k < estateObjects[index].offer.photos.length; k++) {
    var currentImgClone = estateOfferPictures.cloneNode(true);
    currentImgClone.src = estateObjects[index].offer.photos[k];
    estatePhotosDiv.appendChild(currentImgClone);
  }
  popupCard.querySelector('.popup__avatar').src = estateObjects[index].author.avatar;
  if (!showedCard === true) {
    showElement(popupCard);
  }
};

var removeChildrens = function (element) {
  element.innerHTML = '';
};

var activateForm = function () {
  if (!formStatus) {
    var formHeaderFildset = document.querySelector('.ad-form-header');
    setElementEnabled(formHeaderFildset);
    var elementsFieldset = document.querySelectorAll('.ad-form__element');
    elementsFieldset.forEach(function (element) {
      setElementEnabled(element);
    });
    if (firstInit) {
      pinsOnMap = document.querySelectorAll('.map__pin:not(.map__pin--main)');
      pinsOnMap.forEach(function (pin) {
        pin.addEventListener('click', function () {
          changeCardData(slicePinId(pin.getAttribute('name')));
          if (!showedCard === true) {
            showElement(popupCard);
            showedCard = true;
          }
          cross.addEventListener('click', closePopupCard);
        });
      });
      mainPinPoint.removeEventListener('mouseup', getMapObjects);
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

  }

  var hideMapPins = function () {
    pinsOnMap.forEach(function (pin) {
      pin.removeEventListener('click', function () {
        changeCardData(slicePinId(pin.getAttribute('name')));
        if (!showedCard === true) {
          showElement(popupCard);
          showedCard = true;
        }
        cross.addEventListener('click', closePopupCard);
      });
      hideElement(pin);
    });
    mainPinPoint.removeEventListener('mouseup', getMapObjects);
  };


  var setDefaultPage = function () {
    disableForm();
    hideMapPins();
    if (showedCard) {
      hideElement(popupCard);
      showedCard = false;
    }
    setTimeout(getAdressDefault(), 5000);
    mainPinPoint.addEventListener('mouseup', getMapObjects);
  };

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
  submitElement.addEventListener('click', submitData);
  resetElement.addEventListener('click', setDefaultPage);
  var formElement = document.querySelector('.ad-form');
  formElement.addEventListener('reset', getAdressDefault);
  // formElement.addEventListener('submit', submitData);

  formStatus = true;
  firstInit = false;

};

var deleteMsg = function (documentObj) {
  documentObj.remove();

};

var removeClickListner = function () {
  document.removeEventListener('click', function () {
    deleteMsg(sendMessage);
    removeClickListner();
  });
};

var setElementEnabled = function (element) {
  element.removeAttribute('disabled', 'disabled');
};

var setElementDisabled = function (element) {
  element.setAttribute('disabled', 'disabled');
};

var hideElement = function (element) {
  element.classList.add('hidden');
};

var showElement = function (element) {
  element.classList.remove('hidden');
};

var disableForm = function () {
  if (formStatus) {
    var formHeaderFildset = document.querySelector('.ad-form-header');
    setElementDisabled(formHeaderFildset);
    var elementsFieldset = document.querySelectorAll('.ad-form__element');
    elementsFieldset.forEach(function (element) {
      setElementDisabled(element);
    });
    formStatus = false;
  }
};

var getAdressDefault = function () {
  var mainPinPoint = document.querySelector('.map__pin--main');
  var sizeMainPin = {
    width: parseInt(getComputedStyle(mainPinPoint).width, 10),
    height: parseInt(getComputedStyle(mainPinPoint).height, 10)
  };
  var defaultX = parseInt(mainPinPoint.style.left, 10) + Math.round(sizeMainPin.width / 2);
  var defaultY = parseInt(mainPinPoint.style.top, 10) + Math.round(sizeMainPin.height / 2);
  document.querySelector('#address').value = [defaultX, defaultY];
};

var putLocationAddress = function (address) {
  address[0] += MinMaxXMapPin[0];
  address[1] += LOCATION_Y_MIN;
  document.querySelector('#address').value = address;
};

var getMapObjects = function (evt) {
  putLocationAddress([evt.clientX, evt.clientY]);
  if (firstInit) {
    addHiddenCard();
    cross = popupCard.querySelector('.popup__close');
    pushPinsToMap(estateObjects);
    // firstInit = false;
  } else {
    showPins();
  }
  activateForm();
};

var showPins = function () {
  pinsOnMap.forEach(function (pin) {
    showElement(pin);
  });
};

var closePopupCard = function () {
  hideElement(popupCard);
  cross.removeEventListener('click', closePopupCard);
  showedCard = false;
};

var addHiddenCard = function () {
  var fragmentCard = document.createDocumentFragment();
  var templateCard = document.querySelector('#card').content;
  fragmentCard.appendChild(templateCard);
  var insertPlaceCard = document.querySelector('.map');
  var beforeDOMItem = document.querySelector('.map__filters-container');
  insertPlaceCard.insertBefore(fragmentCard, beforeDOMItem);
  popupCard = document.querySelector('.map__card');
  hideElement(popupCard);
  showedCard = false;
};

var avatarsSequenceIndex = getArraySequence(AUTHORS_COUNT);
var avatarsRandomSequenceIndex = getArrayRandomSequence(avatarsSequenceIndex);
var estateTitlesIndex = getArrayRandomSequence(ESTATE_TITLES);
var MinMaxXMapPin = getMaxXPin();

var estateObjects = [];
for (var i = 0; i < NUMBER_ESTATE_OBJECTS; i++) {
  estateObjects.push(getRandomEstateObject(i));
}

var mainPinPoint = document.querySelector('.map__pin--main');

disableForm();
getAdressDefault();

mainPinPoint.addEventListener('mouseup', getMapObjects);
