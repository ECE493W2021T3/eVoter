export class User {
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