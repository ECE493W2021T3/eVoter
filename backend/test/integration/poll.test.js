const request = require('supertest');
const { Poll, validatePoll, PollType } = require('../../models/poll');
const { User } = require('../../models/user');
const { Response, validateResponse } = require('../../models/response');

let server;
let poll;
let accessToken;
let userModel;
let user = new User();

describe('/poll', () =>{
    beforeEach( async ()=>{
        server  = require('../../index');

        accessToken = await user.generateAccessAuthToken();
        poll = {
            "title": "Survey Title",
            "type": "Survey",
            "accessLevel": "Public",
            "deadline": "2021-04-27T23:45:00.000Z",
            "isAnonymousModeOn": false,
            "isHiddenUntilDeadline": true,
            "canVotersSeeResults": true,
            "questions": [
              { "type": "Short Answer", "question": "Short answer 1" },
              { "type": "Multiple Choice", "question": "MCQ 1", "choices": ["Array"] },
              { "type": "Multiple Choice", "question": "MCQ 2", "choices": ["Array"] },
              { "type": "Short Answer", "question": "Short answer q2" }
            ]
        };

        userModel = {
            "name": "MyName",
            "email": "test19@gmail.com",
            "password": "mypass123",
            "role": "Admin",
            "is2FAEnabled": true,
            "securityQuestions": [
              {
                "question": "In what city or town was your first job?",
                "answer": "Edmonton"
              },
              {
                "question": "What was your childhood phone number including area code? (e.g., 000-000-0000)",
                "answer": "111-111-1111"
              },
              {
                "question": "What was your favorite food as a child?",
                "answer": "Rice"
              }
              
            ],
            "confirmationCode": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNhcm9jMTgyOTlAZGR3ZnpwLmNvbSIsImlhdCI6MTYxNzUwNjU2M30.X4Yjd8TzhrLk9nMQ1X3ENcF1Gf8WFoWuz6c1iMRPcEg",
            "confirmed": true,

          };
    });

    afterEach(async ()=>{
        await Poll.remove({});
        await Response.remove({});
        await User.remove({});
        server.close();
    });

    describe('POST /',  () => {
        it('not logged in, 401', async () => {
            const res = await request(server).post('/poll');
            expect(res.status).toBe(401);
        });
        
        it('invalid accessToken input, 401', async () => {
            const res =  await request(server).post('/poll').set('x-access-token', "invalid accessToken").send(poll);
            expect(res.body).toEqual(expect.objectContaining({"message":"jwt malformed"}));
            expect(res.status).toBe(401);
        });

        it('valid input, 200', async () => {
            poll['title']="POST";
            const res =  await request(server).post('/poll').set('x-access-token', accessToken).send(poll);
            expect(res.body).toEqual(expect.objectContaining({"title":poll.title}));
            expect(res.status).toBe(200);
        });

    });

    describe('GET /:id',  () => {
        it('not logged in, 401', async () => {
            const res = await request(server).get('/poll/6078d8fb4bcbb6756bf1d486');
            expect(res.status).toBe(401);
        });

        it('valid input, 200', async () => {
            poll['host'] ='6078d8fb4bcbb6756bf1d486';
            const pollSaved =  await new Poll(poll).save();
            const res =  await request(server).get('/poll/' +  pollSaved._id).set('x-access-token', accessToken);
            expect(res.body).toEqual(expect.objectContaining({"host":"6078d8fb4bcbb6756bf1d486"}));
            expect(res.status).toBe(200);
        });
    });

    describe('GET /public/:accessCode',  () => {
        it('not Logged in, 401', async () => {
            const res = await request(server).get('/poll/public/6078d8fb4bcbb6756bf1d486');
            expect(res.status).toBe(401);
        });

        it('valid input, 200', async () => {
            poll['host'] ='6078d8fb4bcbb6756bf1d486';
            poll['accessCode'] ='6078d8fb4bcbb6756bf1d999';
            const pollSaved =  await new Poll(poll).save();
            await new Response({pollID: pollSaved._id, voterID: user._id,   "answers": [
                { "questionID": "6067d0c9642eba3c1e49c711", "answer": "Answer to question 1" }
              ]}).save();
            const res =  await request(server).get('/poll/public/' +  poll.accessCode).set('x-access-token', accessToken);
            expect(res.body.poll).toBeDefined();
            expect(res.status).toBe(200);
        });
    });

    describe('Patch /poll/<:id>',  () => {
        it('not Logged in, 404', async () => {
            const res = await request(server).patch('/poll/public/6078d8fb4bcbb6756bf1d486');
            expect(res.status).toBe(404);
        });
        it('valid input, 200', async () => {
            poll['title']="patch1";
            let res =  await request(server).post('/poll').set('x-access-token', accessToken).send(poll);
            expect(res.body).toEqual(expect.objectContaining({"title":poll.title}));

            poll['title']="patch2";
            res =  await request(server).patch('/poll/' + res.body._id).set('x-access-token', accessToken).send(poll);
            expect(res.body).toEqual(expect.objectContaining({"title":poll.title}));

            expect(res.status).toBe(200);
        });
    });

    describe('GET /poll/all-hosted',  () => {
        it('not Logged in, 401', async () => {
            const res = await request(server).get('/poll/all-hosted');
            expect(res.status).toBe(401);
        });
    });

    describe('GET /poll/all-invited',  () => {
        it('not Logged in, 401', async () => {
            const res = await request(server).get('/poll/all-invited');
            expect(res.status).toBe(401);
        });
    });

    describe('GET /poll/<:id>/poll-results',  () => {
        it('not Logged in, 401', async () => {
            const res = await request(server).get('/poll/6078d8fb4bcbb6756bf1d486/poll-results');
            expect(res.status).toBe(401);
        });

        it('not ready , 401', async () => {
            poll['title']="/poll/<:id>/poll-results";
            poll['deadline']="2021-04-27T23:45:00.000Z";
            poll['isHiddenUntilDeadline']=true;
            let res =  await request(server).post('/poll').set('x-access-token', accessToken).send(poll);
            res = await request(server).get(`/poll/${res.body._id}/poll-results`).set('x-access-token', accessToken);
            expect(res.status).toBe(401);
        });

        it('not allowed , 403', async () => {
            poll['isHiddenUntilDeadline']=false;
            poll['canVotersSeeResults']=false;
            const newToken = await new User().generateAccessAuthToken();
            let res =  await request(server).post('/poll').set('x-access-token', accessToken).send(poll);
            res = await request(server).get(`/poll/${res.body._id}/poll-results`).set('x-access-token', newToken);
            expect(res.status).toBe(403);
        });
    });

    describe('POST /poll/<id>/voter-assignments',  () => {
        it('not Logged in, 401', async () => {
            const res = await request(server).post('/poll/6078d8fb4bcbb6756bf1d486/voter-assignments');
            expect(res.status).toBe(401);
        });

        it('assign voters , 200', async () => {
            let res =  await request(server).post('/poll').set('x-access-token', accessToken).send(poll);
            await User.remove({});

            const newUser = new User(userModel)
            await newUser.save();
            const assignments = [{ "_id": newUser._id, "email": "test19@gmail.com" }];

            res = await request(server).post(`/poll/${res.body._id}/voter-assignments`).set('x-access-token', accessToken).send(assignments);
            expect(res.status).toBe(200);
        });

    });
    
    describe('Get /poll/<id>/voter-assignments',  () => {
        it('not Logged in, 401', async () => {
            const res = await request(server).get('/poll/6078d8fb4bcbb6756bf1d486/voter-assignments');
            expect(res.status).toBe(401);
        });

        it('get voters , 200', async () => {
            let res =  await request(server).post('/poll').set('x-access-token', accessToken).send(poll);
            await User.remove({});
            const newUser = new User(userModel)
            await newUser.save();
            const assignments = [{ "_id": newUser._id, "email": "test19@gmail.com" }];
            res = await request(server).post(`/poll/${res.body._id}/voter-assignments`).set('x-access-token', accessToken).send(assignments);
            res = await request(server).get(`/poll/${res.body._id}/voter-assignments`).set('x-access-token', accessToken);
            expect(res.status).toBe(200);
        });

    });

});