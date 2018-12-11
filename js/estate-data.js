'use strict';

(function () {

  // создаем массив объектов недвижимости - "база данных" объектов
  // результат работы модуля - массив объектов недвижимости в неком состоянии


  var LOCATION_Y_MIN = 130;
  var LOCATION_Y_MAX = 630;
  var LOCATION_X_MIN = 0;
  var PIN_WIDTH = 50;


  var AVATARS_PATH = 'img/avatars/user0';
  var AUTHORS_COUNT = 8;
  var MIN_PRICE_UNIT = 1000;
  var MAX_PRICE_UNIT = 1000000;
  var MIN_ROOMS_COUNT = 1;
  var MAX_ROOMS_COUNT = 5;
  var MAX_GUESTS_IN_ROOMS = 3;
  var NUMBER_ESTATE_OBJECTS = 8;
  var ESTATE_TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  var ESTATE_TYPES = ['palace', 'flat', 'house', 'bungalo'];
  var CHECK_IN_OUT_VARIANTS = ['12:00', '13:00', '14:00'];
  var FEATURES_VARIANTS = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var ESTATE_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

  // функции, создающие случайные данные


  var getPinMaxX = function () {
    var insertPlacePin = document.querySelector('.map__pins');
    var mapMaxX = parseInt(insertPlacePin.clientWidth, 10) - PIN_WIDTH;
    return mapMaxX;
  };

  var getArrayPhotos = function (massivePhotos) {
    var randomSequence = window.util.getArrayRandomSequence(massivePhotos);
    var photosString = [];
    for (var j = 0; j < massivePhotos.length; j++) {
      photosString.push(ESTATE_PHOTOS[randomSequence[j]]);
    }
    return photosString;

  };


  var avatarsSequenceIndex = window.util.getArraySequence(AUTHORS_COUNT);
  var avatarsRandomSequenceIndex = window.util.getArrayRandomSequence(avatarsSequenceIndex);
  var estateTitlesIndex = window.util.getArrayRandomSequence(ESTATE_TITLES);
  var mapPinMaxX = getPinMaxX();


  var makeRandomEstateObject = function (numberEstateOblect) {
    var locationX = window.util.getLocationXOrY(LOCATION_X_MIN, mapPinMaxX);
    var locationY = window.util.getLocationXOrY(LOCATION_Y_MIN, LOCATION_Y_MAX);
    var countRooms = window.util.getRandomMinMax(MIN_ROOMS_COUNT, MAX_ROOMS_COUNT);

    var makedEstateOgj = {
      author: {
        avatar: AVATARS_PATH + (avatarsRandomSequenceIndex[numberEstateOblect] + 1) + '.png'},
      offer: {
        title: ESTATE_TITLES[estateTitlesIndex[numberEstateOblect]],
        address: [locationX, locationY],
        price: window.util.getRandomMinMax(MIN_PRICE_UNIT, MAX_PRICE_UNIT),
        type: window.util.chooseRandomArrayItem(ESTATE_TYPES),
        rooms: countRooms,
        guests: window.util.getRandomMinMax(1, (countRooms * MAX_GUESTS_IN_ROOMS)),
        checkin: window.util.chooseRandomArrayItem(CHECK_IN_OUT_VARIANTS),
        checkout: window.util.chooseRandomArrayItem(CHECK_IN_OUT_VARIANTS),
        features: window.util.cropArray(FEATURES_VARIANTS, window.util.getRandomMinMax(0, FEATURES_VARIANTS.length)),
        description: '',
        photos: getArrayPhotos(ESTATE_PHOTOS)
      },

      location: {
        x: locationX,
        y: locationY
      }

    };

    return makedEstateOgj;
  };


  var estateObjects = [];
  for (var i = 0; i < NUMBER_ESTATE_OBJECTS; i++) {
    estateObjects.push(makeRandomEstateObject(i));
  }

  window.estateData = {
    estateObjects: estateObjects,
    FEATURES_VARIANTS: FEATURES_VARIANTS
  };

})();
