'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var makePreview = function (photoInput, previewImg) {
    var file = photoInput.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (typePhoto) {
      return fileName.endsWith(typePhoto);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        previewImg.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  };
  window.inputImage = {
    makePreview: makePreview
  };

})();
