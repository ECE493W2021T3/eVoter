const request = require('supertest');
const { Poll, validatePoll, PollType } = require('../../models/poll');
const { User } = require('../../models/user');
const { Response, validateResponse } = require('../../models/response');

let server;
let poll;
let response;
let accessToken;
let userModel;
let user = new User();

describe('/response', () =>{
    beforeEach( async ()=>{
        server  = require('../../index');

        accessToken = await user.generateAccessAuthToken();

        response = {
            "pollID": "6067d0db642eba3c1e49c718",
            "voterID": "6067d0db642eba3c1e49c718",
            "answers": [{ "questionID": "6067d0c9642eba3c1e49c711", "answer": "Answer to question 1" }]
        };

        poll = {
            "title": "Survey Title",
            "type": "Survey",
            "accessLevel": "Public",
            "deadline": "2021-04-27T23:45:00.000Z",
            "isAnonymousModeOn": false,
            "isHiddenUntilDeadline": true,
            "canVotersSeeResults": true,
            "host": "6078d8fb4bcbb6756bf1d486",
            "accessCode": "6078d8fb4bcbb6756bf1d999",
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

    describe('POST /response/',  () => {
        it('not logged in, 401', async () => {
            const res = await request(server).post('/response/');
            expect(res.status).toBe(401);
        });
        
        it('invalid accessToken input, 401', async () => {
            const res =  await request(server).post('/response/').set('x-access-token', "invalid accessToken").send(response);
            expect(res.body).toEqual(expect.objectContaining({"message":"jwt malformed"}));
            expect(res.status).toBe(401);
        });

        it('valid input, 200', async () => {
            poll['title']="POST /response/";
            const pollSaved =  await new Poll(poll).save();
            response['pollID']= pollSaved._id;
            res =  await request(server).post('/response/').set('x-access-token', accessToken).send(response);
            expect(res.status).toBe(200);
        });

    });

    describe('GET /response/:id',  () => {
        it('not logged in, 401', async () => {
            const res = await request(server).get('/response/6067d0db642eba3c1e49c718');
            expect(res.status).toBe(401);
        });
        
        it('invalid accessToken input, 401', async () => {
            const res =  await request(server).get('/response/6067d0db642eba3c1e49c718').set('x-access-token', "invalid accessToken");
            expect(res.body).toEqual(expect.objectContaining({"message":"jwt malformed"}));
            expect(res.status).toBe(401);
        });

        it('valid input, 200', async () => {
            poll['title']="GET /response/:id";
            const pollSaved =  await new Poll(poll).save();
            response["pollID"] = pollSaved._id;
            const newResponse = await new Response(response).save();
            console.log(newResponse._id);
            res =  await request(server).get('/response/'+ newResponse._id).set('x-access-token', accessToken);
            expect(res.status).toBe(200);
        });

    });

    describe('PATCH /response/:id',  () => {
        it('not logged in, 401', async () => {
            const res = await request(server).patch('/response/6067d0db642eba3c1e49c718');
            expect(res.status).toBe(401);
        });
        
        it('invalid accessToken input, 401', async () => {
            const res =  await request(server).patch('/response/6067d0db642eba3c1e49c718').set('x-access-token', "invalid accessToken");
            expect(res.body).toEqual(expect.objectContaining({"message":"jwt malformed"}));
            expect(res.status).toBe(401);
        });

        it('valid input, 200', async () => {
            Response.remove({});
            poll['title']="PATCH /response/:id";
            const pollSaved =  await new Poll(poll).save();
            response["pollID"] = pollSaved._id;
            const newResponse = await new Response(response).save();
            response["answers"] = [{ "questionID": "6067d0c9642eba3c1e49c711", "answer": "change answer" }];
            res =  await request(server).patch('/response/'+ newResponse._id).set('x-access-token', accessToken).send(response);
            expect(res.status).toBe(200);
            res =  await request(server).get('/response/'+ newResponse._id).set('x-access-token', accessToken);
            expect(res.body.answers[0]).toEqual(expect.objectContaining({"answer":"change answer"}));
            expect(res.status).toBe(200);
        });

    });
});