import OauthServiceInterface from "./interfaces/OauthServiceInterface"
import { GoogleOauthToken, GoogleUserResult, OauthUser } from "../../types/oauthType";
import AppError from "../../utils/AppError";
import AppConfig from "../../config";
import axios from "axios";
import { errorKinds } from "../../utils/AppError";
import qs from "qs";

class GoogleOauthService implements OauthServiceInterface<GoogleOauthToken>{    
    public async getOauthToken(code: string)  : Promise<GoogleOauthToken> {
        const options = {
            code,
            client_id: AppConfig.getConfig("GOOGLE_CLIENT_ID"),
            client_secret: AppConfig.getConfig("GOOGLE_CLIENT_SECRET"),
            redirect_uri: AppConfig.getConfig("GOOGLE_REDIRECT_URL"),
            grant_type: "authorization_code",
        };
      
        const targetUrl = "https://oauth2.googleapis.com/token";
      
        try {
            const { data } = await axios.post<GoogleOauthToken>(
                targetUrl,
                qs.stringify(options),
                {
                  headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                  },
                }
            );
                
              return data as GoogleOauthToken;
        } catch (err: any) {
            throw AppError.new(errorKinds.badRequest, "unauthorized to Google")
        }
    }

    public async getOauthUser({access_token, id_token} : GoogleOauthToken) : Promise<OauthUser>
    {
        const targetUrl = `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`;

        try{
            const {data} = await axios.get<GoogleUserResult>(targetUrl, {
                headers : {
                    Authorization : `Bearer ${id_token}`
                }
            })   
        
            return {
                name : data.name as string,
                avatar : data.picture as string,
                email : data.email as string,
            }
        }catch(err){
            throw AppError.new(errorKinds.badRequest, "no google user")
        }
    }
}
export default GoogleOauthService