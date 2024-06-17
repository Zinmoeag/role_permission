import { Response, Request, NextFunction } from "express";
import { verifyWithRS256 } from "../helper";
import AppError, { errorKinds } from "../utils/AppError";

const authMiddleWare = (
    req : Request, 
    res : Response, 
    next : NextFunction
    ) => {

    const token = req.header("Authorization");

    if(!token || !token.startsWith("Bearer ")) {
        return AppError.new(errorKinds.notAuthorized , "Not Authorized").response(res);
    }

    const accessToken = token.split(" ")[1];

    if(!accessToken){
        return AppError.new(errorKinds.notAuthorized , "Not Authorized").response(res);
    }
    
    try{
        verifyWithRS256(accessToken, "ACCESS_TOKEN_PUBLIC_KEY");
    }catch(e){
        return AppError.new(errorKinds.invalidToken, "invalid Token").response(res);
    }

    next();
}


export default authMiddleWare;