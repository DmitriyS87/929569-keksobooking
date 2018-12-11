'use strict';

(function () {

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


  var makeGetServerRequest = function (onLoad, onError) {
    var URL = 'https://js.dump.academy/keksobooking/data';

    var xhr = createXhr(onError);

    var getLoadHandler = function () {
      var error;
      switch (xhr.status) {
        case 200:
          onLoad(xhr.response);
          break;
        case 400:
          error = 'Ошибка при загрузке данных! Неверный запрос к серверу. Сообщите администратору сайта о проблеме при запросе данных от сервера';
          break;
        case 401:
          error = 'Ошибка при загрузке данных! Недостаточно прав для выполнения запроса! Пройдите авторизацию.';
          break;
        case 404:
          error = 'Ошибка при загрузке данных! Запрашиваемая инфомрация не найдена.';
          break;
        default:
          error = 'Ошибка при загрузке данных! Статус ответа: ' + xhr.status + '  ' + xhr.statusText + '. Попробуйте перезагрузить страницу';
      }
      if (error) {
        onError(error);
      }
    };

    var getErrorHandler = function () {
      onError('Серевер вернул неподдерживаемый ответ на запрос');
    };

    var getAbortStateHandler = function () {
      onError('Обрыв соединения!!!');
    };

    var getTimeoutHandler = function () {
      onError('Превышен интревал одидания ответа от Сервера. Операция отменена');
      xhr.abort();
    };

    xhr.responseType = 'json';
    xhr.timeout = 3000;

    xhr.addEventListener('load', getLoadHandler);
    xhr.addEventListener('error', getErrorHandler);
    xhr.addEventListener('abort', getAbortStateHandler);
    xhr.addEventListener('timeout', getTimeoutHandler);

    xhr.open('GET', URL, true);
    xhr.send();
  };

  var makePostServerRequest = function (data, onLoad, onError) {
    var URL = 'https://js.dump.academy/keksobooking';

    var xhr = createXhr();

    var postErrorHandler = function () {
      onError('Серевер вернул ошибку при обработке запроса');
    };

    var postReadyStateHandler = function () {
      var submitButton = document.querySelector('.ad-form__submit');
      if (xhr.readyState === 2) {
        window.form.setElementDisabled(submitButton);
      }
      if (xhr.readyState === 4) {
        window.form.setElementEnabled(submitButton);
      }
    };

    var postAbortStateHandler = function () {
      onError('Непредвиденная ошибка. Произошел обрыв соединения с сервером');
    };

    var postTimeoutHandler = function () {
      onError('Превышен интревал одидания ответа от Сервера. Сервер перегружен. Пожалуйста, попробуйте повторить действие через несколько минут');
      xhr.abort();
    };

    var postLoadHandler = function () {
      var error;
      switch (xhr.status) {
        case 200:
          onLoad();
          break;
        case 400:
          error = 'Ошибка! Неверный запрос к серверу';
          break;
        case 401:
          error = 'Ошибка! Недостаточно прав для выполнения запроса! Пройдите авторизацию';
          break;
        case 404:
          error = 'Ошибка! Запрашиваемая инфомрация не найдена';
          break;
        default:
          error = 'Ошибка! Статус ответа: ' + xhr.status + '  ' + xhr.statusText;
      }
      if (error) {
        onError(error);
      }
    };

    xhr.addEventListener('load', postLoadHandler);
    xhr.addEventListener('error', postErrorHandler);
    xhr.addEventListener('readystatechange', postReadyStateHandler);
    xhr.addEventListener('abort', postAbortStateHandler);
    xhr.addEventListener('timeout', postTimeoutHandler);

    xhr.open('POST', URL, true);
    xhr.send(data);
  };

  window.backend = {
    makeGetServerRequest: makeGetServerRequest,
    makePostServerRequest: makePostServerRequest,
  };
})();
