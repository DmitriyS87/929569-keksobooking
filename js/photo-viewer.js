'use strict';

(function () {
  var zoomPhotoClickHandler = function () {
    document.querySelector('.card_photo img').removeEventListener('click', zoomPhotoClickHandler);
    document.querySelector('.card_photo').remove();
  };

  var imgClickHandler = function (evt) {
    if (evt.target.tagName === 'IMG') {
      var message = document.querySelector('#zoomcardphoto').content;
      var templateZoomPhoto = message.cloneNode(true);
      document.body.firstElementChild.appendChild(templateZoomPhoto);
      document.querySelector('.card_photo img').src = evt.target.src;
      document.querySelector('.card_photo img').addEventListener('click', zoomPhotoClickHandler);
    }
  };

  var setZoomPhotos = function (photosContainer) {
    photosContainer.addEventListener('click', imgClickHandler);
  };

  window.photoViewer = {
    setZoomPhotos: setZoomPhotos
  };
})();
