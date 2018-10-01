var express = require('express');
var bodyParser = require('body-parser');
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {user} = require('./models/user');

var app = express();

app.use(bodyParser.json());

// creating new todos
app.post('/todos', (req, res) => {
    console.log(req.body);
    var todo = new Todo( {
        text: req.body.text
    });

    todo.save().then((doc) => {
        res
        .status(200)
        .send(doc);

    }, (e)=> {
        res
        .status(400)
        .send(e);
    });
});

app.listen(3000, ()=> {
    console.log('Start on port 3000');
});
