import axios from "axios"
import AppConfig from "../config";
import qs from "qs"
import Service from "./service";
import GoogleOauthService from "./oauth/googleOauthService";
import AppError, { errorKinds } from "../utils/AppError";
import prisma from "../../prisma/client";
import { signWithRS256 } from "../helper";
import { ReturnToken } from "../types/authType";

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

type Provider = "GOOGLE";


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
        throw new Error("wrong id_token or access_token");
    }
}

export default class OauthService extends Service {

  _exclude = [
      "password"
  ];

  constructor(){
      super()
  }

  async getOauthUser(provider : Provider, code : string){
    switch(provider){
      case "GOOGLE":
        const googleOauthService = new GoogleOauthService(code);
        const googleUser = await googleOauthService.do();
        return googleUser;
    }
  }

  async oauthHandler (provider : Provider, code : string) : Promise<ReturnToken>{

      try{
        const user = await this.getOauthUser(provider, code);

        const newUser = await prisma.user.upsert({
          where : {
            email : user.email
          },
          update : {},
          create : {
            name : user.name,
            email : user.email,
            password : ""
          },
          include : {
            role : true
          }
        })

        const tokenUser = {
            id : newUser.id,
            name : newUser.name,
            email : newUser.email,
            roleId : newUser.role.role_id,
            role_name : newUser.role.role_name
        }

        const accessToken = signWithRS256(tokenUser, "ACCESS_TOKEN_PRIVATE_KEY", {expiresIn : "1d"});
        const refreshToken = signWithRS256(tokenUser, "REFRESH_TOKEN_PRIVATE_KEY", {expiresIn: "7d"});

        return {accessToken, refreshToken};

      }catch(err){
        if(err instanceof AppError){
          throw err;
        }
        throw AppError.new(errorKinds.internalServerError, "Internal Server Error");
      }
  }
}