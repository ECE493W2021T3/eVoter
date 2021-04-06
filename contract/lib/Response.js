'use strict';

class Response {
    /**
     * Constructor for a Response object. (Response to election type poll only)
     * @param {*} ctx
     * @param {*} responseID
     * @param {*} pollID
     * @param {*} voterID
     * @param {*} answers
     * @returns Response
     */
    constructor(ctx, responseID,
        pollID, voterID, answers) {
        this.responseID = responseID;
        this.pollID = pollID;
        this.voterID = voterID;
        this.answers = answers;

        this.type = 'response';
        if (this.__isContract) {
            delete this.__isContract;
        }

        return this;
    }

    /**
     * Validate if the Response already exist, or if the poll does not exist.
     * @param {*} ctx
     * @returns error_code: 0: no error, 1: response already exist, 2: poll does not exist on blockchain
     */
    async validateNewResponse(ctx) {
        // the response should not already exist.
        let buffer = await ctx.stub.getState(this.responseID);
        if (!!buffer && buffer.length > 0) {
            return 1;
        }
        // the survey poll should exist on blockchain
        buffer = await ctx.stub.getState(this.pollID);
        if (!!buffer && buffer.length > 0) {
            return 0;
        } else {
            return 2;
        }
    }
}

module.exports = Response;
