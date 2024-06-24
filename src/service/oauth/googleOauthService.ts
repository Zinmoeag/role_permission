import AppConfig from "../../config";
import { GoogleOauthToken, GoogleUserResult } from "../../types/oauthType";
import axios from "axios";
import qs from "qs";
import AppError, { errorKinds } from "../../utils/AppError";

export default class GoogleOauthService {

    constructor(private code : string){}

    async do(){

      try{
        const {access_token, id_token} = await this.getGoogleOauthToken(this.code);
        const googleUser = await this.getGoogleUser({id_token, access_token});

        return googleUser;
      }catch(err){
        
        throw AppError.new(errorKinds.badRequest, "Authorization failed to google");
      }
    }
    
     private async getGoogleOauthToken(code : string) : Promise<GoogleOauthToken> {
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
                
              return data;
            } catch (err: any) {
              throw AppError.new(errorKinds.badRequest, "unauthorized to Google")
            }
     }

     private async getGoogleUser({
        access_token,
        id_token
     } : {
        access_token : string
        id_token : string
     }){
        const targetUrl = `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`;

        try{
            const {data} = await axios.get<GoogleUserResult>(targetUrl, {
                headers : {
                    Authorization : `Bearer ${id_token}`
                }
            })
        
            return data;
        }catch(err){
            throw AppError.new(errorKinds.badRequest, "no google user")
        }
     }
}
