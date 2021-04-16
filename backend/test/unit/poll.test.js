const { Poll, validatePoll, PollType } = require('../../models/poll');
let poll;

beforeEach(() => {
  poll = {
    "title": "Survey Title",
    "type": "Survey",
    "accessLevel": "Invite Only",
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
});

test('Poll Test: validate valid Poll ', () => {
  expect(validatePoll(poll)).toEqual(expect.not.objectContaining({"error":expect.anything()}));
});

test('Poll Test: validate Poll with NULL', () => {
  expect(validatePoll(null)).toEqual(expect.objectContaining({"value":null}));
  expect(validatePoll(null)).toEqual(expect.objectContaining({"error":expect.anything()}));
});

test('Poll Test: validate Poll without title', () => {
  poll["title"]="";
  expect(validatePoll(poll)).toEqual(expect.objectContaining({"error":expect.anything()}));
});

test('Poll Test: validate Poll with title as NULL', () => {
  poll["title"]=null;
  expect(validatePoll(poll)).toEqual(expect.objectContaining({"error":expect.anything()}));
});

test('Poll Test: set new title', () => {
  poll["title"]="test title";
  expect(validatePoll(poll)).toEqual(expect.objectContaining({"value":expect.anything()}));
  expect(validatePoll(poll).value.title).toEqual("test title");
});

test('Poll Test: validate host with NULL', () => {
  poll["host"]=null;
  expect(validatePoll(null)).toEqual(expect.objectContaining({"value":null}));
  expect(validatePoll(null)).toEqual(expect.objectContaining({"error":expect.anything()}));
});

test('Poll Test: validate host with empty string', () => {
  poll["host"]="";
  expect(validatePoll(poll)).toEqual(expect.objectContaining({"error":expect.anything()}));
});

test('Poll Test: set new title', () => {
  poll["host"]="test host";
  expect(validatePoll(poll)).toEqual(expect.objectContaining({"value":expect.anything()}));
  expect(validatePoll(poll).value.host).toEqual("test host");
});

test('Poll Test: validate type without type', () => {
  poll["type"]="";
  expect(validatePoll(poll)).toEqual(expect.objectContaining({"error":expect.anything()}));
});

test('Poll Test: validate type with type as NULL', () => {
  poll["type"]=null;
  expect(validatePoll(poll)).toEqual(expect.objectContaining({"error":expect.anything()}));
});

test('Poll Test: set new type', () => {
  poll["type"]="Survey";
  expect(validatePoll(poll)).toEqual(expect.not.objectContaining({"error":expect.anything()}));
});

test('Poll Test: set invalid type', () => {
  poll["type"]="NoExistType";
  expect(validatePoll(poll)).toEqual(expect.objectContaining({"error":expect.anything()}));
});

test('Poll Test: validate deadline without value', () => {
  poll["deadline"]="";
  expect(validatePoll(poll)).toEqual(expect.objectContaining({"error":expect.anything()}));
});

test('Poll Test: validate deadline with NULL', () => {
  poll["deadline"]=null;
  expect(validatePoll(poll)).toEqual(expect.objectContaining({"error":expect.anything()}));
});

test('Poll Test: set deadline with invalid value', () => {
  poll["deadline"]="not-time-string";
  expect(validatePoll(poll)).toEqual(expect.objectContaining({"error":expect.anything()}));
});

test('Poll Test: set deadline with outdated time', () => {
  poll["deadline"]="2002-01-01T23:45:00.000Z";
  expect(validatePoll(poll)).toEqual(expect.objectContaining({"error":expect.anything()}));
});

test('Poll Test: set deadline with valid value', () => {
  poll["deadline"]="2022-01-01T23:45:00.000Z";
  expect(validatePoll(poll)).toEqual(expect.not.objectContaining({"error":expect.anything()}));
});

test('Poll Test: accessLevel without empty value', () => {
  poll["accessLevel"]="";
  expect(validatePoll(poll)).toEqual(expect.objectContaining({"error":expect.anything()}));
});

test('Poll Test: accessLevel with NULL', () => {
  poll["accessLevel"]=null;
  expect(validatePoll(poll)).toEqual(expect.objectContaining({"error":expect.anything()}));
});

test('Poll Test: set new accessLevel', () => {
  poll["accessLevel"]="Public";
  expect(validatePoll(poll)).toEqual(expect.not.objectContaining({"error":expect.anything()}));
});

test('Poll Test: set invalid accessLevel', () => {
  poll["accessLevel"]="NoExistType";
  expect(validatePoll(poll)).toEqual(expect.objectContaining({"error":expect.anything()}));
});

test('Poll Test: isAnonymousModeOn with NULL', () => {
  poll["isAnonymousModeOn"]=null;
  expect(validatePoll(poll)).toEqual(expect.objectContaining({"error":expect.anything()}));
});

test('Poll Test: isAnonymousModeOn without empty value', () => {
  poll["isAnonymousModeOn"]="";
  expect(validatePoll(poll)).toEqual(expect.objectContaining({"error":expect.anything()}));
});

test('Poll Test: set new isAnonymousModeOn', () => {
  poll["isAnonymousModeOn"]=true;
  expect(validatePoll(poll)).toEqual(expect.not.objectContaining({"error":expect.anything()}));
});

test('Poll Test: set invalid isAnonymousModeOn', () => {
  poll["isAnonymousModeOn"]="NoExistType";
  expect(validatePoll(poll)).toEqual(expect.objectContaining({"error":expect.anything()}));
});

test('Poll Test: isHiddenUntilDeadline with NULL', () => {
  poll["isHiddenUntilDeadline"]=null;
  expect(validatePoll(poll)).toEqual(expect.objectContaining({"error":expect.anything()}));
});

test('Poll Test: isHiddenUntilDeadline without empty value', () => {
  poll["isHiddenUntilDeadline"]="";
  expect(validatePoll(poll)).toEqual(expect.objectContaining({"error":expect.anything()}));
});

test('Poll Test: set new isHiddenUntilDeadline', () => {
  poll["isHiddenUntilDeadline"]=true;
  expect(validatePoll(poll)).toEqual(expect.not.objectContaining({"error":expect.anything()}));
});

test('Poll Test: set invalid isHiddenUntilDeadline', () => {
  poll["isHiddenUntilDeadline"]="NoExistType";
  expect(validatePoll(poll)).toEqual(expect.objectContaining({"error":expect.anything()}));
});

test('Poll Test: canVotersSeeResults with NULL', () => {
  poll["canVotersSeeResults"]=null;
  expect(validatePoll(poll)).toEqual(expect.objectContaining({"error":expect.anything()}));
});

test('Poll Test: canVotersSeeResults without empty value', () => {
  poll["canVotersSeeResults"]="";
  expect(validatePoll(poll)).toEqual(expect.objectContaining({"error":expect.anything()}));
});

test('Poll Test: set new canVotersSeeResults', () => {
  poll["canVotersSeeResults"]=true;
  expect(validatePoll(poll)).toEqual(expect.not.objectContaining({"error":expect.anything()}));
});

test('Poll Test: set invalid canVotersSeeResults', () => {
  poll["canVotersSeeResults"]="NoExistType";
  expect(validatePoll(poll)).toEqual(expect.objectContaining({"error":expect.anything()}));
});

test('Poll Test: questions with NULL', () => {
  poll["questions"]=null;
  expect(validatePoll(poll)).toEqual(expect.objectContaining({"error":expect.anything()}));
});

test('Poll Test: questions without empty value', () => {
  poll["questions"]="";
  expect(validatePoll(poll)).toEqual(expect.objectContaining({"error":expect.anything()}));
});

test('Poll Test: set new canVotersSeeResults', () => {
  poll["canVotersSeeResults"]=true;
  expect(validatePoll(poll)).toEqual(expect.not.objectContaining({"error":expect.anything()}));
});



