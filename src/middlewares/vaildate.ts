import { NextFunction, Request, Response } from "express";
import {z} from "zod";
import AppError, { errorKinds } from "../utils/AppError";

const validate = (Schema : z.Schema) => {
    return (req : Request, res : Response, next : NextFunction) => {
        const validation = Schema.safeParse(req.body);
        if(!validation.success){
            console.log("failed")
            next(
                AppError.new(
                    errorKinds.validationFailed, 
                    "validation Failed",
                    // validation.error?.formErrors.fieldErrors
                )
            )            
        }else{
            next();
        }
    }
}
export default validate;