'use strict';

(function () {
  var FEATURES_VARIANTS = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

  var showedCard = false;

  var estateObjects = window.init.serverEstateData;
  var templateCard = document.querySelector('#card').content;
  var templateCardImg;
  var popupCard;
  var cross;
  var featuresElements = [];

  var addHiddenCard = function () {
    var fragmentCard = document.createDocumentFragment();
    fragmentCard.appendChild(templateCard);
    var insertPlaceCard = document.querySelector('.map');
    insertPlaceCard.insertBefore(fragmentCard, insertPlaceCard.lastChild);
    popupCard = document.querySelector('.map__card');
    cross = popupCard.querySelector('.popup__close');
    cross.addEventListener('click', crossClickHandler);
    templateCardImg = popupCard.querySelector('.popup__photos img');
    window.util.hideElement(popupCard);
    showedCard = false;
    saveFeatures();
    var cardPhotos = document.querySelector('.popup__photos');
    window.photoViewer.setZoomPhotos(cardPhotos);
  };


  var saveFeatures = function () {
    var featuresLi = popupCard.querySelectorAll('.popup__features li');
    for (var i = 0; i < featuresLi.length; i++) {
      featuresLi[i].textContent = FEATURES_VARIANTS[i];
      featuresElements[i] = featuresLi[i];
    }
  };

  var crossClickHandler = function () {
    window.util.hideElement(popupCard);
    window.map.changeActivePin();
    showedCard = false;
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


  var putFeaturesToCard = function (i) {
    window.util.removeChildrens(popupCard.querySelector('.popup__features'));
    var constructFeatures = function (item) {
      featuresElements.forEach(function (itemLi) {
        if (itemLi.textContent === item) {
          popupCard.querySelector('.popup__features').appendChild(itemLi);
        }
      });
    };
    estateObjects[i].offer.features.forEach(constructFeatures);

  };

  var putPhotosToCard = function (index) {

    var estatePhotosDiv = popupCard.querySelector('.popup__photos');
    var photosFragment = document.createDocumentFragment();
    window.util.removeChildrens(estatePhotosDiv);

    var constructPhotos = function (item) {
      var currentImgClone = templateCardImg.cloneNode(true);
      currentImgClone.src = item;
      window.util.hideElement(currentImgClone);
      currentImgClone.addEventListener('load', function (evt) {
        window.util.showElement(evt.target);
      });
      photosFragment.appendChild(currentImgClone);
    };

    estateObjects[index].offer.photos.forEach(constructPhotos);
    estatePhotosDiv.appendChild(photosFragment); // а что если картинки не заргужены?? как не отображать?

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

    putFeaturesToCard(index);

    popupCard.querySelector('.popup__description').textContent = estateObjects[index].offer.description;

    putPhotosToCard(index);

    popupCard.querySelector('.popup__avatar').src = estateObjects[index].author.avatar;
  };

  window.card = {
    showedCard: showedCard,
    addHiddenCard: addHiddenCard,
    changeCardData: changeCardData,
  };
})();
