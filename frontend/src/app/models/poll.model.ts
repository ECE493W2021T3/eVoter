import { Question } from "./question.model";

export class Poll {
    title: string;
    type: string;
    accessLevel: string;
    deadline: Date;
    isAnonymousModeOn: boolean;
    isHiddenUntilDeadline: boolean;
    canVotersSeeResults: boolean;
    questions: Question[];
}
