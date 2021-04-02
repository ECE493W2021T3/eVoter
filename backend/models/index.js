const { User } = require('./user');
const { Poll, validatePoll } = require('./poll');
const { VoterAssignment, validateVoterAssignment } = require('./voter-assignment');

module.exports = {
    User,
    Poll,
    validatePoll,
    VoterAssignment,
    validateVoterAssignment
}
