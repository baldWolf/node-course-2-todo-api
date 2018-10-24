require('./config/config.js');
// var env = process.env.NODE_ENV || 'development';
// console.log('env ====>', env);
// if (env === 'development') {
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
// } else if ( env === 'test') {
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
// }

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {user} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT; //|| 3000;

app.use(bodyParser.json());

app.delete('/users/me/token', authenticate, async (req,res) => {
    // req.user.removeToken(req.token).then(()=> {
    //     res.status(200).send();
    // }, ()=> {
        
    //     res.status(400).send();
    // });
    try {
        await req.user.removeToken(req.token);
        res.status(200).send();
    } catch(e) {
        res.status(400).send();
    }
})

app.post('/users', async (req,res) => {
    try {
        const body = _.pick(req.body, ['user','email', 'password', 'tokens']);
        const newUser = new user(body);
        await newUser.save();
        const token = await newUser.generateAuthToken();
        res.header('x-auth', token).send(newUser);
    } catch(e) {
        res.status(400).send(e);
    }

    // var newUser = new user( {
    //     email: body.email,
    //     password: body.password,
    //     tokens: body.tokens
    // });
    /*newUser.save().then( () => {
        return newUser.generateAuthToken();
    }).then( (token) => {
        res.header('x-auth', token).send(newUser);
    }).catch((e) => {
        res.status(400).send(e);
    });*/
});


// POST /users/login (email, password)
app.post('/users/login', async (req,res) => {
    const body = _.pick(req.body,'email', 'password');
    try {
        const current = await user.findByCredentials(body.email, body.password);
        const token = await current.generateAuthToken();
        res.header('x-auth', token).status(200).send(current);
    } catch(e) {
        res.status(400).send(e);
    }
    
    /*user.findByCredentials(body.email, body.password).then((current) => {
        // should not be using the user but should use the current
        return current.generateAuthToken().then((token) => {
            res.header('x-auth', token).status(200).send(current);
        });
    }).catch((e)=> {
        res
        .status(400)
        .send(e);
    });*/
});

app.get('/users/me', authenticate, async (req, res) => {
    res.send(req.user);
    // var token = req.header('x-auth');
    // user.findByToken(token).then((user) => {
    //     if (!user) {
    //         return Promise.reject();
    //     }
    //     res.send(user);
    // }).catch((e) => {
    //     res.status(401).send();
    // });
});

// POST /todos
// creates new todos
app.post('/todos', authenticate, async (req, res) => {
    var todo = new Todo( {
        text: req.body.text,
        _creator: req.user._id
    });

    try {
        const doc = await todo.save();
        res.status(200).send(doc);
    } catch(e) {
        res.status(400).send(e);
    }
    /*todo.save().then((doc) => {
        res.status(200).send(doc);

    }, (e)=> {
        res.status(400).send(e);
    });*/
});

// GET /todos
app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    }).then( (todos)=> {
        res.send( { todos });
    }, (e) => {
        res.status(400).send(e);
    });
});

// GET /todos/:id
app.get('/todos/:id', authenticate, async (req,res) => {
    var id = req.params.id;    
    if(!id || !ObjectID.isValid(id)) {
        return res
        .status(404)
        .send();
    }
    try {
        const todo = await Todo.findOne({
            _id: id,
            _creator: req.user._id
        });
        if (!todo) {
            return res.status(404).send('Not a valid id');
        }
        res.status(200).send(todo);
    } catch(e) {
        res.status(400).send(e);
    }
    // Todo.findById(id).
    // then((todo) => {
    //     if (!todo) {
    //         return res.status(404).send('Not a valid id');
    //     }
    //     res.status(200).send(todo);
    // }).catch( (e) => {
    //     res.status(400).send(e);
    // });
    /*Todo.findOne({
        _id: id,
        _creator: req.user._id
    }).
    then((todo) => {
        if (!todo) {
            return res.status(404).send('Not a valid id');
        }
        res.status(200).send(todo);
    }).catch( (e) => {
        res.status(400).send(e);
    });*/
});

// DELETE /todos/:id
app.delete('/todos/:id', authenticate, async (req,res) => {
    var id = req.params.id;
    if(!id || !ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    try {
        var todo = await Todo.findOneAndRemove( {
            _id: id,
            _creator: req.user._id
        });
        if(!todo) {
            return res.status(404).send();
        }
        res.status(200).send({todo});
    } catch(e) {
        res.status(400).send(e);
    }
    /*Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
        if(!todo) {
            return res.status(404).send();
        }
        res.status(200).send({todo});
    }).catch( (e) => {
        res.status(400).send(e);
    });*/
    // findOneAndDelete
    // Todo.findByIdAndRemove(id).then((todo) => {
    //     //console.log('delete ==> ', todo);
    //     if(!todo) {
    //         return res.status(404).send();
    //     }
    //     res.status(200).send({todo});
    // }).catch( (e) => {
    //     res.status(400).send(e);
    // });
});

app.patch('/todos/:id', authenticate, async (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if(!id || !ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    const todo = await Todo.findOneAndUpdate( {
        _id: id,
        _creator: req.user._id
    }, { $set: body } , {new: true});

    try {
        if(!todo) {
            return res.status(404).send();
        }
        res.send({todo});
    } catch(e) {
        res.status(400).send(e);
    }
    // Todo.findByIdAndUpdate(id, { $set: body } , {new: true}).then((todo) => {
    //     if(!todo) {
    //         return res.status(404).send();
    //     }s
    //     res.send({todo});
    // }).catch((e) => {
    //     res.status(400).send(e);
    // });

    /*Todo.findOneAndUpdate( {
        _id: id,
        _creator: req.user._id
    }, { $set: body } , {new: true}).then((todo) => {
        if(!todo) {
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e) => {
        res.status(400).send(e);
    });*/
});

app.listen(port, ()=> {
    console.log(`Start port ${port}`);
});

module.exports = {
    app
}
