import { Response, Request, NextFunction } from "express";
import { verifyWithRS256 } from "../helper";
import AppError, { errorKinds } from "../utils/AppError";
import prisma from "../../prisma/client";
import { ReturnUser } from "../types/user";
import {z} from "zod";
import { getUser } from "../utils/auth";

export interface AuthRequest extends Request {
    user : z.infer<typeof ReturnUser>
}

const authMiddleWare = async (
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
        const userFromToken : any = verifyWithRS256(accessToken, "ACCESS_TOKEN_PUBLIC_KEY");

        if(!userFromToken){
            return AppError.new(errorKinds.notAuthorized , "token is not present").response(res);
        }
        const user = await prisma.user.findUnique({
            where : {
                id : userFromToken.id
            },
            include : {
                role : {
                    include : {
                        permissions : {
                            include : {
                                permission : true
                            },
                        }
                    }
                }
            }
        });

        if(!user) return AppError.new(errorKinds.notAuthorized, "token is not invalid").response(res);

        const authReq = req as AuthRequest;
        authReq.user = getUser(user);
        
    }catch(e){
        console.log(e)
        if(e instanceof AppError){
            return e.response(res)
        }else{
            return AppError.new(errorKinds.internalServerError, "internal Server Error").response(res);
        }
    }
    return next();
}


export default authMiddleWare;