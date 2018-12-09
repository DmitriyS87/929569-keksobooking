'use strict';

(function () {


  var showedCard = false;

  var estateObjects = window.estateData.estateObjects;
  var templateCard = document.querySelector('#card').content;

  var popupCard;
  var cross;

  var addHiddenCard = function () {
    var fragmentCard = document.createDocumentFragment();
    fragmentCard.appendChild(templateCard);
    var insertPlaceCard = document.querySelector('.map');
    insertPlaceCard.insertBefore(fragmentCard, insertPlaceCard.lastChild);
    popupCard = document.querySelector('.map__card');
    cross = popupCard.querySelector('.popup__close');
    cross.addEventListener('click', crossClickHandler);
    window.util.hideElement(popupCard);
    showedCard = false;
  };

  var crossClickHandler = function () {
    window.util.hideElement(popupCard);
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
    var featuresLi = popupCard.querySelectorAll('.popup__features li');
    for (var j = 0; j < estateObjects[i].offer.features.length; j++) {
      featuresLi[j].textContent = estateObjects[i].offer.features;
    }
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
    var estatePhotosDiv = popupCard.querySelector('.popup__photos');
    var estateOfferPictures = popupCard.querySelector('.popup__photos img');
    window.util.removeChildrens(estatePhotosDiv);

    for (var k = 0; k < estateObjects[index].offer.photos.length; k++) {
      var currentImgClone = estateOfferPictures.cloneNode(true);
      currentImgClone.src = estateObjects[index].offer.photos[k];
      estatePhotosDiv.appendChild(currentImgClone);
    }
    popupCard.querySelector('.popup__avatar').src = estateObjects[index].author.avatar;
  };

  window.card = {
    showedCard: showedCard,
    addHiddenCard: addHiddenCard,
    changeCardData: changeCardData,
  };
})();
