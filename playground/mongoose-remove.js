const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result) => {
//     console.log(result);
// });

// Todo.deleteMany({}).then((result) => {
//     console.log(result);
// });


// Todo.findByIdAndRemove('5bb5abb1b008f02ec8ae63a8').then((Todo) => {
//     console.log(todo);
// });


//findOneAndUpdate, findOneAndReplace or findOneAndDelete
Todo.findOneAndDelete('5bb5acadcf96bc528ccfcdce').then((todo) => {
    console.log(todo);
});