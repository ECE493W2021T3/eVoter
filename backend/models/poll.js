const Joi = require("joi");
const mongoose = require("mongoose");
var Enum = require('enum');

function validateChoices (v){
  console.log(this.type); 
  return (this.type === "Multiple Choice" && Array.isArray(v) && v.length > 0) || this.type !== "Multiple Choice" 
}

Question = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["Short Answer", "Multiple Choice"],
    trim: true,
    minlength: 3,
    maxlength: 255,
  },
  question: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 255,
  },
  choices: { type: [String], 
    required: function() { return this.type === "Multiple Choice";}, 
    validate: validateChoices
  }
});

const Poll = mongoose.model("Poll",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 255,
    },
    host: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 255,
    },
    type: {
      type: String,
      required: true,
      enum: ["Survey", "Election"],
      trim: true,
      minlength: 3,
      maxlength: 255,
    },
    deadline: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 255,
    },
    accessLevel: {
      type: String,
      required: true,
      enum: ["Private", "Public", "Invite Only"],
      trim: true,
      minlength: 3,
      maxlength: 255,
    },
    isAnonymousModeOn: {type: Boolean, required: true},
    isHiddenUntilDeadline: {type: Boolean, required: true},
    canVotersSeeResults: {type: Boolean, required: true},
    questions: { type: [Question], required: true, validate: v => Array.isArray(v) && v.length > 0 },
    accessCode: {type: String, required: false}
  })
);

const questionSchema = Joi.object({ 
  type: Joi.string().required().valid("Short Answer", "Multiple Choice"), 
  question: Joi.string().min(3).max(255).required(),
  choices: Joi.array().items(Joi.string()).when('type', { is: Joi.valid("Multiple Choice"), then: Joi.required(), otherwise: Joi.optional() })
})

const pollSchema = Joi.object({
  title:Joi.string().min(3).max(255).required(),
  type:Joi.string().required().valid("Survey", "Election"),
  deadline:Joi.date().min("now").required(),
  accessLevel:Joi.string().required().valid("Private", "Public", "Invite Only"),
  isAnonymousModeOn: Joi.boolean().required(),
  isHiddenUntilDeadline: Joi.boolean().required(),
  canVotersSeeResults: Joi.boolean().required(),
  questions: Joi.array().items(questionSchema).required().min(1),
  accessCode: Joi.string()
});

function validatePoll(poll) {
  return pollSchema.validate(poll);
}
exports.Poll = Poll;
exports.validatePoll = validatePoll;
exports.PollType = new Enum({survey: 'Survey', election: 'Election'});
