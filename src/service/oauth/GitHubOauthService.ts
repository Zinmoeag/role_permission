import { GoogleOauthToken, GoogleUserResult } from "../../types/oauthType";
import OauthServiceInterface from "./interfaces/OauthServiceInterface";

class GitHubOauthService implements OauthServiceInterface {
    public getOauthToken(code: string): any {
        
    }
    public getOauthUser({ access_token, id_token }: { access_token: string; id_token: string; }) : any {
        
    }

}

export default GitHubOauthService;