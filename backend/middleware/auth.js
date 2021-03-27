const jwt = require("jsonwebtoken");
const config = require('config');

// check whether the request has a valid JWT access token
function auth(req, res, next) {

    // verify the JWT
    jwt.verify(req.header('x-access-token'), config.get('jwtPrivateKey'), (err, decoded) => {
        if (err) {
            // there was an error
            // jwt is invalid - * DO NOT AUTHENTICATE * 
            res.status(401).send(err);
        } else {
            // jwt is valid
            req.userID = decoded._id;
            next();
        }
    });
}

module.exports = {auth};
