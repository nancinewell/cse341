const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const adminRoutes = require('./routes/admin');
const moreRoutes = require('./routes/anotherpage');
const app = express();


//MIDDLEWARE
//parse incoming req body
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(adminRoutes);
app.use(moreRoutes);

app.use((req, res, next) => {
    res.status(404).sendFile(pathway.join(__dirname, 'views', '404.html'));
});

app.listen(3000);

