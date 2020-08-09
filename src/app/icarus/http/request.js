function xmlHttpRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    options = Object.assign({
      method: "GET",
      user: null,
      pass: null,
      responseType: "json",
      withCredentials: false
    }, options);

    const xhr = new XMLHttpRequest();
    xhr.open(options.method, url, true, options.user, options.pass);
    xhr.responseType = options.responseType;
    xhr.withCredentials = options.withCredentials;
    if (options.user && options.pass) {
      xhr.setRequestHeader("Authorization", "Basic " + window.btoa(options.user + ":" + options.pass));
    }

    if (options.headers) {
      const names = Object.keys(options.headers);
      for (let index = 0; index < names.length; index++) {
        const name = names[index],
          value = names[name];
        xhr.setRequestHeader(name, value);
      }
    }

    xhr.send((options.data ? options.data : null));

    xhr.onerror = function (e) {
      xhr.onerror = null;
      xhr.onload = null;
      return reject({
        error: "XMLHttpRequest error",
        xhr
      });
    };

    xhr.onload = function () {
      const headers = xhr.getAllResponseHeaders()
        .split("\n")
        .map((item) => {
          return item.split(": ");
        })
        .reduce((initial, current) => {
          const name = current[0],
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

      return resolve({
        headers: headers,
        body: body,
        status: status
      });
    };
  });
}

function fetchRequest(url, options) {
  options = Object.assign({
    method: "GET",
    user: null,
    pass: null,
    responseType: "json",
    withCredentials: false
  }, options);

  return fetch(url, {
    method: (options && options.method) || "GET",
    credentials: (options && options.withCredentials && "include") || "same-origin",
  }).then((response) => {
    function createResponse(response) {
      return function(body) {
        console.log(body)
        return {
          headers: response.headers,
          body: body,
          status: response.status
        };
      };
    }
    if (options.responseType === "json") {
      return response.json().then(createResponse(response));
    } else if (options.responseType === "arraybuffer") {
      return response.arrayBuffer().then(createResponse(response));
    } else if (options.responseType === "blob") {
      return response.blob().then(createResponse(response));
    } else if (options.responseType === "text") {
      return response.text().then(createResponse(response));
    }
  });
}

export const request = window.fetch ? fetchRequest : xmlHttpRequest;

export default request;
