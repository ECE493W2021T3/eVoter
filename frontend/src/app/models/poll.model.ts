import { Question } from "./question.model";

export class Poll {
    _id: string;
    title: string;
    type: string;
    accessLevel: string;
    deadline: Date;
    isAnonymousModeOn: boolean;
    isHiddenUntilDeadline: boolean;
    canVotersSeeResults: boolean;
    questions: Question[];

    constructor(response: any) {
        if (response) {
            this._id = response._id;
            this.title = response.title;
            this.type = response.type;
            this.accessLevel = response.accessLevel;
            this.deadline = new Date(response.deadline);
            this.isAnonymousModeOn = response.isAnonymousModeOn;
            this.isHiddenUntilDeadline = response.isHiddenUntilDeadline;
            this.canVotersSeeResults = response.canVotersSeeResults;
            this.questions = response.questions;
        }
    }
}
