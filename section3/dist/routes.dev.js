"use strict";

var fs = require('fs');

var requestHandler = function requestHandler(req, res) {
  var url = req.url;
  var method = req.method;

  if (url === "/") {
    res.write('<html>');
    res.write('<head><title>Enter Message</title></head>');
    res.write('<body><form action="/message" method="POST"><input name="message" type="text"><button type="submit">Send</button></form></body>');
    res.write('</html>');
    return res.end();
  }

  if (url === "/message" && method === "POST") {
    var body = [];
    req.on('data', function (chunk) {
      console.log(chunk);
      body.push(chunk);
    });
    return req.on('end', function () {
      var parsedBody = Buffer.concat(body).toString();
      var message = parsedBody.split('=')[1];
      fs.writeFile('message.txt', message, function (err) {
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
      });
    });
  }

  res.setHeader('Content-Type', 'text/html');
  res.write('<html>');
  res.write('<head><title>My First Page</title></head>');
  res.write('<body><h1 style="color: green">Hello from my Node.js server!</h1></body>');
  res.write('</html>');
  res.end();
};

module.exports = requestHandler; //Now can require requestHandler on server.js

/*Could create an object
module.exports = {
    handler: requestHandler,
    someText: "Now I'm exporting multiple things at once."

    Be sure to access the appropriate property when calling on the imported file. IE: routes.handler or routes.someText

    You could also create: 
    module.exports.handler = requestHandler;
    module.exports.someText = "I'm still exporting multiple things at once."

    And if you want to save some keystrokes, you can omit module.
    exports.handler = requestHandler;
    exports.someText = "And I'm still exporting multiple things at once."
}
*/