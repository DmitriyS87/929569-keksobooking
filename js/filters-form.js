'use strict';

(function () {
  var checkRefreshMap = [];
  var MIDDLE_PRICE = 10000;
  var HIGH_PRICE = 50000;

  var filtersCount = {
    'type': {
      same: 10,
      no: 0},
    'price': {
      same: 10,
      unclose: 0,
      close: 5},
    'rooms': {
      same: 5,
      less: 1,
      more: 3},
    'guests': {
      same: 5,
      more: 3,
      less: 2,
      noone: 0},
    'wifi': 0.3,
    'dishwasher': 0.3,
    'parking': 0.3,
    'washer': 0.3,
    'elevator': 0.3,
    'conditioner': 0.3,
  };

  var countDifferenceCost = {
    'type': function (key, estateKey, filterKey) {
      if (estateKey === filterKey) {
        return filtersCount[key].same;
      }
      return filtersCount[key].no;
    },
    'price': function (key, estateCount, filterKey) {
      switch (filterKey) {
        case 'low': if (estateCount <= MIDDLE_PRICE) {
          return filtersCount[key].same;
        } else if (estateCount < HIGH_PRICE) {
          return filtersCount[key].close;
        }
          return filtersCount[key].unclose;
        case 'middle':
          if (estateCount > MIDDLE_PRICE && estateCount <= HIGH_PRICE) {
            return filtersCount[key].same;
          } else if (estateCount < MIDDLE_PRICE) {
            return filtersCount[key].close;
          }
          return filtersCount[key].unclose;
        case 'high':
          if (estateCount > HIGH_PRICE) {
            return filtersCount[key].same;
          } else if (estateCount > MIDDLE_PRICE) {
            return filtersCount[key].close;
          }
          return filtersCount[key].unclose;
        default:
          return 0;
      }
    },
    'rooms': function (key, estateCount, filterKey) {
      switch (filterKey) {
        case 1: if (parseInt(estateCount, 10) === parseInt(filterKey, 10)) {
          return filtersCount[key].same;
        } else if (parseInt(estateCount, 10) > parseInt(filterKey, 10)) {
          return filtersCount[key].more;
        }
          return filtersCount[key].less;
        case 2:
          if (parseInt(estateCount, 10) === parseInt(filterKey, 10)) {
            return filtersCount[key].same;
          } else if (parseInt(estateCount, 10) > parseInt(filterKey, 10)) {
            return filtersCount[key].more;
          }
          return filtersCount[key].less;
        case 3:
          if (parseInt(estateCount, 10) === parseInt(filterKey, 10)) {
            return filtersCount[key].same;
          } else if (parseInt(estateCount, 10) > (parseInt(filterKey, 10) - 2)) {
            return filtersCount[key].more;
          }
          return filtersCount[key].less;
        default:
          // console.log('default!!');
          return 0;
      }
    },
    // 'guests': function (key, estateKey, filterKey) {

    // },
  };

  var doFilterEstate = function (estates, filter) {
    // console.log(estates);
    // console.log(filter);
    var whatToReturn = window.util.getArraySequence(5);
    // console.log(whatToReturn);
    var estatesFiltersCost = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    if (filter) {
      try {
        for (var key in filter) {
          if (filter instanceof Object) {
            estates.forEach(function (estate, index) {
              // console.log(j + '  ' + index + '   ' + key + '  ' + filter[key] + '   ' + estate.offer[key] + '   ' + countDifferenceCost[key](estate.offer[key], key));
              estatesFiltersCost[index] += countDifferenceCost[key](key, estate.offer[key], filter[key]);
            });
          }
        }
      } catch (err) {
        // console.log('tryCatch  ' + err);
      }
      // console.log(estatesFiltersCost);
    }
    // console.log('here!' + estatesFiltersCost);
    return whatToReturn;
  };

  var takefilters = function () {
    var selectedFiltres = {};

    for (var key in filtresCount) {
      if (filtresCount[key] !== 'any') {
        selectedFiltres[filtresToProperties[key]] = filtresCount[key]; // заменить на значения в массиве объектов недвижимости
      }
    }

    return selectedFiltres;
  };


  var filtresToProperties = {
    'housing-type': 'type',
    'housing-price': 'price',
    'housing-rooms': 'rooms',
    'housing-guests': 'guests',
    'filter-wifi': 'wifi',
    'filter-dishwasher': 'dishwasher',
    'filter-parking': 'parking',
    'filter-washer': 'washer',
    'filter-elevator': 'elevator',
    'filter-conditioner': 'conditioner',
  };

  var filtresCount = { // rename
    'housing-type': 'any',
    'housing-price': 'any',
    'housing-rooms': 'any',
    'housing-guests': 'any',
    'filter-wifi': 'any',
    'filter-dishwasher': 'any',
    'filter-parking': 'any',
    'filter-washer': 'any',
    'filter-elevator': 'any',
    'filter-conditioner': 'any',
  };

  var activateFilters = function () {
    /* var TYPE_ACTION = {
      'select-one': 'change',
      'checkbox':
    }*/
    var filtersForm = document.querySelector('.map__filters');
    var elements = filtersForm.elements;
    // var currentFiltres = [];

    var filterChangeHandler = function (evt) {
      if (evt.target.type === 'select-one') {
        var selectedIndex = evt.target.options.selectedIndex;
        filtresCount[evt.target.id] = evt.target.options[selectedIndex].value;
      } else {
        if (evt.target.checked) {
          filtresCount[evt.target.id] = evt.target.value;
        } else {
          filtresCount[evt.target.id] = 'any';
        }

      }
      var currentFiltres = takefilters();
      var sortedEstates = doFilterEstate(window.init.serverEstateData, currentFiltres);
      window.map.refreshMapPins(sortedEstates);
      // console.log(currentFiltres);

      /* if (massive.offer[filtresToProperties[key]]) {
        // selectedFiltres[key] = massive[key];
        console.log(massive.offer[filtresToProperties[key]]);
      }*/
    /* var estatesRating = [];
    massive.forEach(function (item) {
      for (var key in selectedFiltres) {
        item.offer[]
      }
    });
*/
    };


    for (var i = 0; i < elements.length; i++) {
      var elementType = elements[i].type.toLowerCase();
      if (elementType === 'select-one' || elementType === 'checkbox') {
        var filter = elements[i];
        filter.addEventListener('change', filterChangeHandler);
        // console.log(filtresCount[filter.id]);
      }


    }
    // console.log(filtresCount);
  };
  /* switch (elementType) {
        case 'select-one':
          var selectOptions = elements[i].options;
          for (var j = 0; j < selectOptions.length; j++) {
            if (selectOptions[j].defaultSelected) {
              selectOptions.selectedIndex = j;
              break;
            }
          }
          break;
          // case 'file':
          //
          //       break;
          // case 'number':
          //
          //     break;
        case 'checkbox':
          if (elements[i].checked) {
            elements[i].checked = false;
          }
          break;
        default:
          break;
      }*/
  /*
 author: {
        avatar: AVATARS_PATH + (avatarsRandomSequenceIndex[numberEstateOblect] + 1) + '.png'},
      offer: {
        title: ESTATE_TITLES[estateTitlesIndex[numberEstateOblect]],
        address: [locationX, locationY],
        price: window.util.getRandomMinMax(MIN_PRICE_UNIT, MAX_PRICE_UNIT),
        type: window.util.chooseRandomArrayItem(ESTATE_TYPES),
        rooms: countRooms,
        guests: window.util.getRandomMinMax(1, (countRooms * MAX_GUESTS_IN_ROOMS)),
        checkin: window.util.chooseRandomArrayItem(CHECK_IN_OUT_VARIANTS),
        checkout: window.util.chooseRandomArrayItem(CHECK_IN_OUT_VARIANTS),
        features: window.util.cropArray(FEATURES_VARIANTS, window.util.getRandomMinMax(0, FEATURES_VARIANTS.length)),
        description: '',
        photos: getArrayPhotos(ESTATE_PHOTOS)
      },

      location: {
        x: locationX,
        y: locationY
      }

*/

  /* for (var key in filtresCount) {

    }*/
  // return filtresCount;
  // id select             offer:
  // housing-type          type: window.util.chooseRandomArrayItem(ESTATE_TYPES), ['palace', 'flat', 'house', 'bungalo']
  // housing-price         price: window.util.getRandomMinMax(MIN_PRICE_UNIT, MAX_PRICE_UNIT)
  // housing-rooms         rooms: countRooms,
  // housing-guests        guests: window.util.getRandomMinMax(1, (countRooms * MAX_GUESTS_IN_ROOMS)),

  // id checkbox           features: window.util.cropArray(FEATURES_VARIANTS, window.util.getRandomMinMax(0, FEATURES_VARIANTS.length)),
  // filter-wifi
  // filter-dishwasher
  // filter-parking
  // filter-washer
  // filter-elevator
  // filter-conditioner    'wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'

  // changefilters: changefilters
  window.filtersForm = {
    takefilters: takefilters,
    activateFilters: activateFilters,
    filtresCount: filtresCount,
    checkRefreshMap: checkRefreshMap,
    doFilterEstate: doFilterEstate
  };
})();

