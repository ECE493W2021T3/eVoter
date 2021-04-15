'use strict'

const bodyParser = require('body-parser');

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { cors: { origin: '*' } });

// Setup mongoose
require("./startup/mongoose")();

// Router
const pollRouter = require('./routes/poll');
const usersRouter = require('./routes/users');
const responseRouter = require('./routes/response');

/* MIDDLEWARE  */
app.use(bodyParser.json());

// CORS HEADERS MIDDLEWARE
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id");
    res.header(
        'Access-Control-Expose-Headers',
        'x-access-token, x-refresh-token'
    );
    next();
});

// SOCKET MIDDLEWARE
app.use(function(req, res, next) {
    req.io = io;
    next();
});

/* END MIDDLEWARE  */

/* ROUTE HANDLERS */
app.use('/poll', pollRouter);
app.use('/users', usersRouter);
app.use('/response', responseRouter);

const server = http.listen(3000, () => {
    console.log("Server is listening on port 3000");
});

module.exports = server;
