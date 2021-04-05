'use strict';

class Poll {
    /**
     * Constructor for a Poll object. (Election type Poll only)
     * @param {*} ctx
     * @param {*} pollID
     * @param {*} title
     * @param {*} host
     * @param {*} pollType
     * @param {*} deadline
     * @param {*} accessLevel
     * @param {*} isAnonymousModeOn
     * @param {*} isHiddenUntilDeadline
     * @param {*} canVotersSeeResults
     * @param {*} questions
     * @param {*} accessCode
     * @returns Poll
     */
    constructor(ctx, pollID,
        title, host, pollType, deadline, accessLevel,
        isAnonymousModeOn, isHiddenUntilDeadline, canVotersSeeResults,
        questions, accessCode) {
        this.pollID = pollID;
        this.title = title;
        this.host = host;
        this.pollType = pollType;
        this.deadline = deadline;
        this.accessLevel = accessLevel;
        this.isAnonymousModeOn = isAnonymousModeOn;
        this.isHiddenUntilDeadline = isHiddenUntilDeadline;
        this.canVotersSeeResults = canVotersSeeResults;
        this.questions = questions;
        this.accessCode = accessCode;

        this.type = 'poll';
        if (this.__isContract) {
            delete this.__isContract;
        }

        if (this.validatePoll(ctx)) {
            return this;
        } else {
            console.log('This pollID already exist');
            throw new Error('This pollID already exist');
        }
    }

    async validatePoll(ctx) {
        const buffer = await ctx.stub.getState(this.pollID);
        if (!!buffer && buffer.length > 0) {
            return false;
        } else {
            return true;
        }
    }
}

module.exports = Poll;
