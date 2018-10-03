var express = require('express');
var bodyParser = require('body-parser');
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {user} = require('./models/user');
var {ObjectID} = require('mongodb');
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

app.get('/todos', (req, res) => {
    console.log('GET /todos');
    Todo.find().then( (todos)=> {
        res.send( {
            todos
        });
    }, (e) => {
        res
        .status(400)
        .send(e);
    });
});

app.get('/todos/:id', (req,res) => {
    var id = req.params.id;
    console.log(id);
    
    if(!id || !ObjectID.isValid(id)) {
        return res
        .status(404)
        .send();
    }

    Todo.findById(id).
    then((todo) => {
        if (!todo) {
            return res
            .status(404)
            .send('Not a valid id');
        }
        res
        .status(200)
        .send(todo);
    }).catch( (e) => {
        res
        .status(400)
        .send(e);
    });
});

app.listen(3000, ()=> {
    console.log('Start on port 3000');
});


module.exports = {
    app
}
