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
var MAP_MIN_X = 0;
var MAP_MAX_X = 1200;
var NUMBER_ESTATE_OBJECTS = 8;

var EstateTitles = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var EstateTypes = ['palace', 'flat', 'house', 'bungalo'];
var CheckInVariants = ['12:00', '13:00', '14:00'];
var CheckOutVariants = ['12:00', '13:00', '14:00'];
var FeaturesVariants = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var EstatePhotos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var getMassiveSequence = function (max) {
  var sequence = [];
  for (var index = 0; index < max; index++) {
    sequence[index] = index;
  }
  return sequence;
};

var getMassiveRandomSequence = function (massive) {
  var sequence = getMassiveSequence(massive.length);
  var randomIndex;
  var auxiliarySequence = getMassiveSequence(massive.length);
  for (var j = 0; j < massive.length; j++) {
    randomIndex = getRandomMinMax(0, massive.length - 1 - j);
    sequence[j] = auxiliarySequence[randomIndex];
    auxiliarySequence.splice(randomIndex, 1);
  }
  return sequence;

};

var getMassivePhotos = function (massivePhotos) {
  var randomSequence = getMassiveRandomSequence(massivePhotos);
  var photosString = [];
  for (var j = 0; j < massivePhotos.length; j++) {
    photosString[j] = EstatePhotos[randomSequence[j]];
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

var getOneStringFromMassive = function (massive, endItem) {
  var outputMassive = [];
  for (var i = 0; i < endItem; i++) {
    outputMassive[i] = massive[i];
  }
  return outputMassive;
};

var getRandomEstateObject = function (numberEstateOblect) {
  var locationX = getLocationXOrY(MAP_MIN_X, MAP_MAX_X);
  var locationY = getLocationXOrY(LOCATION_Y_MIN, LOCATION_Y_MAX);
  var countRooms = getRandomMinMax(MIN_ROOMS_COUNT, MAX_ROOMS_COUNT);

  var makedEstateOgj = {
    author: {
      avatar: AVATARS_PATH + (avatarsRandomSequenceIndex[numberEstateOblect] + 1) + '.png'},
    offer: {
      title: EstateTitles[estateTitlesIndex[numberEstateOblect]],
      address: [locationX, locationY],
      price: getRandomMinMax(MIN_PRICE_UNIT, MAX_PRICE_UNIT),
      type: EstateTypes[getRandomMinMax(0, EstateTypes.length - 1)],
      rooms: countRooms,
      guests: getRandomMinMax(1, (countRooms * MAX_GUESTS_IN_ROOMS)),
      checkin: CheckInVariants[getRandomMinMax(0, CheckInVariants.length - 1)],
      checkout: CheckOutVariants[getRandomMinMax(0, CheckOutVariants.length - 1)],
      features: getOneStringFromMassive(FeaturesVariants, getRandomMinMax(0, FeaturesVariants.length)),
      description: '',
      photos: getMassivePhotos(EstatePhotos)
    },

    location: {
      x: locationX,
      y: locationY
    }

  };

  return makedEstateOgj;
};

var avatarsSequenceIndex = getMassiveSequence(AUTHORS_COUNT);
var avatarsRandomSequenceIndex = getMassiveRandomSequence(avatarsSequenceIndex);
var estateTitlesIndex = getMassiveRandomSequence(EstateTitles);
var estateObjects = [];

var fragment = document.createDocumentFragment();
var templatePin = document.querySelector('#pin').content;
for (var i = 0; i < NUMBER_ESTATE_OBJECTS; i++) {
  estateObjects[i] = getRandomEstateObject(i);
  var newMapPin = templatePin.cloneNode(true);
  var firstTag = newMapPin.querySelector('.map__pin');
  firstTag.style = 'left: ' + estateObjects[i].location.x + 'px; top: ' + estateObjects[i].location.y + 'px;';
  var secondTag = newMapPin.querySelector('img');
  secondTag.src = estateObjects[i].author.avatar;
  secondTag.alt = estateObjects[i].offer.title;
  fragment.appendChild(newMapPin);
}
var insertPlace = document.querySelector('.map__pins');
insertPlace.appendChild(fragment);

var fragmentCard = document.createDocumentFragment();
var templateCard = document.querySelector('#card').content;
var firstIndex = 0;

var newCard = templateCard.cloneNode(true);
var popupTitle = newCard.querySelector('.popup__title');
popupTitle.textContent = estateObjects[firstIndex].offer.title;
newCard.querySelector('.popup__text--address').textContent = estateObjects[firstIndex].offer.address;
newCard.querySelector('.popup__text--price').textContent = estateObjects[firstIndex].offer.price + '₽/ночь';

var estateTypeTranslate = '';
switch (estateObjects[firstIndex].offer.type) {
  case 'flat':
    estateTypeTranslate = 'Квартира';
    break;
  case 'bungalo':
    estateTypeTranslate = 'Бунгало';
    break;
  case 'house':
    estateTypeTranslate = 'Дом';
    break;
  case 'palace':
    estateTypeTranslate = 'Дворец';
    break;
  default:
    estateTypeTranslate = 'Шалаш';

}
newCard.querySelector('.popup__type').textContent = estateTypeTranslate;
var roomsText = 'ы';
if (estateObjects[firstIndex].offer.rooms < 2) {
  roomsText = 'а';
} else if (estateObjects[firstIndex].offer.rooms > 4) {
  roomsText = '';
}
var guestsText = 'ей';
if (estateObjects[firstIndex].offer.guests < 2) {
  guestsText = 'я';
}

newCard.querySelector('.popup__text--capacity').textContent = estateObjects[firstIndex].offer.rooms + ' комнат' + roomsText + ' для ' + estateObjects[firstIndex].offer.guests + ' гост' + guestsText + '.';
newCard.querySelector('.popup__text--time').textContent = 'Заезд после ' + estateObjects[firstIndex].offer.checkin + ', выезд до ' + estateObjects[firstIndex].offer.checkout + '.';
var featuresLi = newCard.querySelectorAll('.popup__features li');

for (var j = 0; j < estateObjects[firstIndex].offer.features.length; j++) {
  featuresLi[j].textContent = estateObjects[firstIndex].offer.features;

}
newCard.querySelector('.popup__description').textContent = estateObjects[firstIndex].offer.description;
var estatePhotosDiv = newCard.querySelector('.popup__photos');
var estateOfferPictures = newCard.querySelector('.popup__photos img');
estateOfferPictures.src = estateObjects[firstIndex].offer.photos[0];
for (var index = 1; index < estateObjects[firstIndex].offer.photos.length; index++) {
  var currentImgClone = estateOfferPictures.cloneNode(true);
  currentImgClone.src = estateObjects[firstIndex].offer.photos[index];
  estatePhotosDiv.appendChild(currentImgClone);
}
newCard.querySelector('.popup__avatar').src = estateObjects[firstIndex].author.avatar;
fragmentCard.appendChild(newCard);
var insertPlaceCard = document.querySelector('.map');
var beforeDOMItem = document.querySelector('.map__filters-container');
insertPlaceCard.insertBefore(fragmentCard, beforeDOMItem);

var hiddenObj = document.querySelector('.map');
hiddenObj.classList.remove('map--faded');


