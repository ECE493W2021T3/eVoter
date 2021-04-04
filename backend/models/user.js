const mongoose = require('mongoose');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const config = require('config');
const Joi = require("joi");

/* Models and Schemas */
const questionJoi = Joi.object({ 
    question: Joi.string().min(3).max(255).required(),
    answer: Joi.string().min(3).max(255).required()
})

const userJoi = Joi.object({
    name:Joi.string().min(3).max(255).required(),
    email:Joi.string().email().required(),
    role:Joi.string().required().valid("Voter", "Admin"),
    password:Joi.string().min(8).max(255).required(),
    is2FAEnabled: Joi.boolean().required(),
    confirmed: Joi.boolean().required(),
    confirmationCode: Joi.string().required(),
    securityQuestions: Joi.array().items(questionJoi).required().length(3)
});

const QuestionSchema = new mongoose.Schema({
    question: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 255,
    },
    answer: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 255,
    }
});

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 255,
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        trim: true,
        unique: true
    },
    role: {
        type: String,
        required: true,
        enum: ["Voter", "Admin"],
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    is2FAEnabled: {type: Boolean, required: true},
    confirmed: {type: Boolean, required: true},
    confirmationCode : {type: String, required: true},
    securityQuestions: { 
        type: [QuestionSchema], 
        required: true, 
        validate: {
            validator: v => Array.isArray(v) && v.length == 3, message: 'message "required" failed for path name',
            message: () => "Require 3 security questions."
        }
    },
    sessions: [{
        token: {
            type: String,
            required: true
        },
        expiresAt: {
            type: Number,
            required: true
        }
    }]
});

/* Instance Methods */

// Called when User passed as JSON
UserSchema.methods.toJSON = function () {
    return _.omit(this.toObject(), ['password', 'sessions', '__v']);
}

UserSchema.methods.generateAccessAuthToken = function () {
    return new Promise((resolve, reject) => {
        jwt.sign({ _id: this._id.toHexString() }, config.get('jwtPrivateKey'), { expiresIn: "15m" }, (err, token) => {
            if (err) { return reject(); }
            return resolve(token);
        })
    })
}

UserSchema.methods.generateRefreshAuthToken = function () {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(64, (err, buf) => {
            if (err) { reject(); }
            return resolve(buf.toString('hex'));
        })
    })
}

UserSchema.methods.createSession = function () {
    let user = this;
    return user.generateRefreshAuthToken().then((refreshToken) => {
        return saveSessionToDatabase(user, refreshToken);
    })
    .catch((e) => {
        return Promise.reject('Failed to save session to database.\n' + e);
    })
}

/* MODEL METHODS (static methods) */

UserSchema.statics.findSessionToken = function (_id, token) {
    return this.findOne({
        _id,
        'sessions.token': token
    });
}

UserSchema.statics.findByCredentials = function (email, password) {

    return this.findOne({ email }).then((user) => {

        if (!user) return Promise.reject("User not found");

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) { resolve(user); }
                reject("Invalid password");
            })
        })
    })
}

UserSchema.statics.hasRefreshTokenExpired = (expiresAt) => {
    let now = Date.now() / 1000;
    if (expiresAt > now) { return false; }
    return true;
}

/* MIDDLEWARE */
// Before a user document is saved, this code runs
UserSchema.pre('save', function (next) {
    var user = this;

    // Only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
});

/* HELPER METHODS */

function validateUser(user) {
    return userJoi.validate(user);
}

let generateRefreshTokenExpiryTime = () => {
    // 864000 = 10 * 24 * 60 * 60;  => seconds in 10 days
    return ((Date.now() / 1000) + 864000);
}

let saveSessionToDatabase = (user, refreshToken) => {
    // Save session to database
    return new Promise((resolve, reject) => {
        user.sessions.push({ 'token': refreshToken, 'expiresAt':generateRefreshTokenExpiryTime() });
        user.save().then(() => {
            return resolve(refreshToken);
        }).catch((e) => {
            reject(e);
        });
    })
}

const User = mongoose.model('User', UserSchema);

exports.User = User;
exports.validateUser = validateUser;
