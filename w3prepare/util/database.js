

//mongodb user: nodeuser  password: p1ngpong
//mongodb+srv://nodeuser:p1ngpong@cluster0.f2qqp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority


const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
    MongoClient.connect('mongodb+srv://nodeuser:p1ngpong@cluster0.f2qqp.mongodb.net/shop?retryWrites=true&w=majority')
    .then(client => {
        console.log("Connected to MongoDB");
        _db = client.db();
        callback();
    })
    .catch(err => {
        console.log(`Error: ${err}`);
        throw err;
    });
}

const getDb = () => {
    if (_db){
        return _db;
    }
    throw 'No dabase found';
}
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;