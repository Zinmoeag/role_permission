import prisma from "../../prisma/client";
import bcrypt from "bcrypt";
import { signWithRS256, verifyWithRS256 } from "../helper";
import Service from "./service";
import AppError, { errorKinds } from "../utils/AppError";
import {z} from "zod";
import { LoginCredentialSchema, RegisterCredentialSchema } from "../schema/authSchema";
import { ReturnUser } from "../types/user";


const _saltRound = 10;

type ReturnToken = {
    accessToken : string,
    refreshToken : string,
    user : z.infer<typeof ReturnUser>,
}

export default class AuthService extends Service {

    _exclude = [
        "password",
        "role.id",
        "permission.id"
    ];

    constructor(){
        super()
    }

    async register(data : z.infer<typeof RegisterCredentialSchema>) : Promise<ReturnToken>{

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
        //storing data
        const rawUser  = await prisma.user.create({
            data : {
                name : data.name,
                email : data.email,
                password : hashedPassword,
            },
            include : {
                role : {
                    include : {
                        permissions : true
                    }
                }
            }
        })
        
        const user : z.infer<typeof ReturnUser> = this.getUser(rawUser);

        const accessToken = signWithRS256(user, "ACCESS_TOKEN_PRIVATE_KEY", {
            expiresIn : '5m'
        });
        const refreshToken = signWithRS256(user, 'REFRESH_TOKEN_PRIVATE_KEY', {
            expiresIn : "1d"
        });
        
        return {accessToken, refreshToken, user};
    }

    async login(data : z.infer<typeof LoginCredentialSchema>) : Promise<ReturnToken>{
        const foundUser = await prisma.user.findFirst({
            where : {
                email : data.email,
            },
            include : {
                role : {
                    include : {
                        permissions : true
                    }
                }
            }
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
            expiresIn : "20s"
        });

        const refreshToken = signWithRS256(user, "REFRESH_TOKEN_PRIVATE_KEY",{
            expiresIn : "1d"
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
            include: {
              role: {
               include : {
                permissions : true
               }
              },
            },
          });
    
          const tokenUser = this.getUser(foundUser);
          const accessToken = signWithRS256(tokenUser, "ACCESS_TOKEN_PRIVATE_KEY", {
            expiresIn: "1d",
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