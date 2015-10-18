/**
 * Created by Timothy on 10/17/15.
 */

var express = require('express'),
    mongodb = require('mongodb'),
    app = express(),
    bodyParser = require('body-parser'),
    validator = require('express-validator'),
    logger = require('morgan'),
    errorHandler = require('errorhandler'),
    compression = require('compression'),
    exphbs  = require('express-handlebars'),
    url = 'mongodb://localhost:27017/board',
    React = require('react/addons'),
    components = require('./public/js/app.js'),
    Header = React.createFactory(components.Header),
    Footer = React.createFactory(components.Footer),
    MessageBoard = React.createFactory(components.MessageBoard)


mongodb.MongoClient.connect(url, function(err, db) {
    if (err) {
        console.err(err)
        process.exit(1)
    }

    app.use(compression())
    app.use(logger('combined'))
    app.use(errorHandler())
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())
    app.use(validator())
    app.use(express.static('public'))
    app.engine('handlebars', exphbs())
    app.set('view engine', 'handlebars')

    app.use(function(req, res, next) {
        req.messages = db.collection('messages')
        return next()
    })

    app.get('/messages', function(req, res, next) {
        req.messages.find({}, {sort: {_id: -1 }}).toArray(function (err, docs) {
                if (err) return next(err)
                return res.json(docs)
            })
    })

    app.post('/messages', function(req, res, next) {
        req.checkBody('message', 'Invalid message in body').notEmpty();
        req.checkBody('name', 'Invalid name in body').notEmpty();
        var errors = req.validationErrors()
        if (errors) return next(errors)
        req.messages.insertOne(req.body, function(err, result) {
            if (err) return next(err)
            return res.json(result.ops[0])
        })
        //res.send("Finished");
    })

    app.get('/', function(req, res, next){
        req.messages.find({}, {sort: {_id: -1}}).toArray(function(err, docs){
            if (err) return next(err)
            res.render('index', {
                header: React.renderToString(Header()),
                footer: React.renderToString(Footer()),
                messageBoard: React.renderToString(MessageBoard({messages: docs})),
                props: '<script type="text/javascript">var messages='+JSON.stringify(docs)+'</script>'
            })
        })
    })

    app.listen(5000)
})