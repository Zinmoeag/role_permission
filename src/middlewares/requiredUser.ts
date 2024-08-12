import { Request, Response, NextFunction } from "express";
import AppError, { errorKinds } from "../utils/AppError";

const requiredUser = (
    req : Request,
    res : Response,
    next : NextFunction
) => {
    //@ts-ignore
    if(req.user){
        return next();
    }
    
    next(AppError.new(errorKinds.badRequest, "Session has expired or user does not exist"));
}
export default requiredUser;