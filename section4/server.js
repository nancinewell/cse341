const http = require('http');

const express = require('express');

const app = express();

app.use('/', (req, res, next) => {
    console.log('This always runs');
    next();
})
app.use('/add-product', (req, res, next) => {
    console.log('In another middleware'); 
    res.send('<h1>Add Product Page!</h1>'); 
});

app.use('/' /*This means the path STARTS with a slash*/, (req, res, next) => {
    console.log('In another middleware'); 
    res.send('<h1>Hello from Express!</h1>'); //Send allows you to send a response. you can setHeader, but it defaults to text/HTML.
});

/*const server = http.createServer(app);

server.listen(3000);

Replace with: */

app.listen(3000);