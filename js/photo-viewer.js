'use strict';

(function () {
  var zoomPhotoClickHandler = function () {
    document.querySelector('.full_screen_photo img').removeEventListener('click', zoomPhotoClickHandler);
    document.querySelector('.full_screen_photo').remove();
  };

  var showFullScreen = function (image) {
    var message = document.querySelector('#zoomcardphoto').content;
    var templateZoomPhoto = message.cloneNode(true);
    document.body.firstElementChild.appendChild(templateZoomPhoto);
    document.querySelector('.full_screen_photo img').src = image.src;
    document.querySelector('.full_screen_photo img').addEventListener('click', zoomPhotoClickHandler);
  };

  window.photoViewer = {
    showFullScreen: showFullScreen
  };
})();
