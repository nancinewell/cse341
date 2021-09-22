const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');

//const expressHbs = require('express-handlebars');

const app = express();

//app.engine('hbs', expressHbs({layoutsDir: 'views/layouts', defaultLayout: 'main-layout', extname: 'hbs'}));// 'views/layouts' is the default. Reset it if you need to use a different location
//app.set('view engine', 'hbs');

//app.set('view engine', 'pug');

app.set('view engine', 'ejs');

app.set('views', 'views'); //views is actually the default. Be sure to set this if you use another folder. 

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
    res.status(404).render('404', {pageTitle: '404: Page Not Found'});
});

app.listen(3000);


