import { Response, Request, NextFunction } from "express";
import { signWithRS256, verifyWithRS256 } from "../helper";
import AppError, { errorKinds } from "../utils/AppError";

const authMiddleWare = (
    req : Request, 
    res : Response, 
    next : NextFunction
    ) => {

    const token = req.cookies.ACCESS_TOKEN;
    if(!token){
        return next(AppError.new(errorKinds.notAuthorized , "Not Authorized").response(res)); 
    }
    try{
        verifyWithRS256(token, "ACCESS_TOKEN_PUBLIC_KEY");
    }catch(e){
        return next(AppError.new(errorKinds.invalidToken, "invalid Token").response(res));
    }
    next();
}

export default authMiddleWare;


//error Payload
const payload = {
    
}