const Joi = require("joi");
Joi.objectId = require('joi-objectid')(Joi)
const mongoose = require("mongoose");


const VoterAssignmentSchema = new mongoose.Schema({
    pollID: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 255,
      ref: 'Poll'
    },
    userID: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 255,
        ref: 'User'
    },
});

VoterAssignmentSchema.index({ pollID: 1, userID: -1 } , { unique: true });

const VoterAssignmentJoi = Joi.object({
    pollID:Joi.required(),
    userID:Joi.required(),
});
  
function validateVoterAssignment(assign) {
    return VoterAssignmentJoi.validate(assign);
}

const VoterAssignment = mongoose.model("voter-assignment", VoterAssignmentSchema);


exports.VoterAssignment = VoterAssignment;
exports.validateVoterAssignment = validateVoterAssignment;
