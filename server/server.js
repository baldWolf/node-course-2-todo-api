const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {user} = require('./models/user');
var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// POST /todos
// creates new todos
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

// GET /todos
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

// GET /todos/:id
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

// DELETE /todos/:id
app.delete('/todos/:id', (req,res) => {
    var id = req.params.id;

    if(!id || !ObjectID.isValid(id)) {
        return res
        .status(404)
        .send();
    }

    // findOneAndDelete
    Todo.findByIdAndRemove(id).then((todo) => {
        console.log('delete ==> ', todo);
        if(!todo) {
            return res
            .status(404)
            .send();
        }

        res
        .status(200)
        .send({todo});
    }).catch( (e) => {
        res
        .status(400)
        .send(e);
    });
});

app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if(!id || !ObjectID.isValid(id)) {
        return res
        .status(404)
        .send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, { $set: body } , {new: true}).then((todo) => {
        if(!todo) {
            return res
            .status(404)
            .send();
        }

        res.send({todo});
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.listen(port, ()=> {
    console.log(`Start port ${port}`);
});


module.exports = {
    app
}
