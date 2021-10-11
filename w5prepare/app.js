const path = require('path');

const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById("615c4e27045748fae3cc7093")
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(`Error: ${err}`));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect('mongodb+srv://nodeuser:p1ngpong@cluster0.f2qqp.mongodb.net/shop?retryWrites=true&w=majority').then(result => {
  User.findOne().then(user =>{
    if(!user){
      const user = new User({
        name: 'AdminUser',
        email: 'admin@email.com',
        cart: {
          items: []
        }
      });
      user.save(); 
    }
  })
  
  app.listen(3000);
}).catch(err => {
  console.log(`Error: ${err}`);
})