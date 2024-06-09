import prisma from "../../prisma/client";
import bcrypt from "bcrypt";
import { signWithRS256 } from "../helper";
import Service from "./service";

const _saltRound = 10;


type User = {
    name : string,
    email : string,
    password : string,
}

type ReturnToken = {
    accessToken : string,
    refreshToken : string,
}

// function exclude<User, Key extends keyof User>(
//     user: User & Record<string, any>,
//     keys: Key[]
//   ): Omit<User, Key> {
//     const filteredEntries = Object.entries(user).filter(
//       ([key]) => !keys.includes(key as Key)
//     );
  
//     return Object.fromEntries(filteredEntries) as unknown as Omit<User, Key>;
//   }


export default class AuthService extends Service {

    _exclude = [
        "password"
    ];

    constructor(){
        super()
    }

    async register(data : User) : Promise<ReturnToken>{
        //validation 
        const salt = bcrypt.genSaltSync(_saltRound);
        const hashedPassword = bcrypt.hashSync(data.password, salt);
        //storing data
        try{
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
            const user = this.exclude(rawUser)      

            const accessToken = signWithRS256(user, "ACCESS_TOKEN_PRIVATE_KEY", {
                expiresIn : '20s'
            });
            const refreshToken = signWithRS256(user, 'REFRESH_TOKEN_PRIVATE_KEY', {
                expiresIn : "1d"
            });
            
            return {accessToken, refreshToken}
        }catch(e){
            console.log(e)
            throw new Error("something is wrong");
        }
    }
}