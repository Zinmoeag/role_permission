import { Response, Request, NextFunction } from "express";
import { signWithRS256, verifyWithRS256 } from "../helper";

const authMiddleWare = (
    req : Request, 
    res : Response, 
    next : NextFunction
    ) => {
    const token = req.cookies.ACCESS_TOKEN;
    if(!token){
        return res.sendStatus(403)
        
    }
    try{
        verifyWithRS256(token, "ACCESS_TOKEN_PUBLIC_KEY");
    }catch(e){
        console.log("expire or smth")
        return res.sendStatus(403)
    }
    next();
}

export default authMiddleWare;