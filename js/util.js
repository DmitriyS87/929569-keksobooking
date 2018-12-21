'use strict';

(function () {

  var ESC_CODE = 27;

  var getSubString = function (str, devider) {
    return str.substring(str.indexOf(devider)).slice(1);
  };

  var hideElement = function (element) {
    element.classList.add('hidden');
  };

  var showElement = function (element) {
    element.classList.remove('hidden');
  };

  var removeChildren = function (element) {
    element.innerHTML = '';
  };


  window.util = {
    hideElement: hideElement,
    showElement: showElement,
    removeChildren: removeChildren,
    getSubString: getSubString,
    ESC_CODE: ESC_CODE
  };

})();

