'use strict'

const bodyParser = require('body-parser');

const express = require('express');
const app = express();

// Setup mongoose
require("./startup/mongoose")();

// Router
const pollRouter = require('./routes/poll');
const usersRouter = require('./routes/users');
const blockchainRouter = require('./routes/blockchain');

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

/* END MIDDLEWARE  */

/* ROUTE HANDLERS */
app.use('/poll', pollRouter);
app.use('/users', usersRouter);
app.use('/blockchain', blockchainRouter);

/**
 * POST /poll
 * Purpose: creates a new poll
 */
app.post('/poll', (req, res) => {
    console.log(req.body);
    res.send({ 'message': 'updated successfully' });
})

app.listen(3000, () => {
    console.log("Server is listening on port 3000");
})
