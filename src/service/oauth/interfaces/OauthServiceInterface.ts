import { GoogleOauthToken, GoogleUserResult } from "../../../types/oauthType";

interface OauthServiceInterface{
    getOauthToken(code: string):  Promise<GoogleOauthToken>;
    getOauthUser({
        access_token,
        id_token
    } : {
        access_token : string,
        id_token : string
    }): Promise<any>;
}

export default OauthServiceInterface;