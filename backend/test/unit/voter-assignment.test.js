const { VoterAssignment, validateVoterAssignment } = require('../../models/voter-assignment');
let voterAssignment;
describe('VoterAssignment Test : validateVoterAssignment', ()=>{
  beforeEach(() => {
    voterAssignment = { 
      "pollID": "6067d0db642eba3c1e49c718",
      "userID": "6067d0db642eba3c1e49c718"};
  });

  test('validateVoterAssignment: validate valid voterAssignment ', () => {
    expect(validateVoterAssignment(voterAssignment)).toEqual(expect.not.objectContaining({"error":expect.anything()}));
  });

  test('validateVoterAssignment: validate VoterAssignment with NULL', () => {
    expect(validateVoterAssignment(null)).toEqual(expect.objectContaining({"value":null}));
    expect(validateVoterAssignment(null)).toEqual(expect.objectContaining({"error":expect.anything()}));
  });

  describe('pollID', () => {
    test('validateVoterAssignment: set new ID', () => {
      voterAssignment["pollID"]="6067d0c9642eba3c1e49c711";
      expect(validateVoterAssignment(voterAssignment)).toEqual(expect.objectContaining({"value":expect.anything()}));
      expect(validateVoterAssignment(voterAssignment).value.pollID).toEqual("6067d0c9642eba3c1e49c711");
    });
  });

  describe('userID', () => {
    test('validateVoterAssignment: set new ID', () => {
      voterAssignment["userID"]="6067d0c9642eba3c1e49c711";
      expect(validateVoterAssignment(voterAssignment)).toEqual(expect.objectContaining({"value":expect.anything()}));
      expect(validateVoterAssignment(voterAssignment).value.userID).toEqual("6067d0c9642eba3c1e49c711");
    });
  });

})



