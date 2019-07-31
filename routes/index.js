var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/thelist', function(req, res){
  var MongoClient = mongodb.MongoClient;

  var url = 'mongodb://localhost:27017';

  MongoClient.connect(url, {useNewUrlParser: true}, function(err, client){
    if(err){
      console.log('Unable to connect to mongodb server!', err);
    }
    else{
      console.log('Connected huehue!');
      var db = client.db('samplesite');
      var collection = db.collection('students');
      collection.find({}).toArray(function(err, result){
        if(err){
          res.send(err);
        }
        else if(result.length){
          res.render('studentlist',{
            "studentlist": result
          })
        }else{
          res.send('no documents found!');
        }
        client.close();
      })
    }
  });

  
});

module.exports = router;
