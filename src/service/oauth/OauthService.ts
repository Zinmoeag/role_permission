import OauthServiceInterface from "./interfaces/OauthServiceInterface";
import prisma from "../../../prisma/client";
import { ReturnUser } from "../../types/user";
import Service from "../service";
import {z} from "zod";
import { signWithRS256 } from "../../helper";
import { OauthUser } from "../../types/oauthType";
import { ReturnToken } from "../../types/authType";

class OauthService extends Service {
    _exclude = [
        "password"
    ];

    private OauthServiceInterface : OauthServiceInterface
    constructor(OauthServiceInterface : OauthServiceInterface) {
        super();
        this.OauthServiceInterface = OauthServiceInterface
    }

    async getOauthUser(code : string) : Promise<OauthUser> {
        const {access_token, id_token} = await this.OauthServiceInterface.getOauthToken(code);
        return await this.OauthServiceInterface.getOauthUser({access_token, id_token});
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

        const OauthUser : OauthUser= await this.getOauthUser(code);
        //store to database
        const user = await this.store(OauthUser);

        const accessToken = signWithRS256(user, "ACCESS_TOKEN_PRIVATE_KEY", {expiresIn : this.acesssTokenExp});
        const refreshToken = signWithRS256(user, "REFRESH_TOKEN_PRIVATE_KEY", {expiresIn: this.refreshTokenExp});
        return {accessToken, refreshToken};
    }

    // async test(code :string){
    //     const data : any = await this.OauthServiceInterface.getOauthToken(code);

    //     const user : OauthUser = await this.OauthServiceInterface.getOauthUser({access_token : data.access_token, id_token : "dd"});
    // }
}

export default OauthService;