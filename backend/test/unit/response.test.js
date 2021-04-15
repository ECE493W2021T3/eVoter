const { Response, validateResponse } = require('../../models/response');

let response;

describe('Response Test : validateResponse', ()=>{
  beforeEach(() => {
    response = {
      "pollID": "6067d0db642eba3c1e49c718",
      "voterID": "6067d0db642eba3c1e49c718",
      "answers": [{ "questionID": "6067d0c9642eba3c1e49c711", "answer": "Answer to question 1" }]
    };
  });

  test('validateResponse: validate valid Response ', () => {
    expect(validateResponse(response)).toEqual(expect.not.objectContaining({"error":expect.anything()}));
  });

  test('validateResponse: validate Response with NULL', () => {
    expect(validateResponse(null)).toEqual(expect.objectContaining({"value":null}));
    expect(validateResponse(null)).toEqual(expect.objectContaining({"error":expect.anything()}));
  });

  describe('pollID', () => {
    test('validateResponse: without pollID', () => {
      Response["pollID"] = "";
      expect(validateResponse(Response)).toEqual(expect.objectContaining({"error":expect.anything()}));
    });
    
    test('validateResponse: pollID as NULL', () => {
      Response["pollID"] = null;
      expect(validateResponse(Response)).toEqual(expect.objectContaining({"error":expect.anything()}));
    });
    
    test('validateResponse: set new pollID', () => {
      Response["pollID"]="6067d0c9642eba3c1e49c711";
      expect(validateResponse(Response)).toEqual(expect.objectContaining({"value":expect.anything()}));
      expect(validateResponse(Response).value.pollID).toEqual("6067d0c9642eba3c1e49c711");
    });
  });

  describe('voterID', () =>{
      test('validateResponse: without voterID', () => {
        Response["voterID"] = "";
        expect(validateResponse(Response)).toEqual(expect.objectContaining({"error":expect.anything()}));
      });
      
      test('validateResponse: voterID as NULL', () => {
        Response["voterID"] = null;
        expect(validateResponse(Response)).toEqual(expect.objectContaining({"error":expect.anything()}));
      });
      
      test('validateResponse: set new voterID', () => {
        Response["voterID"]="6067d0c9642eba3c1e49c711";
        expect(validateResponse(Response)).toEqual(expect.objectContaining({"value":expect.anything()}));
        expect(validateResponse(Response).value.voterID).toEqual("6067d0c9642eba3c1e49c711");
      });

  });

  describe('answers', () =>{
      test('validateResponse: without voterID', () => {
        Response["answers"] = "";
        expect(validateResponse(Response)).toEqual(expect.objectContaining({"error":expect.anything()}));
      });
      
      test('validateResponse: voterID as NULL', () => {
        Response["answers"] = null;
        expect(validateResponse(Response)).toEqual(expect.objectContaining({"error":expect.anything()}));
      });

  });

})



