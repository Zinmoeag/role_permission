import axios from "axios"
import AppConfig from "../config";
import qs from "qs"

interface GoogleOauthToken {
    access_token: string;
    id_token: string;
    expires_in: number;
    refresh_token: string;
    token_type: string;
    scope: string;
}

interface GoogleUserResult {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    locale: string;
  }


export const getGoogleOauthToken = async ({
    code,
} : {
    code : string
}) : Promise<GoogleOauthToken> => {
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
        console.log("Failed to fetch Google Oauth Tokens");
        throw new Error(err);
      }
    
}


export const getGoogleUser = async ({
    id_token,
    access_token,
} : {
    id_token : string,
    access_token : string
}) : Promise<GoogleUserResult> => {

    const targetUrl = `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`;

    try{
        const {data} = await axios.get<GoogleUserResult>(targetUrl, {
            headers : {
                Authorization : `Bearer ${id_token}`
            }
        })
    
        return data;
    }catch(err){
        console.log(err);
        throw new Error("wrong id_token or access_token");
    }

}