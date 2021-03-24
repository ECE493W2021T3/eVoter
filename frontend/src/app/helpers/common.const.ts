export const COMMON = {
    accessLevel: {
        private: 'Private',
        public: 'Public',
        inviteOnly: 'Invite Only'
    },
    pollType: {
        survey: 'Survey',
        election: 'Election'
    },
    questionType: {
        shortAnswer: 'Short Answer',
        multipleChoice: 'Multiple Choice'
    }
}

// Used for binding display and value
export interface ICommonValue {
	display: string;
	value: string;
}

export const ACCESS_LEVELS: ICommonValue[] = [
    {
        display: COMMON.accessLevel.private,
        value: COMMON.accessLevel.private
    },
    {
        display: COMMON.accessLevel.public,
        value: COMMON.accessLevel.public
    },
    {
        display: COMMON.accessLevel.inviteOnly,
        value: COMMON.accessLevel.inviteOnly
    }
];

export const POLL_TYPES: ICommonValue[] = [
    {
        display: COMMON.pollType.survey,
        value: COMMON.pollType.survey
    },
    {
        display: COMMON.pollType.election,
        value: COMMON.pollType.election
    }
];

export const QUESTION_TYPES: ICommonValue[] = [
    {
        display: COMMON.questionType.shortAnswer,
        value: COMMON.questionType.shortAnswer
    },
    {
        display: COMMON.questionType.multipleChoice,
        value: COMMON.questionType.multipleChoice
    }
]