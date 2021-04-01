const express = require("express");
const router = express.Router();
const { Poll, validatePoll } = require('../models');
const { auth } = require('../middleware/auth');
const {ObjectID} = require('mongodb');

// Blockchain Network
const path = require('path');
const fs = require('fs');
let network = require('../services/network');
const configPath = path.join(process.cwd(), './config/config.json');
const configJSON = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(configJSON);
const appAdmin = config.appAdmin;

router.get("/", async (req, res) => {
    res.send("hello front poll router");
});

router.get("/all-hosted", auth, async (req, res) => {
    let election_polls = [];

    // Election Type Go through Blockchain
    let connection = await network.connectToNetwork(req.userID);
    let response = await network.invoke(connection, true, 'queryAllHostedPoll', req.userID);
    let blockchain_polls = await JSON.parse(response);

    blockchain_polls.forEach(function (item, index) {
        let blockchain_poll = item.Record;
        let poll = new Poll({
            _id: ObjectID.createFromHexString(blockchain_poll.pollID),
            title: blockchain_poll.title,
            type: blockchain_poll.pollType,
            host: blockchain_poll.host,
            deadline: blockchain_poll.deadline,
            accessLevel: blockchain_poll.accessLevel,
            isAnonymousModeOn: blockchain_poll.isAnonymousModeOn,
            isHiddenUntilDeadline: blockchain_poll.isHiddenUntilDeadline,
            canVotersSeeResults: blockchain_poll.canVotersSeeResults,
            questions: blockchain_poll.questions
        });
        election_polls.push(poll);
    });

    // Poll Type Go through DB
    let polls = await Poll.find({ host: req.userID }).select("-__v");
    polls = polls.concat(election_polls);

    res.send(polls);
});

router.get("/:id", async (req, res) => {
    // First find in DB
    let poll = await Poll.findById(req.params.id).select("-__v");
    if (!poll) {
        // Otherwise find in Blockchain
        let connection = await network.connectToNetwork(appAdmin);
        let response = await network.invoke(connection, true, 'queryPollById', req.params.id);
        let queryResponse = await JSON.parse(response);
        if (queryResponse.length == 0) {
            // Not found in both DB and Blockchain
            return res.status(404).send("The poll with the given ID was not found.");
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
                questions: blockchain_poll.questions
            });
        }
    }
    res.send(poll);
});

router.post("/", auth, async (req, res) => {

    const { error } = validatePoll(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const poll = new Poll({
        title: req.body.title,
        type: req.body.type,
        host: req.userID,
        deadline: req.body.deadline,
        accessLevel: req.body.accessLevel,
        isAnonymousModeOn: req.body.isAnonymousModeOn,
        isHiddenUntilDeadline: req.body.isHiddenUntilDeadline,
        canVotersSeeResults: req.body.canVotersSeeResults,
        questions: req.body.questions
    });

    if (req.body.type == "Election") {
        let poll_json = poll.toJSON();
        // Save to Blockchain
        let args = {
            pollID: poll_json._id.toString(),
            title: poll_json.title,
            pollType: poll_json.type,
            host: req.userID,
            deadline: poll_json.deadline,
            accessLevel: poll_json.accessLevel,
            isAnonymousModeOn: poll_json.isAnonymousModeOn,
            isHiddenUntilDeadline: poll_json.isHiddenUntilDeadline,
            canVotersSeeResults: poll_json.canVotersSeeResults,
            questions: poll_json.questions
        };
        args = JSON.stringify(args);
        args = [args];

        let connection = await network.connectToNetwork(req.userID);
        let response = await network.invoke(connection, false, 'createPoll', args);
    } else {
        // Save to DB
        await poll.save();
    }
    res.send(poll);
});

router.patch("/:id", async (req, res) => {
    // Find in DB first
    let poll = await Poll.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, { new: true });
    if (!poll){
        // Otherwise find in Blockchain
        let connection = await network.connectToNetwork(appAdmin);
        let response = await network.invoke(connection, true, 'queryPollById', req.params.id);
        let queryResponse = await JSON.parse(response);
        if (queryResponse.length == 0) {
            // Not found in both DB and Blockchain
            return res.status(404).send("The poll with the given ID was not found.");
        } else {
            // found in Blockchain
            let blockchain_poll = queryResponse[0].Record;
            let poll_json = {
                _id: ObjectID.createFromHexString(blockchain_poll.pollID),
                title: blockchain_poll.title,
                type: blockchain_poll.pollType,
                host: blockchain_poll.host,
                deadline: blockchain_poll.deadline,
                accessLevel: blockchain_poll.accessLevel,
                isAnonymousModeOn: blockchain_poll.isAnonymousModeOn,
                isHiddenUntilDeadline: blockchain_poll.isHiddenUntilDeadline,
                canVotersSeeResults: blockchain_poll.canVotersSeeResults,
                questions: blockchain_poll.questions
            }
            
            // update the poll json
            const keys = Object.keys(req.body);
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                poll_json[key] = req.body[key];
            }
            
            // Save to Blockchain
            let args = {
                pollID: poll_json._id.toString(),
                title: poll_json.title,
                pollType: poll_json.type,
                host: poll_json.host,
                deadline: poll_json.deadline,
                accessLevel: poll_json.accessLevel,
                isAnonymousModeOn: poll_json.isAnonymousModeOn,
                isHiddenUntilDeadline: poll_json.isHiddenUntilDeadline,
                canVotersSeeResults: poll_json.canVotersSeeResults,
                questions: poll_json.questions
            };
            args = JSON.stringify(args);
            args = [args];

            let connection = await network.connectToNetwork(poll_json.host);
            let response = await network.invoke(connection, false, 'updatePoll', args);

            poll = new Poll(poll_json);
        }
    }
    res.send(poll);
    res.send(req.param.id);
});

router.post("/:id/voter-assignments", (req, res) =>{
    console.log(req.params.id); // poll id
    console.log(req.body); // voters [ { _id, email } ]
    res.send({ 'message': 'Created successfully' });
});

module.exports = router;
