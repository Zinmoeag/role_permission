import jwt, { SignOptions } from "jsonwebtoken";
import AppConfig from "./config";


//sign token
export const signJwt = (payload : object, options : SignOptions) : string => {
    const key = AppConfig.getConfig("jwtSecretKey");    
    
    return jwt.sign(payload, key, {
        algorithm : 'HS256',
    })
}


//verify
export const verifyJwt = <T>(token : string) : T | null => {
    try{        
        const decoded = jwt.verify(token, AppConfig.getConfig("jwtSecretKey")) as T

        return decoded;
    }catch(err){
        return null;
    }
}