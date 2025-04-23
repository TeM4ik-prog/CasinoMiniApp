export interface IEmailAuth {
    email: string
}

export interface ITelegramUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    is_premium?: boolean;
    photo_url?: string;
}

export interface IUser {
    id: string;
    telegramId: number;
    username: string;
    lastName: string | null;
    firstName: string;
    photoUrl?: string;
    balance: number;
}

export interface IGoogleAuth {
    clientId?: string;
    credential: string;
    select_by?: string;

}