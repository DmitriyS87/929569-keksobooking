'use strict';

(function () {
  var MIDDLE_PRICE = 10000;
  var HIGH_PRICE = 50000;

  var appliedEstates = [];

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
    } else {
      if (estate.offer.type === selectorsCount[key]) {
        return true;
      }
      return false;
    }
  };

  var checkPrice = function (estate) {
    var key = 'price';
    if (selectorsCount[key] === 'any') {
      return true;
    } else {
      var dataPrice = estate.offer.price;
      switch (selectorsCount[key]) {
        case 'low': if (dataPrice <= MIDDLE_PRICE) {
          return true;
        }
          return false;
        case 'middle':
          if (dataPrice > MIDDLE_PRICE && dataPrice <= HIGH_PRICE) {
            return true;
          }
          return false;
        case 'high':
          if (dataPrice > HIGH_PRICE) {
            return true;
          }
          return false;
      }
      return false;
    }

  };

  var checkRooms = function (estate) {
    var key = 'rooms';
    if (selectorsCount[key] === 'any') {
      return true;
    } else {
      if (parseInt(estate.offer.rooms, 10) === parseInt(selectorsCount[key], 10)) {
        return true;
      }
      return false;
    }
  };

  var checkGuest = function (estate) {
    var key = 'guests';
    if (selectorsCount[key] === 'any') {
      return true;
    } else {
      if (parseInt(estate.offer.guests, 10) === parseInt(selectorsCount[key], 10)) {
        return true;
      }
      return false;
    }
  };

  var checkFeatures = function (estate) {
    if (checkboxesChecked.length > 0) {
      for (var i = 0; i < checkboxesChecked.length; i++) {

        var featuresCondition = estate.offer.features.some(function (item) {
          if (item === checkboxesChecked[i]) {
            return true;
          }
          return false;
        });
        if (!featuresCondition) {
          return false;
        }
      }
    }
    return true;
  };

  var isAppliedEstate = function (estate) {
    if (checkType(estate) && checkPrice(estate) && checkRooms(estate) && checkGuest(estate) && checkFeatures(estate)) {
      return true;
    }
    return false;
  };

  var applyFilter = function (estates) {
    appliedEstates = estates.filter(isAppliedEstate);
    window.map.rewriteMapPins(appliedEstates);
  };

  var activateFilters = function (estates) {
    appliedEstates = estates;

    var filtersForm = document.querySelector('.map__filters');
    var elements = filtersForm.elements;

    var filterChangeHandler = function (evt) {
      var filterName;
      if (evt.target.type === 'select-one') {
        var selectedIndex = evt.target.options.selectedIndex;
        filterName = window.util.getSubString(evt.target.id, '-');
        selectorsCount[filterName] = evt.target.options[selectedIndex].value;
        applyFilter(estates);
      } else {
        if (evt.target.checked) {
          filterName = window.util.getSubString(evt.target.id, '-');
          checkboxesChecked.push(filterName);
          applyFilter(estates);
        } else {
          filterName = window.util.getSubString(evt.target.id, '-'); // DRY
          var featureID = checkboxesChecked.indexOf(filterName);
          checkboxesChecked.splice(featureID, 1);
          applyFilter(estates);
        }
      }
    };

    for (var i = 0; i < elements.length; i++) {
      var elementType = elements[i].type.toLowerCase();
      if (elementType === 'select-one' || elementType === 'checkbox') {
        var filter = elements[i];
        filter.addEventListener('change', filterChangeHandler);
      }
    }
  };

  window.filtersForm = {
    activateFilters: activateFilters,
  };
})();

