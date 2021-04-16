/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { MyAssetContract } = require('..');
const winston = require('winston');

// import models
let Poll = require('../lib/Poll.js');
let Response = require('../lib/Response.js');

// import dummy data
let testPoll = require('./assets/testPoll.json');
let testResponse = require('./assets/testResponse.json');


const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext {

    constructor() {
        this.stub = sinon.createStubInstance(ChaincodeStub);
        this.clientIdentity = sinon.createStubInstance(ClientIdentity);
        this.logger = {
            getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
            setLevel: sinon.stub(),
        };
    }

}

describe('MyAssetContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new MyAssetContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"my asset 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"my asset 1002 value"}'));
    });

    describe('#myAssetExists', () => {

        it('should return true for a my asset', async () => {
            await contract.myAssetExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a my asset that does not exist', async () => {
            await contract.myAssetExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createMyAsset', () => {

        it('should create a my asset', async () => {
            await contract.createMyAsset(ctx, '1003', 'my asset 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"my asset 1003 value"}'));
        });

        it('should throw an error for a my asset that already exists', async () => {
            await contract.createMyAsset(ctx, '1001', 'myvalue').should.be.rejectedWith(/The my asset 1001 already exists/);
        });

    });

    describe('#readMyAsset', () => {

        it('should return a my asset', async () => {
            await contract.readMyAsset(ctx, '1001').should.eventually.deep.equal({ value: 'my asset 1001 value' });
        });

        it('should throw an error for a my asset that does not exist', async () => {
            await contract.readMyAsset(ctx, '1003').should.be.rejectedWith(/The my asset 1003 does not exist/);
        });

    });

    describe('#updateMyAsset', () => {

        it('should update a my asset', async () => {
            await contract.updateMyAsset(ctx, '1001', 'my asset 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"my asset 1001 new value"}'));
        });

        it('should throw an error for a my asset that does not exist', async () => {
            await contract.updateMyAsset(ctx, '1003', 'my asset 1003 new value').should.be.rejectedWith(/The my asset 1003 does not exist/);
        });

    });

    describe('#deleteMyAsset', () => {

        it('should delete a my asset', async () => {
            await contract.deleteMyAsset(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a my asset that does not exist', async () => {
            await contract.deleteMyAsset(ctx, '1003').should.be.rejectedWith(/The my asset 1003 does not exist/);
        });

    });

    describe('#Poll', () => {

        it('Poll object should be created, with all properties', async () => {
            let args = testPoll;
            let poll = await new Poll(ctx, args.pollID, args.title, args.host, args.pollType,
                args.deadline, args.accessLevel, args.isAnonymousModeOn, args.isHiddenUntilDeadline,
                args.canVotersSeeResults, args.questions, args.accessCode);

            poll.should.haveOwnProperty('pollID');
            poll.should.haveOwnProperty('title');
            poll.should.haveOwnProperty('host');
            poll.should.haveOwnProperty('pollType');
            poll.should.haveOwnProperty('deadline');
            poll.should.haveOwnProperty('accessLevel');
            poll.should.haveOwnProperty('isAnonymousModeOn');
            poll.should.haveOwnProperty('isHiddenUntilDeadline');
            poll.should.haveOwnProperty('canVotersSeeResults');
            poll.should.haveOwnProperty('questions');
            poll.should.haveOwnProperty('accessCode');
        });
    });

    describe('#createPoll', () => {

        it('createPoll should add valid Poll to world state', async () => {
            let args = JSON.stringify(testPoll);
            await contract.createPoll(ctx, args);
            ctx.stub.putState.should.have.been.called;
        });

        it('createPoll should throw error when add existing poll', async () => {
            let args = testPoll;
            args.pollID = '1001';
            args = JSON.stringify(args);
            await contract.createPoll(ctx, args).should.be.rejectedWith('This pollID already exist');
        });
    });

    describe('#updatePoll', () => {

        beforeEach(() => {
            ctx.stub.getState.withArgs(testPoll.pollID).resolves(Buffer.from(JSON.stringify(testPoll)));
        });

        it('updatePoll should update existing Poll', async () => {
            let args = JSON.stringify(testPoll);
            await contract.updatePoll(ctx, args);
            ctx.stub.putState.should.have.been.called;
        });

        it('updatePoll should throw error when update non exist Poll', async () => {
            let args = testPoll;
            args.pollID = '9999';
            args = JSON.stringify(args);
            await contract.updatePoll(ctx, args).should.be.rejectedWith('The pollID 9999 does not exist');
        });
    });

    describe('#Response', () => {

        it('Response object should be created, with all properties', async () => {
            let args = testResponse;
            let response = await new Response(ctx, args.responseID, args.pollID, args.voterID, args.answers);
            response.should.haveOwnProperty('responseID');
            response.should.haveOwnProperty('pollID');
            response.should.haveOwnProperty('voterID');
            response.should.haveOwnProperty('answers');
        });
    });

    describe('#createResponse', () => {

        beforeEach(() => {
            ctx.stub.getState.withArgs(testResponse.pollID).resolves(Buffer.from('{"value": ""}'));
        });

        it('createResponse should add valid Response to world state', async () => {
            let args = JSON.stringify(testResponse);
            await contract.createResponse(ctx, args);
            ctx.stub.putState.should.have.been.called;
        });

        it('createResponse should throw error when add existing response', async () => {
            let args = testResponse;
            args.responseID = '1001';
            args = JSON.stringify(args);
            await contract.createResponse(ctx, args).should.be.rejectedWith('This responseID already exist');
        });

        it('createResponse should throw error when pollID does not exist', async () => {
            let args = testResponse;
            args.responseID = '9999';
            args.pollID = '8888';
            args = JSON.stringify(args);
            await contract.createResponse(ctx, args).should.be.rejectedWith('This pollID does not exist');
        });
    });

    describe('#queryAll', () => {
        it('should call queryWithQueryString a my asset', async () => {
            await contract.queryAll(ctx).should.be.rejectedWith('Cannot read property \'next\' of undefined');
            ctx.stub.getQueryResult.should.be.calledOnce;
        });
    });

    describe('#queryWithQueryString', () => {
        it('should call getQueryResult', async () => {
            await contract.queryWithQueryString(ctx, '').should.be.rejectedWith('Cannot read property \'next\' of undefined');
            ctx.stub.getQueryResult.should.be.calledOnce;
        });
    });

    describe('#queryByObjectType', () => {
        it('should call getQueryResult', async () => {
            await contract.queryByObjectType(ctx, 'poll').should.be.rejectedWith('Cannot read property \'next\' of undefined');
            ctx.stub.getQueryResult.should.be.calledOnce;
        });
    });

    describe('#queryAllHostedPoll', () => {
        it('should call getQueryResult', async () => {
            await contract.queryAllHostedPoll(ctx, '1001').should.be.rejectedWith('Cannot read property \'next\' of undefined');
            ctx.stub.getQueryResult.should.be.calledOnce;
        });
    });

    describe('#queryPollById', () => {
        it('should call getQueryResult', async () => {
            await contract.queryPollById(ctx, '1001').should.be.rejectedWith('Cannot read property \'next\' of undefined');
            ctx.stub.getQueryResult.should.be.calledOnce;
        });
    });

    describe('#queryPollByAccessCode', () => {
        it('should call getQueryResult', async () => {
            await contract.queryPollByAccessCode(ctx, '1001').should.be.rejectedWith('Cannot read property \'next\' of undefined');
            ctx.stub.getQueryResult.should.be.calledOnce;
        });
    });

    describe('#queryResponseById', () => {
        it('should call getQueryResult', async () => {
            await contract.queryResponseById(ctx, '1001').should.be.rejectedWith('Cannot read property \'next\' of undefined');
            ctx.stub.getQueryResult.should.be.calledOnce;
        });
    });

    describe('#queryResponseByArgs', () => {
        it('should call getQueryResult', async () => {
            await contract.queryResponseByArgs(ctx, '{"args":""}').should.be.rejectedWith('Cannot read property \'next\' of undefined');
            ctx.stub.getQueryResult.should.be.calledOnce;
        });
    });

    describe('#queryAllResponsesForPoll', () => {
        it('should call getQueryResult', async () => {
            await contract.queryAllResponsesForPoll(ctx, '1001').should.be.rejectedWith('Cannot read property \'next\' of undefined');
            ctx.stub.getQueryResult.should.be.calledOnce;
        });
    });

});
