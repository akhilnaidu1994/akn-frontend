export interface User {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    messages?: Message[];
    password: string;
    newChat?: boolean;
}

export interface Message {
    receiverId: string;
    senderId: string;
    type: TYPE,
    message: string,
    timestamp: Date
}

export enum TYPE {
    SENDER, RECEIVER
}