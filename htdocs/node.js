#!/usr/bin/env node

var http = require("http"),
    url  = require("url"),
    path = require("path"),
    fs   = require("fs");

(function(root, port) {

  //
  // status code message map
  //
  var message = {
    200: "OK",
    404: "Not Found",
    500: "Internal Server Error",
    501: "Note Implemented"
  };

  //
  // mime type map
  //
  var mime = {
    ".html": "text/html",
    ".css":  "text/css",
    ".js":   "application/javascript",
    ".png":  "image/png",
    ".jpg":  "image/jpeg",
    ".gif":  "image/gif",
    ".txt":  "text/plain"
  };

  //
  // send requested file
  //
  function sendFile(req, res, filePath) {

    var file = fs.createReadStream(filePath);
    file.on("readable", function() {
      res.writeHead(200, {"Content-Type": mime[path.extname(filePath)] || "text/plain"});
    });

    file.on("data", function(data) {
      res.write(data);
    });

    file.on("close", function() {
      res.end();
      console.log("<- " + message[200] + ": " + req.method + " " + req.url);
    });

    file.on("error", function(err) {
      sendError(req, res, 500);
    });
  }

  //
  // send error status
  //
  function sendError(req, res, statusCode) {
    res.writeHead(statusCode, {"Content-Type": "text/html"});
    res.write("<!DOCTYPE html><html><body><h1>" + message[statusCode] + "</h1></body></html>");
    res.end();
    console.log("<- " + message[statusCode] + ": " + req.method + " " + req.url);
  }

  //
  // request handler
  //
  function handleRequest(req, res, filePath) {

    fs.stat(filePath, function(err, stats) {
      if (err) {
        if ((/ENOENT/).test(err.message)) return sendError(req, res, 404);
        else return sendError(req, res, 500);
      }

      if (stats.isDirectory())
        return handleRequest(req, res, path.join(filePath, "index.html")); // try to handle request with index.html file
      else
        return sendFile(req, res, filePath);
    });
  }

  //
  // create and start the server
  //
  http.createServer(function(req, res) {

    var pathName = url.parse(req.url).pathname;
    console.log("-> " + req.method + " " + pathName);

    if (req.method === "GET")
      handleRequest(req, res, path.join(root, pathName));
    else
      sendError(req, res, 501);

  }).listen(port);

  //
  // initiation log
  //
  console.log("Http Server running at http://localhost:" + port + "/ (" + root + ")");

}('./',8000));
