const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class Product {
  constructor(title, price, description, imageUrl, id, userId){
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.userId = userId;
  }  

  save(){
    //connect to the db
    const db = getDb(); 
    let dbOp;
    if(this._id){
      //update
      dbOp = db.collection('products').updateOne({_id: this._id}, {$set: this});
    } else {
      return dbOp = db
      .collection('products')
      .insertOne(this);
    }
    
    //tell mongodb what collection to work with. if it doesn't exist, it'll be created on the fly
    return dbOp
    .then(result => {
      console.log(`Result of Product.save(): ${result}`);
    })
    .catch(err => {
      console.log(`Error: ${err}`); 
    });
  
  }

  static fetchAll(){

    const db = getDb(); 
    //.find({title: 'A Book Title'})   use to filter!
    //.find().toArray() to send it to an array
    return db
      .collection('products')
      .find()
      .toArray() //returns a promise
      .then(products => {
        //console.log(products);
        return products;
      })
      .catch(err => {
        console.log(`Error: %{err}`);
      })
  }

  static findById(prodId){
    const db = getDb();
    return db.collection('products')
      .find({_id: new mongodb.ObjectId(prodId)})// create a new object id of MongoDB's type to compare the existing mongodb id to.
      .next()
      .then(product => {
        //console.log(product);
        return product;
      })
      .catch(err => {
        console.log(`Error: %{err}`);
      })

  }


    static deleteById(prodId){
      const db = getDb();
      return db.collection('products')
        .deleteOne({_id: new mongodb.ObjectId(prodId)})
        .then(() => {
          console.log("deleted");
        })
        .catch(err => {
          console.log(err);
        });
    }
}


module.exports = Product;
