var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
const Joi = require('joi');
router.get('/', function (req, res, next) {
    console.log();
    var MongoClient = mongodb.MongoClient;

    var url = 'mongodb://localhost:27017';

    MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
        if (err) {
            console.log('Unable to connect to mongodb server!', err);
        }
        else {
            console.log('Connected huehue!');
            var db = client.db('samplesite');
            var collection = db.collection('recipes');
            // collection.insert([req.query]);
            // /_id: ObjectId("5d414591e7df51145cf861ff") this is how one can search using _id
            collection.find({}).toArray(function (err, result) {
                if (err) {
                    res.send(err);
                }
                else if (result.length) {
                    res.send(result);
                } else {
                    res.send('no documents found!');
                }
                client.close();
            })
        }
    });

    // res.send(req.query);
});
router.post('/', function (req, res, next) {
    const schema = {
        title: Joi.string().min(3).required(),
        time: Joi.string().required(),
        difficulty: Joi.number().required()
    };
    const result = Joi.validate(req.body, schema);
    console.log(result);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
    }
    else {
        var MongoClient = mongodb.MongoClient;

        var url = 'mongodb://localhost:27017';

        MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
            if (err) {
                console.log('Unable to connect to mongodb server!', err);
            }
            else {
                console.log('Connected huehue!');
                var db = client.db('samplesite');
                var collection = db.collection('recipes');
                collection.insert([req.body], function (err, result) {
                    console.log(err);
                    console.log(result);
                    res.status(200).send('success');
                });

            }
        });
    }


    // res.send(req.query);
});

router.get('/search', function (req, res, next) {
    const searchSchema = {
        query: Joi.string().min(3).required()
    };
    
    var queryParam = req.query.query;
    console.log(queryParam);
    const validationResult = Joi.validate({ "query": req.query.query }, searchSchema);
    if (validationResult.error) {
        res.status(400).send(validationResult.error.details[0].message);
    }
    else {
        var MongoClient = mongodb.MongoClient;

        var url = 'mongodb://localhost:27017';
        
        MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
            if (err) {
                console.log('Unable to connect to mongodb server!', err);
            }
            else {
                console.log('Connected huehue!');
                var db = client.db('samplesite');
                var collection = db.collection('recipes');

               
                console.log(queryParam);
                let exp = ".*"+queryParam+".*"; // regular expression for matching a string
                collection.find({ "title": RegExp(exp) }).toArray(function (err, queryResult) {
                    if (err) {
                        res.status(400).send('something went wrong!');
                    }
                    else if (!queryResult) {
                        res.status(404).send('Could not find the recipe!');
                    }
                    else {
                        res.status(200).send(queryResult);
                    }
                });



            }
        });
    }
});

module.exports = router;