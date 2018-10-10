var mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        //default: 'NA'
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    },
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        require: true
    }
});

module.exports = {
    Todo
}


// mongoose model

// var newTodo = new Todo( {
//     text: "Fly airplane",
// });

// newTodo.save().then((doc) => {
//     console.log(doc);
// }, (err) => {
//     console.log(err);
// });

// var newTodo2 = new Todo( {
//     text: "Drive Car",
//     completed: true,
//     completedAt: new Date().getTime()
// });

// var newTodo2 = new Todo( {
//     text: 'runner'
// });

// newTodo2.save().then((doc) => {
//     console.log(JSON.stringify(doc, undefined, 2));
// }, (err) => {
//     console.log(err);
// });