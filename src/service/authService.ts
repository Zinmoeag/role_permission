import prisma from "../../prisma/client";
import bcrypt from "bcrypt";
import { signWithRS256 } from "../helper";
import Service from "./service";
import AppError, { errorKinds, errorKindsType } from "../utils/AppError";
import {z} from "zod";
import { LoginCredentialSchema, RegisterCredentialSchema } from "../schema/authSchema";

const _saltRound = 10;

type ReturnToken = {
    accessToken : string,
    refreshToken : string,
}

export default class AuthService extends Service {

    _exclude = [
        "password"
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
                role : true
            }
        })
        
        const user = {
            id : rawUser.id,
            name : rawUser.name,
            email : rawUser.email,
            roleId : rawUser.roleId,
            role_name : rawUser.role.role_name,
        }

        const accessToken = signWithRS256(user, "ACCESS_TOKEN_PRIVATE_KEY", {
            expiresIn : '5m'
        });
        const refreshToken = signWithRS256(user, 'REFRESH_TOKEN_PRIVATE_KEY', {
            expiresIn : "1d"
        });
        
        return {accessToken, refreshToken}
    }

    async login(data : z.infer<typeof LoginCredentialSchema>) : Promise<ReturnToken>{
        const foundUser = await prisma.user.findFirst({
            where : {
                email : data.email,
            },
            include : {
                role : true
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
        
        const  user ={
            id : foundUser.id,
            name : foundUser.name,
            email : foundUser.email,
            roleId  : foundUser.roleId,
            role_name : foundUser.role.role_name,
        }

        const accessToken = signWithRS256(user, "ACCESS_TOKEN_PRIVATE_KEY", {
            expiresIn : "5m"
        });

        const refreshToken = signWithRS256(user, "REFRESH_TOKEN_PRIVATE_KEY",{
            expiresIn : "1d"
        })

        return {accessToken, refreshToken};
    }
}