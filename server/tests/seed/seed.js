const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo');
const {user} = require('./../../models/user');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
    _id: userOneId,
    email: 'test134141@example.com',
    password: 'motherboar134141432d1234',
    tokens: [{
        access: 'auth',
        token: jwt.sign({ _id: userOneId, access: 'auth'}, 'abc123').toString()
    }]
}, {
    _id: userTwoId,
    email: 'ram1234421@example.com',
    password: 'ram123412341241245b',
    tokens: [{
        access: 'auth',
        token: jwt.sign({ _id: userTwoId, access: 'auth'}, 'abc123').toString()
    }]
}];

const todos = [ {
    _id: new ObjectID(),
    text: 'First todo',
    _creator: userOneId
},{
    _id: new ObjectID(),
    text: 'Second todo',
    completed: true,
    completedAt: 333,
    _creator: userTwoId
}]

const populateUsers = (done) => {
    user.remove({}).then( () => {
        var userOne = new user(users[0]).save();
        var userTwo = new user(users[1]).save();

        // waits the userOne and userTwo to be saved in the database
        Promise.all([userOne, userTwo]).then(()=> {
            done();
        });
    });
};


const populateTodos = (done)=> {
    Todo.remove({}).then( ()=> {
        return Todo.insertMany( todos );
    }).then( () => done()); 
};

module.exports = {todos, populateTodos, users, populateUsers};