export interface User {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface Message {
    type: TYPE,
    message: string,
    time: Date
}

export enum TYPE {
    SENDER, RECEIVER
}