import OauthServiceInterface from "./interfaces/OauthServiceInterface";
import prisma from "../../../prisma/client";
import { ReturnUser } from "../../types/user";
import Service from "../service";
import {z} from "zod";
import { signWithRS256 } from "../../helper";

class OauthService extends Service {
    _exclude = [
        "password"
    ];

    private OauthServiceInterface : OauthServiceInterface
    constructor(OauthServiceInterface : OauthServiceInterface) {
        super();
        this.OauthServiceInterface = OauthServiceInterface
    }

    async getOauthUser(code : string) {
        const {access_token, id_token} = await this.OauthServiceInterface.getOauthToken(code);
        return await this.OauthServiceInterface.getOauthUser({access_token, id_token});
    }

    async store(user : any) : Promise<z.infer<typeof ReturnUser>>{
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

    async login(code : string){

        const OauthUser = await this.getOauthUser(code);
        //store to data base
        const user = await this.store(OauthUser);

        const accessToken = signWithRS256(user, "ACCESS_TOKEN_PRIVATE_KEY", {expiresIn : this.acesssTokenExp});
        const refreshToken = signWithRS256(user, "REFRESH_TOKEN_PRIVATE_KEY", {expiresIn: this.refreshTokenExp});

        return {accessToken, refreshToken};
    }
}

export default OauthService;