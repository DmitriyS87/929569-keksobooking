'use strict';

(function () {
  var MIDDLE_PRICE = 10000;
  var HIGH_PRICE = 50000;
  var FILTERS_COUNT = 9;

  var TYPES_FILTERS_VALUE = ['palace', 'flat', 'house', 'bungalo'];
  var PRICE_FILTERS_VALUE = ['low', 'middle', 'high'];
  var ROOMS_FILTERS_VALUE = ['1', '2', '3'];
  var GUESTS_FILTERS_VALUE = ['0', '1', '2'];
  var FEATURES_FILTERS_VALUE = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var NUMEROUS_FILTERS_RESISTANCE = 1;

  var strongRatingCount = 0;
  var formFiltersCondition = [];

  var estatesRating = [];
  var estatesFiltresValues = [];
  var beginRatingConditions = [];

  var filtersConditions = [];
  var zeroConditions = [];

  var filtersCountsCosts = {
    'type': {
      same: 100,
      no: 0
    },
    'price': {
      same: 100,
      unclose: 0,
      close: 50
    },
    'rooms': {
      same: 60,
      unclose: 0,
      close: 40
    },
    'guests': {
      same: 60,
      close: 40,
      unclose: 0
    },
    'wifi': {
      same: 50,
      no: 0
    },
    'dishwasher': {
      same: 50,
      no: 0
    },
    'parking': {
      same: 50,
      no: 0
    },
    'washer': {
      same: 50,
      no: 0
    },
    'elevator': {
      same: 50,
      no: 0
    },
    'conditioner': {
      same: 50,
      no: 0
    },
  };

  var SELECT_ID = {
    'type': 0,
    'price': 1,
    'rooms': 2,
    'guests': 3,
    'wifi': 4,
    'dishwasher': 5,
    'parking': 6,
    'washer': 7,
    'elevator': 8,
    'conditioner': 9
  };

  var sortRating = function (ratingArray) {
    var copyRatingArray = ratingArray.slice(0);

    var sortEstateIndexes = function (a, b) {
      if (a[1] > b[1]) {
        return -1;
      }
      if (b[1] > a[1]) {
        return 1;
      }
      return 0;
    };

    return copyRatingArray.sort(sortEstateIndexes);
  };

  var cutRaitingCondition = function (ratingArray) {
    var cutArray = [];
    for (var i = 0; i < ratingArray.length; i++) {
      if (ratingArray[i][1] >= strongRatingCount) {
        cutArray.push(ratingArray[i]);
      } else {
        break;
      }
    }
    return cutArray;
  };

  var makeEmptyRatingArray = function (length) {
    var estatesFiltersCost = [];
    for (var i = 0; i < length; i++) {
      estatesFiltersCost.push([i, 0]);
    }
    return estatesFiltersCost;
  };

  var makeDefaultRatingArray = function (length) {
    var estatesFiltersCost = [];
    for (var i = 0; i < length; i++) {
      estatesFiltersCost.push([i, length - i - 1]);
    }
    return estatesFiltersCost;
  };

  var selectorsCount = {
    'type': 'any',
    'price': 'any',
    'rooms': 'any',
    'guests': 'any'
  };

  var checkboxCount = {
    'wifi': 'any',
    'dishwasher': 'any',
    'parking': 'any',
    'washer': 'any',
    'elevator': 'any',
    'conditioner': 'any'
  };

  var getTypeRating = function (dataValue) {
    var typeRatings = {};
    TYPES_FILTERS_VALUE.forEach(function (value) {
      if (value === dataValue) {
        typeRatings[value] = filtersCountsCosts['type'].same; // !!!!!!!!!!!!!!
      } else {
        typeRatings[value] = filtersCountsCosts['type'].no;
      }
    });
    return typeRatings;
  };

  var getPriceRating = function (dataPrice) {
    var priceRatings = {};
    var key = 'price';
    PRICE_FILTERS_VALUE.forEach(function (value) {
      switch (value) {
        case 'low': if (dataPrice <= MIDDLE_PRICE) {
          priceRatings[value] = filtersCountsCosts[key].same;
        } else if (dataPrice < HIGH_PRICE) {
          priceRatings[value] = filtersCountsCosts[key].close;
        } else {
          priceRatings[value] = filtersCountsCosts[key].unclose;
        }
          break;
        case 'middle':
          if (dataPrice > MIDDLE_PRICE && dataPrice <= HIGH_PRICE) {
            priceRatings[value] = filtersCountsCosts[key].same;
          } else if (dataPrice < MIDDLE_PRICE) {
            priceRatings[value] = filtersCountsCosts[key].close;
          } else {
            priceRatings[value] = filtersCountsCosts[key].unclose;
          }
          break;
        case 'high':
          if (dataPrice > HIGH_PRICE) {
            priceRatings[value] = filtersCountsCosts[key].same;
          } else if (dataPrice > MIDDLE_PRICE) {
            priceRatings[value] = filtersCountsCosts[key].close;
          } else {
            priceRatings[value] = filtersCountsCosts[key].unclose;
          }
          break;
        default:
          priceRatings[value] = 0;
      }
    });
    return priceRatings;

  };

  var getRoomsRating = function (dataRoomsCount) {
    var key = 'rooms';
    var roomsRatings = {};
    ROOMS_FILTERS_VALUE.forEach(function (value) {
      if (parseInt(dataRoomsCount, 10) === parseInt(value, 10)) {
        roomsRatings[value] = filtersCountsCosts[key].same;
      } else if (Math.abs(parseInt(value, 10) - parseInt(dataRoomsCount, 10)) < NUMEROUS_FILTERS_RESISTANCE) {
        roomsRatings[value] = filtersCountsCosts[key].close;
      } else {
        roomsRatings[value] = filtersCountsCosts[key].unclose;
      }
    });
    return roomsRatings;
  };

  var getGuestRating = function (dataGuests) {
    var guestRatings = [];
    GUESTS_FILTERS_VALUE.forEach(function (value) {
      if (parseInt(value, 10) === parseInt(dataGuests, 10)) {
        guestRatings[value] = filtersCountsCosts['guests'].same;
      } else if (Math.abs(parseInt(value, 10) - parseInt(dataGuests, 10)) < NUMEROUS_FILTERS_RESISTANCE) {
        guestRatings[value] = filtersCountsCosts['guests'].close;
      } else {
        guestRatings[value] = filtersCountsCosts['guests'].unclose;
      }
    });
    return guestRatings;
  };

  var getFeaturesRating = function (feature, isEstateFeature) {
    var featureRatings = {};
    if (isEstateFeature) {
      featureRatings[feature] = filtersCountsCosts[feature].same;
    } else {
      featureRatings[feature] = filtersCountsCosts[feature].no;
    }
    featureRatings['any'] = 0;
    return featureRatings;
  };

  var makeEmptyArray = function (length) {
    var emptyArray = [];
    for (var index = 0; index < length; index++) {
      emptyArray[index] = 0;
    }
    return emptyArray;
  };

  var addBeginingCondition = function (arrayCondition) {
    var tableConditions = window.util.getEmtyMatrixArray(arrayCondition.length, FILTERS_COUNT + 1);
    tableConditions.forEach(function (estate, id) {
      estate[FILTERS_COUNT] = arrayCondition[id][1];
    });
    return tableConditions;
  };

  var countRatings = function (objects) {
    var finalRatingTable = window.util.getEmtyMatrixArray(objects.length, FILTERS_COUNT);
    beginRatingConditions = makeDefaultRatingArray(objects.length);
    filtersConditions = addBeginingCondition(beginRatingConditions);
    zeroConditions = makeEmptyArray(objects.length); // перенести в util

    for (var i = 0; i < objects.length; i++) {
      var estateOffer = objects[i].offer;
      finalRatingTable[i][0] = getTypeRating(estateOffer.type);
      finalRatingTable[i][1] = getPriceRating(estateOffer.price);
      finalRatingTable[i][2] = getRoomsRating(estateOffer.rooms);
      finalRatingTable[i][3] = getGuestRating(estateOffer.guests);
      var estateFeatures = estateOffer.features;
      FEATURES_FILTERS_VALUE.forEach(function (value, index) {
        var checkFeature = function (feature) {
          if (feature === value) {
            return true;
          }
          return false;
        };
        finalRatingTable[i][4 + index] = getFeaturesRating(value, estateFeatures.some(checkFeature));
      });

    }
    return finalRatingTable;
  };

  var getCondition = function (selectValue, filterName, filterIndex) {
    if (selectValue !== 'any') {
      if (formFiltersCondition[filterIndex] === 0) {
        strongRatingCount = strongRatingCount + filtersCountsCosts[filterName].same;
        formFiltersCondition[filterIndex] = 1;
      }
      var currentCondition = estatesFiltresValues.map(function (estate) {
        return estate[filterIndex][selectValue];
      });
    } else {
      if (formFiltersCondition[filterIndex] === 1) {
        strongRatingCount = strongRatingCount - filtersCountsCosts[filterName].same;
      }
      formFiltersCondition[filterIndex] = 0;
      return zeroConditions;
    }
    return currentCondition;
  };

  var getRating = function (newCondition, id) {
    filtersConditions.forEach(function (estate, index) {
      estate[id] = newCondition[index];
      estatesRating[index][1] = estate.reduce(function (sum, item) {
        return sum + item;
      });
    });
    return estatesRating;
  };

  var activateFilters = function (estates) {
    estatesFiltresValues = countRatings(estates);
    formFiltersCondition = window.util.getEmtyArray(FILTERS_COUNT);

    var filtersForm = document.querySelector('.map__filters');
    var elements = filtersForm.elements;
    estatesRating = makeEmptyRatingArray(estates.length);

    var getEstateIndexes = function (arrayIndexCount) {
      var resultArray = [];
      for (var i = 0; i < arrayIndexCount.length; i++) {
        resultArray.push(arrayIndexCount[i][0]);
      }
      return resultArray;
    };


    var filterChangeHandler = function (evt) {
      var filterName;
      var selectValue;
      if (evt.target.type === 'select-one') {
        var selectedIndex = evt.target.options.selectedIndex;
        selectorsCount[evt.target.id] = evt.target.options[selectedIndex].value;
        filterName = window.util.getSubString(evt.target.id, '-');
        selectorsCount[filterName] = evt.target.options[selectedIndex].value; // ????????
        selectValue = selectorsCount[filterName];
      } else {
        if (evt.target.checked) {
          filterName = window.util.getSubString(evt.target.id, '-');
          checkboxCount[filterName] = evt.target.value; //
          selectValue = checkboxCount[filterName];
        } else {
          filterName = window.util.getSubString(evt.target.id, '-'); // DRY
          checkboxCount[filterName] = 'any';
          selectValue = checkboxCount[filterName];
        }
      }

      var raitingCondition = getRating(getCondition(selectValue, filterName, SELECT_ID[filterName]), SELECT_ID[filterName]);

      var sortedRaitingCondition = sortRating(raitingCondition);

      var cuttedRaitingCondition = cutRaitingCondition(sortedRaitingCondition);

      var resultRaitig = getEstateIndexes(cuttedRaitingCondition);

      window.map.refreshMapPins(resultRaitig);
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

