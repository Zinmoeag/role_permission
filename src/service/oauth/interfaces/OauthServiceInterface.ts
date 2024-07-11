import { OauthToken } from "../../../types/oauthType";
import { OauthUser } from "../../../types/oauthType";

interface OauthServiceInterface<T extends OauthToken>{
    getOauthToken(code: string):  Promise<T>;
    getOauthUser(token : T): Promise<OauthUser>;
}

export default OauthServiceInterface;