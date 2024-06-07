import jwt, { SignOptions } from "jsonwebtoken";
import AppConfig from "./config";
import { StringDecoder } from "string_decoder";
import { getEnabledCategories } from "trace_events";


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


///RS256
export const signWithRS256 = (payload : object, key : "ACCESS_TOKEN_PRIVATE_KEY" | "REFRESH_TOKEN_PRIVATE_KEY", options? : SignOptions) => {

    const encodedPrivateKey = Buffer.from(AppConfig.getConfig(key), "base64").toString("ascii");
    
    const token = jwt.sign(
        payload, 
        encodedPrivateKey ,
        {
            ...(options && options),
            algorithm : "RS256"
        }
    ) 
    return token;
}

export const verifyWithRS256 = <T>(token : string, key : "ACCESS_TOKEN_PUBLIC_KEY" | "REFRESH_TOKEN_PUBLIC_KEY") : T | null => {
    // return  "hello
    try{
        const publcKey = Buffer.from(AppConfig.getConfig(key), "base64").toString("ascii");
        
        const decoded = jwt.verify(token, publcKey)
    
        return decoded as T
    }catch(e){
        throw new Error("invalid token")
    }
}