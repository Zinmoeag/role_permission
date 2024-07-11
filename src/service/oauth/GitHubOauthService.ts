import AppConfig from "../../config";
import { GoogleOauthToken, GoogleUserResult, OauthUser } from "../../types/oauthType";
import qs from "qs";
import OauthServiceInterface from "./interfaces/OauthServiceInterface";
import axios from "axios";
import { GitHubOauthToken, GitHubUser, GitHubUserEmail } from "../../types/oauthType";
import AppError, { errorKinds } from "../../utils/AppError";
import { ReturnToken } from "../../types/authType";

class GitHubOauthService implements OauthServiceInterface<GitHubOauthToken> {

    public async getOauthToken(code: string): Promise<GitHubOauthToken> {
        const rootUrl = "https://github.com/login/oauth/access_token";

        const options = {
            code,
            client_id : AppConfig.getConfig("GITHUB_CLIENT_ID"),
            client_secret : AppConfig.getConfig("GITHUB_CLIENT_SECRET"),
        }

        const queryString = qs.stringify(options);

        try{
            const {data} = await axios.post(`${rootUrl}?${queryString}`, {
                headers : {
                    "Content-Type" : "application/x-www-form-urlencoded"
                } 
            });
            const decodedData = qs.parse(data);
            return {
                access_token : decodedData.access_token as string,
                scope : decodedData.scope as string
            }
        }catch(err){
            throw AppError.new(errorKinds.badRequest, "unauthorized to github");
        }


    }
    public async getOauthUser({ access_token }: GitHubOauthToken) : Promise<OauthUser> {
        const rootUrl = "https://api.github.com/user";

        const emailUrl = "https://api.github.com/user/emails";

        const options = {
            scope : ["user:email"],
        }
        const params = qs.stringify(options);

        try{
            const {data} = await axios.get<GitHubUser>(`${rootUrl}?${params}`,{
                headers : {
                    Authorization : `Bearer ${access_token}` 
                }
            })

            const emailsData = await axios.get(`${emailUrl}?${params}`,{
                headers : {
                    Authorization : `Bearer ${access_token}` 
                }
            })

            const primaryEmail = emailsData.data.find((email : GitHubUserEmail) => email.primary === true).email;

            return {
                name : data.name as string,
                photo : data.avatar_url as string,
                email : primaryEmail as string,
            }

        }catch(err){
            throw AppError.new(errorKinds.internalServerError, "no github user");
        }

    }

}

export default GitHubOauthService;