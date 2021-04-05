export const COMMON = {
    role: {
        admin: 'Admin',
        voter: 'Voter'
    },
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
    },
    securityQuestionSet1: {
        q1: 'In what city or town was your first job?',
        q2: 'What school did you attend for sixth grade?',
        q3: "What is your oldest sibling's middle name?",
        q4: 'What was the make and model of your first car?'
    },
    securityQuestionSet2: {
        q1: 'In what city did you meet your spouse/significant other?',
        q2: 'What was the name of the hospital where you were born?',
        q3: 'Where were you when you had your first kiss?',
        q4: 'What was your childhood phone number including area code? (e.g., 000-000-0000)',
    },
    securityQuestionSet3: {
        q1: 'In what city or town did your mother and father meet?',
        q2: "What is your maternal grandmother's maiden name?",
        q3: 'What was your favorite sport in high school?',
        q4: 'What was your favorite food as a child?'
    }
}

// Used for binding display and value
export interface ICommonValue {
	display: string;
	value: string;
}

export const ACCESS_LEVELS: ICommonValue[] = [
    {
        display: COMMON.accessLevel.inviteOnly,
        value: COMMON.accessLevel.inviteOnly
    },
    {
        display: COMMON.accessLevel.public,
        value: COMMON.accessLevel.public
    },
    {
        display: COMMON.accessLevel.private,
        value: COMMON.accessLevel.private
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

export const SECURITY_QUESTION_1: ICommonValue[] = [
    {
        display: COMMON.securityQuestionSet1.q1,
        value: COMMON.securityQuestionSet1.q1
    },
    {
        display: COMMON.securityQuestionSet1.q2,
        value: COMMON.securityQuestionSet1.q2
    },
    {
        display: COMMON.securityQuestionSet1.q3,
        value: COMMON.securityQuestionSet1.q3
    },
    {
        display: COMMON.securityQuestionSet1.q4,
        value: COMMON.securityQuestionSet1.q4
    }
]

export const SECURITY_QUESTION_2: ICommonValue[] = [
    {
        display: COMMON.securityQuestionSet2.q1,
        value: COMMON.securityQuestionSet2.q1
    },
    {
        display: COMMON.securityQuestionSet2.q2,
        value: COMMON.securityQuestionSet2.q2
    },
    {
        display: COMMON.securityQuestionSet2.q3,
        value: COMMON.securityQuestionSet2.q3
    },
    {
        display: COMMON.securityQuestionSet2.q4,
        value: COMMON.securityQuestionSet2.q4
    }
]

export const SECURITY_QUESTION_3: ICommonValue[] = [
    {
        display: COMMON.securityQuestionSet3.q1,
        value: COMMON.securityQuestionSet3.q1
    },
    {
        display: COMMON.securityQuestionSet3.q2,
        value: COMMON.securityQuestionSet3.q2
    },
    {
        display: COMMON.securityQuestionSet3.q3,
        value: COMMON.securityQuestionSet3.q3
    },
    {
        display: COMMON.securityQuestionSet3.q4,
        value: COMMON.securityQuestionSet3.q4
    }
]

export const CHART_COLOR_SCHEME = {
    domain: ['#e9724d', '#d6d727', '#92cad1', 
             '#79ccb3','#868686','#dad2cb','#bdc9b8',
             '#ffe08d','#ff9a5b','#63afae']
};
