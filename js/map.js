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
var DEFAULT_CARD_INDEX = 0;
var ESTATE_TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var ESTATE_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var CHECK_IN_OUT_VARIANTS = ['12:00', '13:00', '14:00'];
var FEATURES_VARIANTS = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

var EstatePhotos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var getArraySequence = function (max) {
  var sequence = [];
  for (var index = 0; index < max; index++) {
    sequence[index] = index;
  }
  return sequence;
};

var getArrayRandomSequence = function (massive) {
  var sequence = getArraySequence(massive.length);
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

var getRandomEstateObject = function (numberEstateOblect) {
  var locationX = getLocationXOrY(mapMinX, mapMaxX);
  var locationY = getLocationXOrY(LOCATION_Y_MIN, LOCATION_Y_MAX);
  var countRooms = getRandomMinMax(MIN_ROOMS_COUNT, MAX_ROOMS_COUNT);

  var makedEstateOgj = {
    author: {
      avatar: AVATARS_PATH + (avatarsRandomSequenceIndex[numberEstateOblect] + 1) + '.png'},
    offer: {
      title: ESTATE_TITLES[estateTitlesIndex[numberEstateOblect]],
      address: [locationX, locationY],
      price: getRandomMinMax(MIN_PRICE_UNIT, MAX_PRICE_UNIT),
      type: ESTATE_TYPES[getRandomMinMax(0, ESTATE_TYPES.length - 1)],
      rooms: countRooms,
      guests: getRandomMinMax(1, (countRooms * MAX_GUESTS_IN_ROOMS)),
      checkin: CHECK_IN_OUT_VARIANTS[getRandomMinMax(0, CHECK_IN_OUT_VARIANTS.length - 1)],
      checkout: CHECK_IN_OUT_VARIANTS[getRandomMinMax(0, CHECK_IN_OUT_VARIANTS.length - 1)],
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

var getNewPin = function (estateObject) {
  // var templatePin = document.querySelector('#pin').content;
  var newMapPin = templatePin.cloneNode(true);
  var firstTag = newMapPin.querySelector('.map__pin');
  var secondTag = newMapPin.querySelector('img');
  firstTag.style = 'left: ' + estateObject.location.x + 'px; top: ' + estateObject.location.y + 'px;';

  secondTag.src = estateObject.author.avatar;
  secondTag.alt = estateObject.offer.title;
  return newMapPin;
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

var pushCardData = function (currentObject) {
  var newCard = templateCard.cloneNode(true);

  newCard.querySelector('.popup__title').textContent = currentObject.offer.title;
  newCard.querySelector('.popup__text--address').textContent = currentObject.offer.address;
  newCard.querySelector('.popup__text--price').textContent = currentObject.offer.price + '₽/ночь';
  newCard.querySelector('.popup__type').textContent = getEstateTypeTranslate(currentObject);

  var roomsText = 'ы';
  if (currentObject.offer.rooms < 2) {
    roomsText = 'а';
  } else if (currentObject.offer.rooms > 4) {
    roomsText = '';
  }
  var guestsText = 'ей';
  if (currentObject.offer.guests < 2) {
    guestsText = 'я';
  }

  newCard.querySelector('.popup__text--capacity').textContent = currentObject.offer.rooms + ' комнат' + roomsText + ' для ' + currentObject.offer.guests + ' гост' + guestsText + '.';
  newCard.querySelector('.popup__text--time').textContent = 'Заезд после ' + currentObject.offer.checkin + ', выезд до ' + currentObject.offer.checkout + '.';

  var featuresLi = newCard.querySelectorAll('.popup__features li');
  for (var j = 0; j < currentObject.offer.features.length; j++) {
    featuresLi[j].textContent = currentObject.offer.features;
  }

  newCard.querySelector('.popup__description').textContent = currentObject.offer.description;
  var estatePhotosDiv = newCard.querySelector('.popup__photos');
  var estateOfferPictures = newCard.querySelector('.popup__photos img');
  estateOfferPictures.src = currentObject.offer.photos[0];
  for (var index = 1; index < currentObject.offer.photos.length; index++) {
    var currentImgClone = estateOfferPictures.cloneNode(true);
    currentImgClone.src = currentObject.offer.photos[index];
    estatePhotosDiv.appendChild(currentImgClone);
  }
  newCard.querySelector('.popup__avatar').src = currentObject.author.avatar;
  return newCard;
};

var avatarsSequenceIndex = getArraySequence(AUTHORS_COUNT);
var avatarsRandomSequenceIndex = getArrayRandomSequence(avatarsSequenceIndex);
var estateTitlesIndex = getArrayRandomSequence(ESTATE_TITLES);

var estateObjects = [];

var fragmentPin = document.createDocumentFragment();
var insertPlacePin = document.querySelector('.map__pins');
var templatePin = document.querySelector('#pin').content;
var pinTemplateWidth = getComputedStyle(templatePin.querySelector('.map__pin')).width;
var mapMaxX = insertPlacePin.clientWidth - parseInt(pinTemplateWidth, 10);
var mapMinX = 0 + parseInt(pinTemplateWidth, 10);

for (var i = 0; i < NUMBER_ESTATE_OBJECTS; i++) {
  estateObjects.push(getRandomEstateObject(i));
  fragmentPin.appendChild(getNewPin(estateObjects[i]));
}
insertPlacePin.appendChild(fragmentPin);

var fragmentCard = document.createDocumentFragment();
var templateCard = document.querySelector('#card').content;

fragmentCard.appendChild(pushCardData(estateObjects[DEFAULT_CARD_INDEX]));
var insertPlaceCard = document.querySelector('.map');
var beforeDOMItem = document.querySelector('.map__filters-container');
insertPlaceCard.insertBefore(fragmentCard, beforeDOMItem);

var hiddenObj = document.querySelector('.map');
hiddenObj.classList.remove('map--faded');


