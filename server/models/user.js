const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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

UserSchema.statics.findByToken = function(token) {
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token, 'abc123');
    } catch(e) {
        // return new Promise((resolve, reject) => {
        //     reject();
        // });
        // or
        return Promise.reject();
    }

    return User.findOne( {
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

// called before the save() function
UserSchema.pre('save', function(next) {
    var user = this;
    var password = user.password;

    if ( user.isModified('password')) {

        bcrypt.genSalt(10, (err, salt)=> {
            bcrypt.hash(password, salt, (err, hash) => {
                //console.log(hash);
                user.password = hash;
                next();
            });
        });
        
    } else {
        next();
    }
});

UserSchema.statics.findByCredentials = function(email,password) {
    var user = this;
    
    return user.findOne({'email': email}).then((current) => {
        if (!current) {
            return Promise.reject();
        }

        return new Promise((resolve,reject)=> {
            bcrypt.compare(password, current.password, (err,res) => {
                console.log('password: ', password);
                console.log('hashed password', current.password);
                console.log(res);
                if( res ) {
                    resolve(current);
                } else {
                    reject();
                }
            });
        });
    })
};

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

    //user.tokens.push( {access, token});
    user.tokens.concat({access, token});

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