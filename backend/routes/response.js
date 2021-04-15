const express = require("express");
const router = express.Router();
const { Poll, PollType, Response, validateResponse } = require('../models');
const { auth } = require('../middleware/auth');
const {ObjectID} = require('mongodb');
const Joi = require("joi");

// Blockchain Network
const path = require('path');
const fs = require('fs');
let network = require('../services/network');
const configPath = path.join(process.cwd(), './config/config.json');
const configJSON = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(configJSON);
const appAdmin = config.appAdmin;


/**
 * GET /response/:id
 * Purpose: get response
 * Return: Response
 */
 router.get("/:id", auth, async (req, res) => {
    const { error } = Joi.object({ responseID: Joi.required() }).validate({ responseID: req.params.id });
    if (error) return res.status(400).send("Invalid Response ID");

    let response = await Response.findById(req.params.id).select("-__v");
    if (!response) {
        // Response not found in DB, try find in Blockchain
        let connection = await network.connectToNetwork(req.userID);
        let invoke_response = await network.invoke(connection, true, 'queryResponseById', req.params.id);
        let queryResponse = await JSON.parse(invoke_response);
        if (queryResponse.length == 0) {
            // Not found in both DB and Blockchain
            return res.status(404).send("Could not find Response with ID provided");
        } else {
            // found in Blockchain
            let blockchain_response = queryResponse[0].Record;
            response = new Response({
                _id: ObjectID.createFromHexString(blockchain_response.responseID),
                pollID: blockchain_response.pollID,
                voterID: blockchain_response.voterID,
                answers: blockchain_response.answers,
            });
        }
    }    
    return res.send(response)

});


/**
 * PATCH /response/:id
 * Purpose: updates survey responses
 * Return: [Polls]
 */
 router.patch("/:id", auth, async (req, res) => {

    const { error } = Joi.object({ responseID: Joi.required() }).validate({ responseID: req.params.id });
    if (error) return res.status(400).send("Invalid Response ID");

    let response = await Response.findOneAndUpdate(
        { 
            _id: req.params.id, 
        },
        {
            $set: { answers: req.body.answers },
        } 
    );

    if (!response)  return res.status(404).send("Could not find Response with ID provided");

    req.io.emit('updateCharts', response.pollID);

    return res.send({responseID: response._id})
});


/**
 * POST /response/
 * Purpose: post a Response
 * Return: {responseID: response._id}
 */
 router.post("/", auth, async (req, res) => {
    let body = req.body
    body.voterID = req.userID;

    const { error } = validateResponse(body);
    if (error) return res.status(400).send(error.details[0].message);

    let poll = await Poll.findById(req.body.pollID).select("-_id type");
    if (!poll) {
        // Poll not found in DB, try find in Blockchain
        let connection = await network.connectToNetwork(req.userID);
        let invoke_response = await network.invoke(connection, true, 'queryPollById', req.body.pollID);
        let queryResponse = await JSON.parse(invoke_response);
        if (queryResponse.length == 0) {
            // Not found in both DB and Blockchain
            return res.status(404).send("Invalid Poll ID provided.");
        } else {
            // found in Blockchain
            let blockchain_poll = queryResponse[0].Record;
            poll = new Poll({
                _id: ObjectID.createFromHexString(blockchain_poll.pollID),
                title: blockchain_poll.title,
                type: blockchain_poll.pollType,
                host: blockchain_poll.host,
                deadline: blockchain_poll.deadline,
                accessLevel: blockchain_poll.accessLevel,
                isAnonymousModeOn: blockchain_poll.isAnonymousModeOn,
                isHiddenUntilDeadline: blockchain_poll.isHiddenUntilDeadline,
                canVotersSeeResults: blockchain_poll.canVotersSeeResults,
                questions: blockchain_poll.questions,
                accessCode: blockchain_poll.accessCode
            });
        }
    }
    

    if (poll.type == PollType.survey) {
        let previousReponse = await Response.findOne({pollID:body.pollID, voterID:body.voterID})
        if (previousReponse) return res.status(404).send("Response exists.");

        let response = new Response(body);
        await response.save().catch((e) => { res.status(400).send(e); });
        res.send({responseID: response._id});
    } else if (poll.type == PollType.election) {
        // save Response for Election Poll to Blockchain
        let response = new Response(body);
        let response_json = response.toJSON();
        // Save to Blockchain
        let args = {
            responseID: response_json._id.toString(),
            pollID: response_json.pollID,
            voterID: response_json.voterID,
            answers: response_json.answers,
        };
        args = JSON.stringify(args);
        args = [args];

        let connection = await network.connectToNetwork(req.userID);
        let invoke_response = await network.invoke(connection, false, 'createResponse', args);

        res.send({responseID: response._id});
    } else {
        return res.status(404).send("Invalid Poll Type.");
    }

    req.io.emit('updateCharts', poll._id);
});

module.exports = router;