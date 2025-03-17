
export interface User {
    user_id: string;
    user_name: string;
    email: string;
    phone_number: string;
    role: string;
    nick_name: string;
    gender: String;
    description: string;
}

export interface Register {
    username: string;
    password: string;
    email: string;
}

export interface UserUpdate {
    user_id: string;
    nick_name: string;
    gender: Number;
    description: string;
}

export interface UserUpdateTable {
    user_id: string;
    nick_name: string;
    gender: String;
    description: string;
}