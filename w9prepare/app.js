const express = require('express');

const feedRoutes = require('./routes/feed');

const bodyParser = require('body-parser');


const app = express();

app.use(bodyParser.json());

//to allow other sites to access the data
app.use((req, res, next) => {
    res.setHeader('Access-Controll-Allow-Origin', '*');
    res.setHeader('Access-Controll-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/feed', feedRoutes);



app.listen(8080);