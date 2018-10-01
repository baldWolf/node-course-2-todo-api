var mongoose = require('mongoose');

var user = mongoose.model('User', {
    user: {
        type: String,
        default: 'unnamed'
    },
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
    }
});

module.exports = {
    user
}

// var newUser = new user( {
//     user: 'user01'
// });

// newUser.save().then((doc) => {
//     console.log(JSON.stringify(doc, undefined, 2));
// }, (err) => {
//     console.log(err);
// });