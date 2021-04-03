const express = require("express");
const router = express.Router();
const { Poll, PollType, Response, validateResponse } = require('../models');
const { auth } = require('../middleware/auth');
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
    const { error } = Joi.object({ responseID: Joi.objectId().required() }).validate({ responseID: req.params.id });
    if (error) return res.status(400).send("Invalid Response ID");

    let response = await Response.findById(req.params.id).select("-__v");
    if (!response) return res.status(404).send("Could not find Reponse with ID provided");

    return res.send(response)

});
/**
 * PATCH /response/:id
 * Purpose: updates survey responses
 * Return: [Polls]
 */
 router.patch("/:id", auth, async (req, res) => {

    const { error } = Joi.object({ responseID: Joi.objectId().required() }).validate({ responseID: req.params.id });
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
    /**
     * Blockchain search for poll
     */
    if (!poll) return res.status(404).send("Invalid Poll ID provided.");

    if (poll.type == PollType.survey) {
        let previousReponse = await Response.findOne({pollID:body.pollID, voterID:body.voterID})
        if (previousReponse) return res.status(404).send("Response exists.");

        let response = new Response(body);
        await response.save().catch((e) => { res.status(400).send(e); });
        return res.send({responseID: response._id});
    }

    /**
     * Blockchain save
     */
        
});

module.exports = router;