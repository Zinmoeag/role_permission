import prisma from "../../prisma/client";
import bcrypt from "bcrypt";
import { signWithRS256, verifyWithRS256 } from "../helper";
import Service from "./service";
import AppError, { errorKinds } from "../utils/AppError";
import {z} from "zod";
import { LoginCredentialSchema, RegisterCredentialSchema } from "../schema/authSchema";
import { ReturnUser } from "../types/user";
import Verification from "./Auth/Verification";


const _saltRound = 10;

type ReturnToken = {
    accessToken : string,
    refreshToken : string,
    user : z.infer<typeof ReturnUser>,
}

type Register = {
  isVerfyEmailSend : boolean,
}

export default class AuthService extends Service {

    private verification = new Verification();

    _exclude = [
        "password",
        "role.id",
        "permission.id"
    ];

    acesssTokenExp = "20s";
    refreshTokenExp = "1d";

    constructor(){
        super()
    }

    async verifyAccount(verificationCode : string){
      await this.verification.VerifyAccount(verificationCode);
    }

    async register(data : z.infer<typeof RegisterCredentialSchema>) : Promise<any>{

        const isEmailUsed = await prisma.user.findFirst({
            where: {
                email: data.email,
            },
        });
    
        //email unique
        if (isEmailUsed) throw AppError.new(
            errorKinds.alreadyExist, 
            "email already existed", 
            {
                email : ["email is already existed"]
            }
        );

        const salt = bcrypt.genSaltSync(_saltRound);
        const hashedPassword = bcrypt.hashSync(data.password, salt);

        const rawUser = await prisma.user.create({
            data : {
                name : data.name,
                email : data.email,
                password : hashedPassword,
                verify : false,
            },
            include : {
                role : {
                  include : {
                    permissions : {
                      include : {
                        permission : true
                      }
                    },
                  }
                }
              },
            })

        //storing data
        const user : z.infer<typeof ReturnUser> = this.getUser(rawUser);

        try{
        // verify account
          await this.verification.request(rawUser);
          return {isSuccess : true}
        }catch(err){
            throw new AppError(errorKinds.internalServerError, "verification failed");
        }
        
    }

    async login(data : z.infer<typeof LoginCredentialSchema>) : Promise<ReturnToken>{
        const foundUser = await prisma.user.findFirst({
            where : {
                email : data.email,
            },
            include : {
                role : {
                  include : {
                    permissions : {
                      include : {
                        permission : true
                      }
                    },
                  }
                }
              },
        })
    
        if(!foundUser) throw AppError.new(
            errorKinds.invalidCredential, 
            "invalid credential",
            {
                email : ["invalid email"],
            }
        )

        const isPasswordMatch = await bcrypt.compare(data.password, foundUser.password);
        if(!isPasswordMatch) throw AppError.new(
            errorKinds.invalidCredential, 
            "invalid credential",
            {
                password : ["invalid password"],
            }
        )   
        
        const user: z.infer<typeof ReturnUser> = this.getUser(foundUser)

        const accessToken = signWithRS256(user, "ACCESS_TOKEN_PRIVATE_KEY", {
            expiresIn : this.acesssTokenExp
        });

        const refreshToken = signWithRS256(user, "REFRESH_TOKEN_PRIVATE_KEY",{
            expiresIn : this.refreshTokenExp
        })

        return {accessToken, refreshToken, user};
    }

    async generateAccessToken(refreshToken : string) : Promise<ReturnToken>{
        const user = verifyWithRS256<z.infer<typeof ReturnUser>>(
            refreshToken,
            "REFRESH_TOKEN_PUBLIC_KEY"
          );
    
          if (!user) throw AppError.new(errorKinds.invalidToken,"Invalid User")
    
          const foundUser = await prisma.user.findUnique({
            where: {
              id: user.id,
            },
            include : {
                role : {
                  include : {
                    permissions : {
                      include : {
                        permission : true
                      }
                    },
                  }
                }
              },
          });
    
          const tokenUser = this.getUser(foundUser);
          const accessToken = signWithRS256(tokenUser, "ACCESS_TOKEN_PRIVATE_KEY", {
            expiresIn: this.acesssTokenExp,
          });

          return {
            accessToken, 
            user : tokenUser,
            refreshToken,
          };
    }

    async testService(){
        const foundUser = await prisma.user.findFirst({
            where : {
                email : "zin@gmail.com",
            },
            include : {
                role : {
                    include : {
                        permissions : true
                    }
                }
            }
        })
    }
}