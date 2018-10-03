
const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {user} = require('./../server/models/user');
//var id = '5bb3626b6e3ada1d20fafc6a';

// if (!ObjectID.isValid(id)) {
//     console.log('Id not valid!');
// }else{
//     console.log('Id is valid');
// }

// todo
//var id = '6bb3626b6e3ada1d20fafc6b';

// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos', todos);
// });

// Todo.findOne({
//     _id: id
// }).then((todos) =>{
//     console.log('Todos', todos);
// });

// Todo.findById(id).then((todo)=> {

//     if (!todo) {
//         return console.log('id not found');
//     }

//     console.log('Todo', todo);
// }).catch((e) => {
//     console.log(e);
// });

// user test
var userId = '5bb1b3155c446c49d8d040d6';

user.find({
    _id: userId
}).then((users) => {
    console.log('find user', users);
});

user.findOne({
    _id: userId
}).then((users) =>{
    console.log('find one', users);
});

user.findById(userId).then((user)=> {

    if (!user) {
        return console.log('id not found');
    }

    console.log('find by Id', user);
}).catch((e) => {
    console.log(e);
});