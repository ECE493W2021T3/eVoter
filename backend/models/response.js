const Joi = require("joi");
const mongoose = require("mongoose");

Answer = new mongoose.Schema({
  questionID: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 255,
  },
  answer: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 255,
  }
},{ _id : false });


const ResponseSchema = new mongoose.Schema({
  pollID: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 255,
    ref: 'Poll'
  },
  voterID: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 255,
      ref: 'User'
  },
  answers: { 
    type: [Answer], 
    required: true, 
    validate: v => Array.isArray(v) && v.length > 0 
  }
});

const answerJoi = Joi.object({ 
  questionID: Joi.required(),
  answer: Joi.string().min(1).max(255).required()
})

const responseJoi = Joi.object({
  pollID:Joi.required(),
  voterID:Joi.required(),
  answers: Joi.array().items(answerJoi).required().min(1)
});

const Response = mongoose.model("Response",ResponseSchema);

function validateResponse(response) {
  return responseJoi.validate(response);
}
exports.Response = Response;
exports.validateResponse = validateResponse;
