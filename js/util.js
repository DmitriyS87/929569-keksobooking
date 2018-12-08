'use strict';

(function () {

  var hideElement = function (element) {
    element.classList.add('hidden');
  };

  var showElement = function (element) {
    element.classList.remove('hidden');
  };

  var removeChildrens = function (element) {
    element.innerHTML = '';
  };

  window.util = {
    hideElement: hideElement,
    showElement: showElement,
    removeChildrens: removeChildrens,
  };

})();

