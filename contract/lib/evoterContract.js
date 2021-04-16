/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

// import models
let Poll = require('./Poll.js');
let Response = require('./Response.js');

class MyAssetContract extends Contract {

    async myAssetExists(ctx, myAssetId) {
        const buffer = await ctx.stub.getState(myAssetId);
        return (!!buffer && buffer.length > 0);
    }

    async createMyAsset(ctx, myAssetId, value) {
        const exists = await this.myAssetExists(ctx, myAssetId);
        if (exists) {
            throw new Error(`The my asset ${myAssetId} already exists`);
        }
        const asset = { value };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(myAssetId, buffer);
    }

    async readMyAsset(ctx, myAssetId) {
        const exists = await this.myAssetExists(ctx, myAssetId);
        if (!exists) {
            throw new Error(`The my asset ${myAssetId} does not exist`);
        }
        const buffer = await ctx.stub.getState(myAssetId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    async updateMyAsset(ctx, myAssetId, newValue) {
        const exists = await this.myAssetExists(ctx, myAssetId);
        if (!exists) {
            throw new Error(`The my asset ${myAssetId} does not exist`);
        }
        const asset = { value: newValue };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(myAssetId, buffer);
    }

    async deleteMyAsset(ctx, myAssetId) {
        const exists = await this.myAssetExists(ctx, myAssetId);
        if (!exists) {
            throw new Error(`The my asset ${myAssetId} does not exist`);
        }
        await ctx.stub.deleteState(myAssetId);
    }

    // ------Start of Query Helper Methods------

    /**
     * Reference: https://github.com/IBM/Blockchain-for-maintaining-Digital-Assets/blob/master/contract/lib/digital-asset-contract.js
     * Query and return all key value pairs assets in the world state.
     * @param {*} ctx
     * @returns
     */
    async queryAll(ctx) {
        let response = {};

        let queryString = {
            selector: {}
        };

        response = await this.queryWithQueryString(ctx, JSON.stringify(queryString));
        return response;
    }

    /**
     * Reference: https://github.com/IBM/Blockchain-for-maintaining-Digital-Assets/blob/master/contract/lib/digital-asset-contract.js
     * queryWithQueryString
     *
     * Evaluate a queryString
     *
     * @param {Context} ctx the transaction context
     * @param {String} queryString the query string to be evaluated
     *
     * @returns - the result of the query string
    */
    async queryWithQueryString(ctx, queryString) {
        let resultsIterator = await ctx.stub.getQueryResult(queryString);

        let allResults = [];

        // eslint-disable-next-line no-constant-condition
        while (true) {
            let res = await resultsIterator.next();

            if (res.value && res.value.value.toString()) {
                let jsonRes = {};

                jsonRes.Key = res.value.key;

                try {
                    jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    jsonRes.Record = res.value.value.toString('utf8');
                }

                allResults.push(jsonRes);
            }
            if (res.done) {
                await resultsIterator.close();
                return JSON.stringify(allResults);
            }
        }
    }

    /**
     * Query by the object type field, value should be: poll, response
     * @param {*} ctx
     * @param {*} objectType value should be: poll, response
     * @returns
     */
    async queryByObjectType(ctx, objectType) {
        let response = {};

        let queryString = {
            selector: {
                type: objectType
            }
        };

        response = await this.queryWithQueryString(ctx, JSON.stringify(queryString));
        return response;
    }

    // ------End of Query Helper Methods------

    // ------Start of Poll Methods------

    /**
     * backend route: GET /poll/all-hosted
     * Get all the polls (elections) hosted by host
     * @param {*} ctx
     * @param {*} host id of the host of the poll
     * @returns polls
     */
    async queryAllHostedPoll(ctx, host) {
        let queryString = {
            selector: {
                type: 'poll',
                host: host
            }
        };
        let queryResults = await this.queryWithQueryString(ctx, JSON.stringify(queryString));
        return queryResults;
    }

    /**
     * backend route: GET /poll/:id
     * Get all the poll by pollID
     * @param {*} ctx
     * @param {*} pollID
     * @returns poll
     */
    async queryPollById(ctx, pollID) {
        let queryString = {
            selector: {
                type: 'poll',
                pollID: pollID
            }
        };
        let queryResults = await this.queryWithQueryString(ctx, JSON.stringify(queryString));
        return queryResults;
    }

    /**
     * backend route: GET /poll/:accessCode
     * Get all the poll by accessCode
     * @param {*} ctx
     * @param {*} accessCode
     * @returns poll
     */
    async queryPollByAccessCode(ctx, accessCode) {
        let queryString = {
            selector: {
                type: 'poll',
                accessCode: accessCode
            }
        };
        let queryResults = await this.queryWithQueryString(ctx, JSON.stringify(queryString));
        return queryResults;
    }

    /**
     * backend route: POST /poll/
     * Create Poll
     * @param {*} ctx
     * @param {*} args
     * @returns poll
     */
    async createPoll(ctx, args) {
        args = JSON.parse(args);
        let poll = await new Poll(ctx, args.pollID, args.title, args.host, args.pollType,
            args.deadline, args.accessLevel, args.isAnonymousModeOn, args.isHiddenUntilDeadline,
            args.canVotersSeeResults, args.questions, args.accessCode);

        let validated = await poll.validateNewPoll(ctx);
        if (validated) {
            await ctx.stub.putState(args.pollID, Buffer.from(JSON.stringify(poll)));
            return poll;
        } else {
            console.log('This pollID already exist');
            throw new Error('This pollID already exist');
        }
    }

    /**
     * backend route: PATCH /poll/:id
     * Update Poll of args.pollID
     * @param {*} ctx
     * @param {*} args
     * @returns poll
     */
    async updatePoll(ctx, args) {
        args = JSON.parse(args);
        const exists = await this.myAssetExists(ctx, args.pollID);
        if (!exists) {
            throw new Error(`The pollID ${args.pollID} does not exist`);
        } else {
            let poll = await new Poll(ctx, args.pollID, args.title, args.host, args.pollType,
                args.deadline, args.accessLevel, args.isAnonymousModeOn, args.isHiddenUntilDeadline,
                args.canVotersSeeResults, args.questions, args.accessCode);

            let validated = await poll.validateUpdatePoll(ctx);
            if (validated) {
                await ctx.stub.putState(args.pollID, Buffer.from(JSON.stringify(poll)));
                return poll;
            } else {
                console.log('This pollID does not exist');
                throw new Error('This pollID does not exist');
            }
        }
    }

    // ------End of Poll Methods------

    // ------Start of Response Methods------

    /**
     * backend route: GET /response/:id
     * Get the response with responseID
     * @param {*} ctx
     * @param {*} responseID
     * @returns response
     */
    async queryResponseById(ctx, responseID) {
        let queryString = {
            selector: {
                type: 'response',
                responseID: responseID
            }
        };
        let queryResults = await this.queryWithQueryString(ctx, JSON.stringify(queryString));
        return queryResults;
    }

    /**
     * backend route: GET /poll/all-invited
     * Query Response
     * @param {*} ctx
     * @param {*} args
     * @returns response
     */
    async queryResponseByArgs(ctx, args) {
        args = JSON.parse(args);

        let queryString = {
            selector: {
                type: 'response',
                pollID: args.pollID,
                voterID: args.voterID
            }
        };
        let queryResults = await this.queryWithQueryString(ctx, JSON.stringify(queryString));
        return queryResults;
    }

    /**
     * backend route: GET /poll/<:id>/poll-results
     * Get all the Responses for pollID
     * @param {*} ctx
     * @param {*} pollID id of the the poll
     * @returns Responses
     */
    async queryAllResponsesForPoll(ctx, pollID) {
        let queryString = {
            selector: {
                type: 'response',
                pollID: pollID
            }
        };
        let queryResults = await this.queryWithQueryString(ctx, JSON.stringify(queryString));
        return queryResults;
    }

    /**
     * backend route: POST /response/
     * Create Response
     * @param {*} ctx
     * @param {*} args
     * @returns response
     */
    async createResponse(ctx, args) {
        args = JSON.parse(args);
        let response = await new Response(ctx, args.responseID,
            args.pollID, args.voterID, args.answers);

        let error_code = await response.validateNewResponse(ctx);
        if (error_code === 0) {
            await ctx.stub.putState(args.responseID, Buffer.from(JSON.stringify(response)));
            return response;
        } else if (error_code === 1) {
            console.log('This responseID already exist');
            throw new Error('This responseID already exist');
        } else if (error_code === 2) {
            console.log('This pollID does not exist');
            throw new Error('This pollID does not exist');
        } else {
            console.log('Invalid Error Code');
            throw new Error('Invalid Error Code');
        }
    }

    // ------End of Response Methods------

}

module.exports = MyAssetContract;
