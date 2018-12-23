'use strict';

(function () {

  var showedCard = false;

  var templateFeatures;
  var templateCardImg;
  var popupCard;
  var cross;
  var pin;

  var removeCard = function () {
    if (showedCard) {
      document.querySelector('.map__card').remove();
      document.removeEventListener('keydown', documentKeyPressHandler);
    }
  };

  var documentKeyPressHandler = function (evt) {
    if (evt.keyCode === window.util.ESC_CODE) {
      removeCard();
      window.map.changeActivePin(pin);
      showedCard = false;
      document.removeEventListener('keydown', documentKeyPressHandler);
    }
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

  var crossClickHandler = function () {
    removeCard();
    window.map.changeActivePin(pin);
    showedCard = false;
  };

  var putFeaturesToCard = function (estate, featuresNode) {
    var fragmentLU = document.createDocumentFragment();
    var separator = featuresNode.firstChild;
    estate.offer.features.forEach(function (featureName) {
      var feature = featuresNode.querySelector('.popup__feature--' + featureName);
      fragmentLU.appendChild(feature);
      fragmentLU.appendChild(separator.cloneNode(true));
    });
    window.util.removeChildren(document.querySelector('.popup__features'));
    document.querySelector('.popup__features').appendChild(fragmentLU);
  };

  var putPhotosToCard = function (estate) {

    var estatePhotosDiv = popupCard.querySelector('.popup__photos');
    var photosFragment = document.createDocumentFragment();
    window.util.removeChildren(estatePhotosDiv);

    var constructPhotos = function (item) {
      var currentImgClone = templateCardImg.cloneNode(true);
      currentImgClone.src = item;
      window.util.hideElement(currentImgClone);
      currentImgClone.addEventListener('load', function (evt) {
        window.util.showElement(evt.target);
      });
      photosFragment.appendChild(currentImgClone);
    };

    estate.offer.photos.forEach(constructPhotos);
    estatePhotosDiv.appendChild(photosFragment);

  };

  var createCard = function (estate, currentPin) {
    pin = currentPin;
    var templateCard = document.querySelector('#card');
    var elementsMapSection = document.querySelector('.map').children;
    var insertPlaceCard = elementsMapSection[elementsMapSection.length - 2];
    var fragmentCard = document.createDocumentFragment();
    fragmentCard.appendChild(templateCard.content.cloneNode(true));
    insertPlaceCard.appendChild(fragmentCard);

    popupCard = document.querySelector('.map__card');

    cross = popupCard.querySelector('.popup__close');


    cross.addEventListener('click', crossClickHandler);

    document.addEventListener('keydown', documentKeyPressHandler);

    templateCardImg = popupCard.querySelector('.popup__photos img');

    showedCard = true;

    templateFeatures = document.querySelector('.popup__features');

    var cardPhotos = document.querySelector('.popup__photos');

    var imageClickHandler = function (evt) {
      if (evt.target.tagName === 'IMG') {
        window.photoViewer.showFullScreen(evt.target);
      }
    };

    cardPhotos.addEventListener('click', imageClickHandler);

    popupCard.querySelector('.popup__title').textContent = estate.offer.title;
    popupCard.querySelector('.popup__text--address').textContent = estate.offer.address;
    popupCard.querySelector('.popup__text--price').textContent = estate.offer.price + '₽/ночь';
    popupCard.querySelector('.popup__type').textContent = getEstateTypeTranslate(estate);

    var roomsText = 'ы';
    if (estate.offer.rooms < 2) {
      roomsText = 'а';
    } else if (estate.offer.rooms > 4) {
      roomsText = '';
    }
    var guestsText = 'ей';
    if (estate.offer.guests < 2) {
      guestsText = 'я';
    }

    popupCard.querySelector('.popup__text--capacity').textContent = estate.offer.rooms + ' комнат' + roomsText + ' для ' + estate.offer.guests + ' гост' + guestsText + '.';
    popupCard.querySelector('.popup__text--time').textContent = 'Заезд после ' + estate.offer.checkin + ', выезд до ' + estate.offer.checkout + '.';

    putFeaturesToCard(estate, templateFeatures);

    popupCard.querySelector('.popup__description').textContent = estate.offer.description;

    putPhotosToCard(estate);

    popupCard.querySelector('.popup__avatar').src = estate.author.avatar;
  };

  window.card = {
    createCard: createCard,
    removeCard: removeCard
  };
})();
