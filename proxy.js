
const http = require("http"),
      httpProxy = require("http-proxy");

const proxy = httpProxy.createProxyServer({});

const server = http.createServer(function(req, res) {
  proxy.web(req, res, { target: "http://185.26.125.253:8000/" });
});

console.log("listening on port 8000")
server.listen(8000);
