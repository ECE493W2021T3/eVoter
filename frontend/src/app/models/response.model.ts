export class VoterResponse {
    _id: string;
    pollID: string;
    voterID: string;
    answers: Answer[];
}

export class Answer {
    question: string;
    answer: string;
}