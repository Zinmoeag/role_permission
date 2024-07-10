export interface GoogleOauthToken {
    access_token: string;
    id_token: string;
    expires_in: number;
    refresh_token: string;
    token_type: string;
    scope: string;
}

export interface GoogleUserResult {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    locale: string;
}

//github
export type GitHubOauthToken = {
    access_token: string;
    scope : "user:email";
};

export type GitHubUserEmail = {
    email: string;
    primary : boolean;
    verified : boolean;
    visibility : string;
}

export interface GitHubUser {
    login: string;
    avatar_url: string;
    name: string;
    email: string;
}


export type OauthUser = {
    email: string,
    name: string,
    photo: string,
}