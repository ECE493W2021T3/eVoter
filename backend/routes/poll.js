const express = require("express");
const router = express.Router();
const { Poll, validatePoll, VoterAssignment, validateVoterAssignment, Response, User } = require('../models');
const { auth } = require('../middleware/auth');
const {ObjectID} = require('mongodb');
const { sendPollAssignmentEmail } =require("../services/mailer");

const Joi = require("joi");
const _ = require('lodash');
// Blockchain Network
const path = require('path');
const fs = require('fs');
const network = require('../services/network');
const configPath = path.join(process.cwd(), './config/config.json');
const configJSON = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(configJSON);
const appAdmin = config.appAdmin;

/**
 * GET /poll/all-hosted
 * Purpose: For admin to get all hosted polls
 * Return: [Polls]
 */
router.get("/all-hosted", auth, async (req, res) => {
    let election_polls = [];

    // Election Type Go through Blockchain
    let connection = await network.connectToNetwork(req.userID);
    let invoke_response = await network.invoke(connection, true, 'queryAllHostedPoll', req.userID);
    let blockchain_polls = await JSON.parse(invoke_response);

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

/**
 * GET /poll/all-invited
 * Purpose: For users to get all invited polls
 * Return: [Polls]
 */
router.get("/all-invited", auth, async (req, res) => {
    const polls = await VoterAssignment.find({ userID: req.userID }).populate('pollID');
    let results = await Promise.all(polls.map(async ele => {
        
        let poll = ele.pollID
        if(!poll) {
            /**
             * Blockchain find Poll
             */
            return null
        };
        let response = null;
        try {
            response = await Response.findOne({pollID: poll._id, voterID:req.userID});
        } catch(err) {
            console.log(err); //If err, keep null.
        }
        const model ={
            poll: poll, 
            responseID: response ? response._id : null
        }
         return model
    }));
    results= results.filter(ele => ele);
    res.send(results);
});


/**
 * GET /poll/<:id>/poll-results
 * Purpose: Get poll result
 * Return: Result
 */
router.get("/:id/poll-results", auth, async (req, res) => {

    const { error } = Joi.object({ responseID: Joi.objectId().required() }).validate({ responseID: req.params.id });
    if (error) return res.status(400).send("Invalid Post ID");

    let poll = await Poll.findById(req.params.id);
    /**
     * BlockChain: find Poll
     */
    if (!poll) return res.status(404).send("The poll with the given ID was not found.");

    if(poll.isHiddenUntilDeadline){
        if (Date.now() < Date.parse(poll.deadline))
        res.status(401).send("Poll not ready yet");
    }

    if (!poll.canVotersSeeResults && (poll.host != req.userID)) {
        res.status(403).send("Results for Host only");
    }
    let responses = await Response
                    .find({pollID : req.params.id})
                    .populate("voterID");
    if (!responses){
        /**
         * BlockChain: find responses
         */
    }

    let questions = {}; //create dictionary for further processing
    poll.questions.forEach( question =>{
        const model = {
            _id: question._id,
            type: question.type,
            question: question.question,
            choices: {},
            answers: []
        };
        questions[question._id] = model;
    })

    responses.forEach(response =>{
        response.answers.forEach( answer => {
            // collect answers
            questions[answer.questionID].answers.push(answer.answer);
        })
    });

    // count anawers
    // Note: even short answers are counted
    questions = Object.values(questions).map(question => {
        question['choices'] = _.countBy(question.answers);
        return question;
    });
    // Extract Voter from User
    let voted = responses.map(
        x => {
            return {
                responseID: x.id,
                userID: poll.isAnonymousModeOn ? null : x.voterID._id,
                name:   poll.isAnonymousModeOn ? null : x.voterID.name,
                email:  poll.isAnonymousModeOn ? null : x.voterID.email
            };
        }
    );

    const result = {
        pollID: poll._id,
        questions: questions,
        voted: voted
    }
    res.send(result);
});

/**
 * GET /poll/<:id>
 * Purpose: Get one poll by ID
 * Return: Poll
 */
router.get("/:id", auth, async (req, res) => {
    // First find in DB
    let poll = await Poll.findById(req.params.id).select("-__v");
    if (!poll) {
        // Otherwise find in Blockchain
        let connection = await network.connectToNetwork(req.userID);
        let invoke_response = await network.invoke(connection, true, 'queryPollById', req.params.id);
        let queryResponse = await JSON.parse(invoke_response);
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

/**
 * POST /poll/
 * Purpose: Posts a Poll
 * Return: Poll
 */
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
        let invoke_response = await network.invoke(connection, false, 'createPoll', args);
    } else {
        // Save to DB
        await poll.save();
    }
    res.send(poll);
});

/**
 * POST /poll/<:id>
 * Purpose: Update Poll
 * Return: Poll
 */
router.patch("/:id", auth, async (req, res) => {
    // Find in DB first
    let poll = await Poll.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, { new: true });
    if (!poll){
        // Otherwise find in Blockchain
        let connection = await network.connectToNetwork(req.userID);
        let invoke_response = await network.invoke(connection, true, 'queryPollById', req.params.id);
        let queryResponse = await JSON.parse(invoke_response);
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

            let connection = await network.connectToNetwork(req.userID);
            let invoke_response = await network.invoke(connection, false, 'updatePoll', args);

            poll = new Poll(poll_json);
        }
    }
    res.send(poll);
    res.send(req.param.id);
});


/**
 * POST /poll/<id>/voter-assignments
 * Purpose: Assign Voters to a Poll indicate by <id>
 * Return: Message
 */
router.post("/:id/voter-assignments", auth, async (req, res) =>{

    const assignments = req.body.map( entry =>
        {
            return {pollID: req.params.id,
                    userID: entry._id}
        }
    );

    for (var i = 0; i < assignments.length; i++) {
        const { error } = validateVoterAssignment(assignments[i]);
        if (error)  {
            res.status(400).send(error.message);
            return;
        }
    }

    VoterAssignment.insertMany(assignments)
    .then(async function(mongooseDocuments) {
        // send poll assignment invitation email
        for (var i = 0; i < assignments.length; i++) {
            let user = await User.findOne({ _id: assignments[i].userID }).select("-__v");
            let poll = await Poll.findOne({ _id: assignments[i].pollID }).select();
            if (!poll) {
                // Otherwise find in Blockchain
                let connection = await network.connectToNetwork(req.userID);
                let invoke_response = await network.invoke(connection, true, 'queryPollById', req.params.id);
                let queryResponse = await JSON.parse(invoke_response);
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
            let userEmail = user.email;
            let userName = user.name;
            let pollTitle = poll.title;
            let pollType = poll.type;
            sendPollAssignmentEmail(userEmail, userName, pollTitle, pollType);
        }
        res.status(200).send({ 'message': 'Voters assigned successfully'});
    })
    .catch(function(err) {
        res.status(400).send(err.message);
    });

});

/**
 * Get /poll/<id>/voter-assignments
 * Purpose: Get assigned voters to a Poll indicate by <id>
 * Return: Voters
 */
router.get("/:id/voter-assignments", auth, async (req, res) =>{
    let users = await VoterAssignment.find({ pollID: req.params.id }).populate('userID');
    users = users.map(
        user => {
            return (({ _id, email }) => ({ _id, email }))(user.userID);
        }
    );
    res.send(users);
});

module.exports = router;
