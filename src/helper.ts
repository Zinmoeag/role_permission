import jwt, { SignOptions } from "jsonwebtoken";
import AppConfig from "./config";
import { ReturnUser } from "./types/user";
import {z} from "zod"; ;

export const signWithRS256 = (payload : z.infer<typeof ReturnUser>, key : "ACCESS_TOKEN_PRIVATE_KEY" | "REFRESH_TOKEN_PRIVATE_KEY", options : SignOptions) => {

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
    try{
        const publcKey = Buffer.from(AppConfig.getConfig(key), "base64").toString("ascii");
        
        const decoded = jwt.verify(
            token, 
            publcKey,
            {
                algorithms : ["RS256"],
            }
        )
    
        return decoded as T
    }catch(e){
        throw new Error("invalid token")
    }
}

export function exclude(propertiesToExclude: string[], obj: any): any {
    const result: any = {};

    for (const key in obj) {
        if (!propertiesToExclude.includes(key)) {
            result[key] = obj[key];
            if (typeof obj[key] === 'object') {
                const nestedResult = exclude(obj[key], propertiesToExclude.filter(prop => prop.startsWith(`${key}.`)).map(prop => prop.slice(key.length + 1)));
                if (Object.keys(nestedResult).length > 0) {
                    result[key] = nestedResult;
                }
            }
        }
    }

    console.log("inside ex", result)

    return result;
}