export class User {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    is2FAEnabled: boolean;
    securityQuestions: SecurityQuestion[];
}

export class SecurityQuestion {
    question: string;
    answer: string;
}

export class UserProfile {
    _id: string;
    name: string;
    role: string;
}