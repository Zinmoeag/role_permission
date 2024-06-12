import { StatusCode } from "./Status";
import { Response } from "express";

export const errorKinds = {
    invalidToken : "invalidToken",
    internalServerError : "internalErrorServer",

    notFound : "notFound",
    notAuthorized : "notAuthorized",    
} as const;

export type errorKindsType = typeof errorKinds[keyof typeof errorKinds]


class AppError extends Error {
    constructor(
        public error : errorKindsType, 
        public message : string, payload? : object
    ) {
        super();
    }

    static new(
        error : errorKindsType = errorKinds.internalServerError,
        message : string = "internal Server Error", 
        payload? : object,
    ){ 
        return new AppError(error, message);
    }

    response(res : Response){
        let error_status : StatusCode = StatusCode.InternalServerError;

        switch(this.error){
            case errorKinds.internalServerError : 
                error_status = StatusCode.InternalServerError
                break;
            case errorKinds.invalidToken : 
                error_status = StatusCode.Forbidden
                break;
            case errorKinds.notFound : 
                error_status = StatusCode.NotFound
                break;
            case errorKinds.notAuthorized : 
                error_status = StatusCode.Forbidden
                break;
        }

        return res
            .status(error_status)
            .json({
                message : this.message,
            });
    }
}

export default AppError;