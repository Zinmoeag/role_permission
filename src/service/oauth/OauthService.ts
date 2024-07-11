import OauthServiceInterface from "./interfaces/OauthServiceInterface";
import prisma from "../../../prisma/client";
import { ReturnUser } from "../../types/user";
import Service from "../service";
import {z} from "zod";
import { signWithRS256 } from "../../helper";
import { OauthToken, OauthUser } from "../../types/oauthType";
import { ReturnToken } from "../../types/authType";
import AppError from "../../utils/AppError";
import { errorKinds } from "../../utils/AppError";

class OauthService<T extends OauthToken> extends Service {
    _exclude = [
        "password"
    ];

    private OauthServiceInterface : OauthServiceInterface<T>
    constructor(OauthServiceInterface : OauthServiceInterface<T>) {
        super();
        this.OauthServiceInterface = OauthServiceInterface
    }

    async getOauthUser(code : string) : Promise<OauthUser> {
        const tokens : T = await this.OauthServiceInterface.getOauthToken(code);
        return await this.OauthServiceInterface.getOauthUser(tokens);
    }

    async store(user : OauthUser) : Promise<z.infer<typeof ReturnUser>>{
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
              role : {
                include : {
                  permissions : true,
                }
              }
            },
        })
        return this.getUser(newUser);
    }

    async login(code : string) : Promise<ReturnToken> {

        try{
          const OauthUser : OauthUser= await this.getOauthUser(code);
          //store to database
          const user = await this.store(OauthUser);
  
          const accessToken = signWithRS256(user, "ACCESS_TOKEN_PRIVATE_KEY", {expiresIn : this.acesssTokenExp});
          const refreshToken = signWithRS256(user, "REFRESH_TOKEN_PRIVATE_KEY", {expiresIn: this.refreshTokenExp});
          return {accessToken, refreshToken};
        }catch(err){
          if(err instanceof AppError){
            //handling error from service
            throw err
          }
          throw AppError.new(errorKinds.internalServerError, "internal server error during login");
        }
    }

}

export default OauthService;