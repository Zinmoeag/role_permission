import prisma from "../../prisma/client";
import bcrypt from "bcrypt";
import { signWithRS256, verifyWithRS256 } from "../helper";
import Service from "./service";
import AppError, { errorKinds } from "../utils/AppError";
import {z} from "zod";
import { LoginCredentialSchema, RegisterCredentialSchema } from "../schema/authSchema";
import { ReturnUser } from "../types/user";
import Verification from "./Auth/Verification";
import { LoginOrRequestVerfy, LoginOrRequestVerifyResponse, LoginResponse, RequestVerifyEmail } from "../types/authType";
import { Result } from "../types";


const _saltRound = 10;

type ReturnToken = {
    access_token : string,
    refresh_Token : string,
    user? : z.infer<typeof ReturnUser>,
}

type VerfifyEmail = {
    verify : false,
    isVerifiedMessageSend : boolean,
}

type ReturnLogin = ReturnToken | VerfifyEmail

type Register = {
  isVerfyEmailSent : boolean,
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

    async verifyAccount(verificationCode : string) {
      return await this.verification.VerifyAccount(verificationCode);
    }

    async checkUserCredential(data : z.infer<typeof LoginCredentialSchema>){
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
      return foundUser;
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
      
    async login(user : z.infer<typeof ReturnUser>) : Promise<ReturnToken>{
        const access_token = signWithRS256(user, "ACCESS_TOKEN_PRIVATE_KEY", {
        expiresIn : this.acesssTokenExp
      });

      const refresh_Token = signWithRS256(user, "REFRESH_TOKEN_PRIVATE_KEY",{
          expiresIn : this.refreshTokenExp
      })

      return {
        access_token, refresh_Token
      }
    }

    async loginOrReqVerify(data : z.infer<typeof LoginCredentialSchema>) : Promise<LoginOrRequestVerifyResponse>{
        try{
          const foundUser = await this.checkUserCredential(data);
          if(foundUser.verify === false){
            await this.verification.request(foundUser);
            return {
              type : LoginOrRequestVerfy.REQUEST_VERFIFY_RESPONSE,
              is_verfiy_email_sent : true,
            }
          }
  
          // login process
          const user: z.infer<typeof ReturnUser> = this.getUser(foundUser);
          const {access_token, refresh_Token} = await this.login(user);
  
          return {
            type : LoginOrRequestVerfy.LOGIN_RESPONSE,
            is_auth : true,
            access_token,
            refresh_token : refresh_Token,
            user
          }
        }catch(err){
          if(err instanceof AppError){
            throw err
          }else{
            throw AppError.new(errorKinds.internalServerError, "Login process failed")
          }
        }
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
          const access_token = signWithRS256(tokenUser, "ACCESS_TOKEN_PRIVATE_KEY", {
            expiresIn: this.acesssTokenExp,
          });

          return {
            user : tokenUser,
            access_token, 
            refresh_Token : refreshToken,
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