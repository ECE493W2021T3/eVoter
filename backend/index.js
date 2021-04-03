'use strict'

const bodyParser = require('body-parser');

const express = require('express');
const app = express();

// Setup mongoose
require("./startup/mongoose")();

// Router
const pollRouter = require('./routes/poll');
const usersRouter = require('./routes/users');
const responseRouter = require('./routes/response');
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
app.use('/response', responseRouter);

/**
 * POST /response
 * Purpose: creates a new response
 */
app.post('/response', (req, res) => {
    console.log(req.body);
    res.send({ 'responseID': 'responseID' }); // send new response id to client
});

/**
 * PATCH /response/:id
 * Purpose: updates a response
 */
 app.patch('/response/:id', (req, res) => {
    console.log(req.params.id);
    console.log(req.body);
    res.send({ 'message': 'updated successfully' });
});

/**
 * GET /response/:id
 * Purpose: gets a response by id
 */
app.get('/response/:id', (req, res) => {
    // hardcoded for frontend testing
    let response = {
        _id: "responseID1",
        pollID: "surveypollid",
        voterID: "voterID",
        answers: [
            { questionID: "id1", answer: "test" },
            { questionID: "id2", answer: "option 1" },
            { questionID: "id3", answer: "option2" },
            { questionID: "id4", answer: "something" }
        ]
    };

    res.send(response);
});

app.listen(3000, () => {
    console.log("Server is listening on port 3000");
})
