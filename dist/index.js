(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var config = {
  URL: "http://localhost:8000/api/",
  CREDENTIALS: {
    user: "admin",
    pass: "123456"
  }
};
exports.config = config;

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getProtonFlux = getProtonFlux;

var _config = require("./config");

var _url = require("./url");

var _httpRequest = require("../http/request");

function getProtonFlux() {
  return (0, _httpRequest.request)((0, _url.url)("protonflux/?format=json"), _config.config.CREDENTIALS);
}

},{"../http/request":4,"./config":1,"./url":3}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.url = url;

var _config = require("./config");

function url(url) {
  if (url.substr(0, 1) === "/" && _config.config.URL.substr(-1) === "/") {
    return _config.config.URL + url.substr(1);
  } else if (url.substr(0, 1) !== "/" && _config.config.URL.substr(-1) !== "/") {
    return _config.config.URL + "/" + url;
  }
  return _config.config.URL + url;
}

},{"./config":1}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.request = request;

function request(url) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  options = Object.assign({
    method: "GET",
    user: null,
    pass: null,
    responseType: "json",
    withCredentials: false
  }, options);

  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open(options.method, url, true, options.user, options.pass);
    xhr.responseType = options.responseType;
    xhr.withCredentials = options.withCredentials;
    if (options.user && options.pass) {
      xhr.setRequestHeader("Authorization", "Basic " + window.btoa(options.user + ":" + options.pass));
    }

    if (options.headers) {
      var names = Object.keys(options.headers);
      for (var index = 0; index < names.length; index++) {
        var _name = names[index],
            value = names[_name];
        xhr.setRequestHeader(_name, value);
      }
    }

    if (options.data) {
      xhr.send(options.data);
    } else {
      xhr.send();
    }

    xhr.onerror = function () {
      xhr.onerror = null;
      xhr.onload = null;

      reject({
        error: "Error"
      });
    };

    xhr.onload = function () {
      var headers = xhr.getAllResponseHeaders().split("\n").map(function (item) {
        return item.split(": ");
      }).reduce(function (initial, current) {
        var name = current[0],
            value = current[1];
        if (name) {
          initial[name] = value;
        }
        return initial;
      }, {}),
          body = xhr.response,
          status = xhr.status;

      xhr.onerror = null;
      xhr.onload = null;

      resolve({
        headers: headers,
        body: body,
        status: status
      });
    };
  });
}

},{}],5:[function(require,module,exports){
"use strict";

var _apiProtonflux = require("./api/protonflux");

(0, _apiProtonflux.getProtonFlux)().then(function (res) {
  console.log(res.body);
});

},{"./api/protonflux":2}]},{},[5]);
