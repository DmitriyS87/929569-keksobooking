'use strict';

(function () {

  var cardExport = {};

  var showedCard = false;

  cardExport.showedCard = showedCard;

  var estateObjects = window.estateData.estateObjects;

  // var popupCard = document.querySelector('.map__card');
  // var cross = popupCard.querySelector('.popup__close');
  var popupCard;
  var cross;

  cardExport.crossRemoveListner = function () {
    cross.removeEventListener('click', crossClickHandler);
  };

  cardExport.crossAddListner = function () {
    cross.addEventListener('click', crossClickHandler);
  };

  var crossClickHandler = function () { // где живет? где используется?
    window.util.hideElement(popupCard);
    cross.removeEventListener('click', crossClickHandler);
    window.card.showedCard = false;
  };

  cardExport.addHiddenCard = function () { // функция нужна при инициализации страницы... тут не используется
    var fragmentCard = document.createDocumentFragment();
    var templateCard = document.querySelector('#card').content;
    fragmentCard.appendChild(templateCard);
    var insertPlaceCard = document.querySelector('.map');
    var beforeDOMItem = document.querySelector('.map__filters-container');
    insertPlaceCard.insertBefore(fragmentCard, beforeDOMItem);
    popupCard = document.querySelector('.map__card');
    cross = popupCard.querySelector('.popup__close');
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


  cardExport.changeCardData = function (index) { // функция не используется... что делать?

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
    window.util.removeChildrens(estatePhotosDiv);
    for (var k = 0; k < estateObjects[index].offer.photos.length; k++) {
      var currentImgClone = estateOfferPictures.cloneNode(true);
      currentImgClone.src = estateObjects[index].offer.photos[k];
      estatePhotosDiv.appendChild(currentImgClone);
    }
    popupCard.querySelector('.popup__avatar').src = estateObjects[index].author.avatar;
    if (!cardExport.showedCard === true) {
      window.util.showElement(popupCard);
    }
  };

  cardExport.cross = cross;
  cardExport.popupCard = popupCard;


  window.card = cardExport;

})();
