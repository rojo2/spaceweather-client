export function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(options.method, url, true, options.user, options.pass);
    if (options.headers) {
      const names = Object.keys(options.headers);
      for (let index = 0; index < names.length; index++) {
        const name = names[index],
          value = names[name];
        xhr.setRequestHeader(name, value);
      }
    }
    xhr.send(options.data);
    xhr.onerror = function() {
      xhr.onerror = null;
      xhr.onload = null;

      reject({
        error: "Error"
      });
    };

    xhr.onload = function() {
      xhr.onerror = null;
      xhr.onload = null;

      resolve({
        headers: xhr.getAllResponseHeaders()
          .split("\n")
          .map((item) => {
            return item.split(": ");
          })
          .reduce((initial, current) => {
            const name = current[0],
              value = current[1];

            initial[name] = value;
            return initial;
          }, {}),
        body: xhr.response,
        status: xhr.status
      });
    };
  });
}
