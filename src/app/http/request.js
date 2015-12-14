export function request(url, options = {}) {
  options = Object.assign({
    method: "GET",
    user: null,
    pass: null,
    responseType: "json",
    withCredentials: false
  }, options);

  return new Promise((resolve, reject) => {
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

    if (options.data) {
      xhr.send(options.data);
    } else {
      xhr.send();
    }

    xhr.onerror = function() {
      xhr.onerror = null;
      xhr.onload = null;

      reject({
        error: "Error"
      });
    };

    xhr.onload = function() {
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

      resolve({
        headers: headers,
        body: body,
        status: status
      });
    };
  });
}
