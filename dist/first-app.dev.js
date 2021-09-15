"use strict";

console.log("hello from node.js");

var fs = require('fs');

fs.writeFileSync('hello.txt', 'hello from node.js');