import { ReturnUser } from "./user"
import {z} from "zod"

export const LoginOrRequestVerfy = {
    LOGIN_RESPONSE : "LOGIN_RESPONSE",
    REQUEST_VERFIFY_RESPONSE : "REQUEST_VERFIFY_RESPONSE",
} as const;


export type LoginOrRequestVerfy = typeof LoginOrRequestVerfy[keyof typeof LoginOrRequestVerfy];

export type ReturnToken = {
    accessToken : string,
    refreshToken : string,
}

export type LoginResponse = {
    type : typeof LoginOrRequestVerfy.LOGIN_RESPONSE,
    is_auth : boolean,
    user : z.infer<typeof ReturnUser>
    refresh_token : string,
    access_token : string,
}

export type RequestVerifyEmail = {
    type : typeof LoginOrRequestVerfy.REQUEST_VERFIFY_RESPONSE,
    is_verfiy_email_sent : boolean,
}

export type LoginOrRequestVerifyResponse = LoginResponse | RequestVerifyEmail;