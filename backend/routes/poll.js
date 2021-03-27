const express = require("express");
const router = express.Router();
const { Poll, validatePoll } = require('../models');

router.get("/", async (req, res) => {
    res.send("hello front poll router");
});

router.get("/:id", async (req, res) => {
    const poll = await Poll.findById(req.params.id).select("-__v");
    if (!poll)
      return res.status(404).send("The poll with the given ID was not found.");
  
    res.send(poll);
    res.send(req.param.id);
  });

router.post("/", async (req, res) => {

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

  await poll.save();
  res.send(poll);
});

module.exports = router;
