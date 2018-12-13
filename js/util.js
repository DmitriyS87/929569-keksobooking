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


  var getArrayRandomSequence = function (massive) {
    var sequence = [];
    var randomIndex;
    var auxiliarySequence = getArraySequence(massive.length);
    for (var j = 0; j < massive.length; j++) {
      randomIndex = getRandomMinMax(0, massive.length - 1 - j);
      sequence.push(auxiliarySequence[randomIndex]);
      auxiliarySequence.splice(randomIndex, 1);
    }
    return sequence;

  };


  var getLocationXOrY = function (min, max) {
    return getRandomMinMax(min, max);
  };


  var getRandomMinMax = function (min, max) {
    var randomCount = Math.round(min + Math.random() * (max - min));
    return randomCount;
  };


  var chooseRandomArrayItem = function (array) {
    return array[getRandomMinMax(0, array.length - 1)];
  };


  var getArraySequence = function (max) {
    var sequence = [];
    for (var index = 0; index < max; index++) {
      sequence[index] = index;
    }
    return sequence;
  };


  var cropArray = function (massive, endIndex) {
    var outputMassive = [];
    for (var i = 0; i < endIndex; i++) {
      outputMassive.push(massive[i]);
    }
    return outputMassive;
  };


  window.util = {
    hideElement: hideElement,
    showElement: showElement,
    removeChildrens: removeChildrens,
    getLocationXOrY: getLocationXOrY,
    getRandomMinMax: getRandomMinMax,
    chooseRandomArrayItem: chooseRandomArrayItem,
    getArraySequence: getArraySequence,
    cropArray: cropArray,
    getArrayRandomSequence: getArrayRandomSequence
  };

})();

