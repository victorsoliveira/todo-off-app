/**
 * Created by victor on 08/07/15.
 */

'use strict';

require('./configs/mongo')();

var path = require('path');
var bodyParser = require('body-parser');
var express = require('express');
var logger = require('morgan');
var router = express.Router();

var Todo = require('./models/Todo');

var app = express();

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger('dev'));

app.use(express.static(path.join(__dirname, 'public')));


router.get('/todos', function(req, res) {
    Todo.find({}, function(err, todos) {
        if (err) res.status(500).send(retval);
        res.json(todos);
    });
});

router.post('/todos', function(req, res) {

    if (req.body.text) {

        var todo = new Todo({text: req.body.text});

        todo.save(function(err){
            if (err) {
                res.sendStatus(500);
            }
        });

        res.sendStatus(200);
    } else {
        res.sendStatus(401);
    }

});

router.get('/todos/:id', function(req, res) {
    console.info(req, res);
    res.sendStatus(200);
});

app.use('/api', router);

app.listen(app.get('port'), function() {
    console.log("Test Todo API is online on http://localhost:" + app.get('port'));
});