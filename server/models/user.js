const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
    user: {
        type: String,
        default: 'unnamed'
    },
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            // validator: (value) => {
            //     return validator.isEmail(value);
            // },
            // or
            validator: validator.isEmail,
            message: '{VALUE} ist not a valid email'
        }
       },
    password: {
        type: String, 
        required: true,
        minlength: 12
    },
    tokens: [{
        access: {
            type: String, 
            require: true,
        },
        token: {
            type: String,
            required: true
        }
    }]
});

// overrides the toJSON
UserSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function() {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({ _id: user._id.toHexString(), access}, 'abc123').toString();

    user.tokens.push( {access, token});
    //user.tokens.concat({access, token});

    return user.save().then(() => {
        return token;
    });
};

var user = mongoose.model('User', UserSchema );

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