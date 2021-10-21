const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI = 'mongodb+srv://nodeuser:p1ngpong@cluster0.f2qqp.mongodb.net/shop?retryWrites=true&w=majority';

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
  //you can set when it will expire and it will be automatically cleaned up by mongodb
});
const csrfProtection = csrf();


app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'aLongStringValue', resave: false, saveUninitialized: false, store: store}));

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken= req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if(!req.session.user){
    return next();
  }
  User.findById(req.session.user._id)
      .then(user => {
        if(!user){
          return next();
        }
        req.user = user;
        next();
      })
      .catch(err => {next(new Error(err))});
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get(errorController.get500);
//or
app.use((error, req, res, next) => {
  res.redirect('/500');
  //or render with status code or anything else.
})

app.use(errorController.get404);

const config = {
  autoIndex: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
};

mongoose
  .connect(
    MONGODB_URI, config)
  .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
