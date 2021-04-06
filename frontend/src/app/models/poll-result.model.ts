export class PollResult {
    pollID: string;
    questions: QuestionResult[];
    voted: Voted[];
}

export class QuestionResult {
    _id: string;
    type: string;
    question: string;
    choices: any;
    answers: string[];
}

export class Voted {
    userID: string;
    responseID: string;
    name: string;
    email: string;
}

export class ChartData {
    questionID: string;
    question: string;
    choices: ChartChoice[];
}

export class ChartChoice {
    name: string;
    value: number;
}
