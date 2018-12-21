'use strict';

(function () {
  var showedCard = false;

  var templateFeatures;
  var templateCardImg;
  var popupCard;
  var cross;

  var removeCard = function () {
    if (showedCard) {
      document.querySelector('.map__card').remove();
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


  var putFeaturesToCard = function (estate, featuresNode) {
    var fragmentLU = document.createDocumentFragment();
    var cloneFeature = featuresNode.cloneNode(true);
    var nodeFeatures = cloneFeature.childNodes;
    for (var i = 1; i < nodeFeatures.length; i++) {
      if (nodeFeatures[i].tagName === 'LI') {
        var feature = (window.util.getSubString(nodeFeatures[i].getAttribute('class'), '-').slice(1));
        if (estate.offer.features.some(function (item) {
          return feature === item;
        })) {
          fragmentLU.appendChild(nodeFeatures[i].cloneNode(true));
          fragmentLU.appendChild(nodeFeatures[i - 1].cloneNode(true));
        }
      }
    }
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

  var createCard = function (estate, pin) {

    var crossClickHandler = function () {
      removeCard();
      window.map.changeActivePin(pin);
      showedCard = false;
    };

    var templateCard = document.querySelector('#card');
    var elementsMapSection = document.querySelector('.map').children;
    var insertPlaceCard = elementsMapSection[elementsMapSection.length - 2];
    var fragmentCard = document.createDocumentFragment();
    fragmentCard.appendChild(templateCard.content.cloneNode(true));
    insertPlaceCard.appendChild(fragmentCard);

    popupCard = document.querySelector('.map__card');

    cross = popupCard.querySelector('.popup__close');
    cross.addEventListener('click', crossClickHandler);

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
