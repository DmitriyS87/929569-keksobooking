'use strict';

(function () {
  var LOAD_TIMEOUT = 20000;
  var LOAD_URL = 'https://js.dump.academy/keksobooking/data';
  var SAVE_URL = 'https://js.dump.academy/keksobooking';

  var createXhr = function (onError) {
    var xhr = false;

    if (window.XMLHttpRequest) {
      // Gecko-совместимые браузеры, Safari, Konqueror
      xhr = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
      // Internet explorer
      try {
        xhr = new window.ActiveXObject('Microsoft.XMLHTTP');
      } catch (CatchException) {
        xhr = new window.ActiveXObject('Msxml2.XMLHTTP');
      }
    }
    if (!xhr) {
      onError('Невозможно создать XMLHttpRequest');
    }

    return xhr;
  };

  var makeServerRequest = function (onLoad, onError, method, URL, data) {
    var SUCCESS_CODE = 200;
    var ERROR_CODE = {
      400: 'Неверный запрос к серверу. Сообщите администратору сайта о проблеме при запросе данных от сервера',
      401: 'Недостаточно прав для выполнения запроса на сервер! Пройдите авторизацию.',
      404: 'Ошибка при загрузке данных! Запрашиваемая инфомрация не найдена.',
    };

    var xhr = createXhr(onError);


    if (method === 'GET') {
      xhr.responseType = 'json';
    }

    var responseLoadHandler = function () {
      var error;
      if (xhr.status === SUCCESS_CODE) {
        onLoad(xhr.response);
      } else {
        if (ERROR_CODE[xhr.status]) {
          error = ERROR_CODE[xhr.status];
        } else {
          error = 'Ошибка при загрузке данных! Статус ответа: ' + xhr.status + '  ' + xhr.statusText + '. Попробуйте перезагрузить страницу';
        }
      }
      if (error) {
        onError(error);
      }
    };

    var responseErrorHandler = function () {
      onError('Серевер вернул ошибку при обработке запроса');
    };

    var responseAbortHandler = function () {
      onError('Обрыв соединения!!!');
    };

    var responseTimeoutHandler = function () {
      onError('Превышен интревал одидания ответа от Сервера. Операция отменена');
      xhr.abort();
    };

    xhr.timeout = LOAD_TIMEOUT;

    xhr.addEventListener('load', responseLoadHandler);
    xhr.addEventListener('error', responseErrorHandler);
    xhr.addEventListener('abort', responseAbortHandler);
    xhr.addEventListener('timeout', responseTimeoutHandler);

    xhr.open(method, URL, true);
    xhr.send(data);
  };

  var load = function (onLoad, onError) {
    makeServerRequest(onLoad, onError, 'GET', LOAD_URL);
  };

  var save = function (onLoad, onError, data) {
    makeServerRequest(onLoad, onError, 'POST', SAVE_URL, data);
  };


  window.backend = {
    load: load,
    save: save
  };
})();
