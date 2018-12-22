'use strict';

(function () {
  var debounceTime = 500;
  var lastTimeout;
  var MIDDLE_PRICE = 10000;
  var HIGH_PRICE = 50000;

  var incomingEstates = [];

  var selectorsCount = {
    'type': 'any',
    'price': 'any',
    'rooms': 'any',
    'guests': 'any',
  };

  var checkboxesChecked = [];

  var checkType = function (estate) {
    var key = 'type';
    if (selectorsCount[key] === 'any') {
      return true;
    }
    return estate.offer.type === selectorsCount[key];
  };

  var checkPrice = function (estate) {
    var key = 'price';
    if (selectorsCount[key] === 'any') {
      return true;
    } else {
      var dataPrice = estate.offer.price;
      switch (selectorsCount[key]) {
        case 'low':
          return dataPrice <= MIDDLE_PRICE;
        case 'middle':
          return dataPrice > MIDDLE_PRICE && dataPrice <= HIGH_PRICE;
        case 'high':
          return dataPrice > HIGH_PRICE;
      }
      return false;
    }

  };

  var checkRooms = function (estate) {
    var key = 'rooms';
    if (selectorsCount[key] === 'any') {
      return true;
    }
    return parseInt(estate.offer.rooms, 10) === parseInt(selectorsCount[key], 10);

  };

  var checkGuest = function (estate) {
    var key = 'guests';
    if (selectorsCount[key] === 'any') {
      return true;
    }
    return parseInt(estate.offer.guests, 10) === parseInt(selectorsCount[key], 10);

  };

  var checkFeatures = function (estate) {
    for (var i = 0; i < checkboxesChecked.length; i++) {

      var featuresCondition = estate.offer.features.some(function (item) {
        return item === checkboxesChecked[i];
      });
      return featuresCondition;
    }
    return true;
  };

  var isAppliedEstate = function (estate) {
    return checkType(estate) && checkPrice(estate) && checkRooms(estate) && checkGuest(estate) && checkFeatures(estate);
  };

  var applyFilter = function (estates) {
    var appliedEstates = estates.filter(isAppliedEstate);
    window.map.rewriteMapPins(appliedEstates);
  };

  var checkboxChangeHandler = function () {
    checkboxesChecked = [];
    var checkBoxes = document.querySelectorAll('.map__checkbox:checked');
    [].forEach.call(checkBoxes, function (checkBox) {
      checkboxesChecked.push(window.util.getSubString(checkBox.id, '-'));
    });
    debounceAplyFilter();
  };

  var debounceAplyFilter = function () {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(function () {
      applyFilter(incomingEstates);
    }, debounceTime);
  };

  var activateFilters = function (estates) {
    incomingEstates = estates;
    var filtersForm = document.querySelector('.map__filters');
    var elements = filtersForm.elements;


    var selectorChangeHandler = function (evt) {
      var filterName;
      var selectedIndex = evt.target.options.selectedIndex;
      filterName = window.util.getSubString(evt.target.id, '-');
      selectorsCount[filterName] = evt.target.options[selectedIndex].value;
      debounceAplyFilter();
    };


    for (var i = 0; i < elements.length; i++) {
      var elementType = elements[i].type.toLowerCase();
      if (elementType === 'select-one') {
        var selector = elements[i];
        selector.addEventListener('change', selectorChangeHandler);
      } else if (elementType === 'checkbox') {
        var checkBox = elements[i];
        checkBox.addEventListener('change', checkboxChangeHandler);
      }
    }
  };


  var resetFilters = function () {
    document.querySelector('.map__filters').reset();
    var checkBoxes = document.querySelectorAll('.map__checkbox:checked');
    [].forEach.call(checkBoxes, function (checkBox) {
      checkBox.removeEventListener('change', checkboxChangeHandler);
    });
  };

  window.filtersForm = {
    activateFilters: activateFilters,
    resetFilters: resetFilters
  };
})();

