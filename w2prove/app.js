const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

const adminRoutes = require('./routes/admin');
const bookRoutes = require('./routes/books');

app.use(express.static(path.join(__dirname, 'public')));
app.use(adminRoutes.routes); 
app.use(bookRoutes);

//If page not found
app.use((req,res,next) => {
    res.status(404).render('404', {pageTitle: '404: Page Not Found'});
})

app.listen(3000);
