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
      onError('Невозможно создать XMLHttpRequest'); // вывести сообщение об ошибке
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

    var getErrorHandler = function () {
      onError('Серевер вернул неверный формат ответа на запрос');
    };

    var getReadyStateHandler = function () {
      /* if (evt.readyState === 1) {
        window.form.setElementDisabled(); // добавить изменение класса + disabled и отмену
      }*/
      console.log('Стадия обработки запроса:  ' + xhr.readyState);

    };

    var getAbortStateHandler = function () {
      onError('Обрыв соединения!!!');
    };

    var getTimeoutHandler = function () {
      onError('Превышен интревал одидания ответа от Сервера. Операция отменена');
      xhr.abort();
    };

    xhr.responseType = 'json';
    xhr.timeout = 3000; // xhr.abort();
    /* xhr.onreadystatechange = func;
    var func = function () {

    };*/


    xhr.addEventListener('load', getLoadHandler);
    xhr.addEventListener('error', getErrorHandler);
    xhr.addEventListener('readystatechange', getReadyStateHandler);
    xhr.addEventListener('abort', getAbortStateHandler);
    xhr.addEventListener('timeout', getTimeoutHandler);

    xhr.open('GET', URL, true);
    xhr.send();
  };

  var makePostServerRequest = function (data, onLoad, onError) {
    var URL = 'https://js.dump.academy/keksobooking7';

    var xhr = createXhr();
    // xhr.responseType = 'json';

    // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');


    var postErrorHandler = function () {
      onError('Серевер вернул ошибку при обработке запроса');
    };

    var postReadyStateHandler = function () {
      /* if (evt.readyState === 1) {
        window.form.setElementDisabled(); // добавить изменение класса + disabled и отмену
      }*/
      console.log('Стадия обработки запроса:  ' + xhr.readyState);

    };

    var postAbortStateHandler = function () {
      onError('Обрыв соединения!!!');
    };

    var postTimeoutHandler = function () {
      onError('Превышен интревал одидания ответа от Сервера. Операция отменена');
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

  var xhr = new XMLHttpRequest();
  xhr.responseType = 'json';
  xhr.onreadystatechange = func;
  var func = function () {

  };

  window.backend = {
    makeGetServerRequest: makeGetServerRequest,
    makePostServerRequest: makePostServerRequest,
  };
})();
