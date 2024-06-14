import { Payload } from "@prisma/client/runtime/library";
import { StatusCode } from "./Status";
import { Response } from "express";

type payload = {
    [key : string] : string[]
}

type errorPayload<T extends payload> = {
    message : string,
    errors? : T | {}
}



export const errorKinds = {
    invalidToken : "invalidToken",
    internalServerError : "internalErrorServer",
    validationFailed : "validationFailed",
    notFound : "notFound",
    notAuthorized : "notAuthorized", 
} as const;



export type errorKindsType = typeof errorKinds[keyof typeof errorKinds]


class AppError extends Error {
    constructor(
        public error : errorKindsType, 
        public message : string, 
        payload? : object
    ) {
        super();
    }

    static new(
        error : errorKindsType = errorKinds.internalServerError,
        message : string = "internal Server Error", 
    ){ 
        return new AppError(error, message);
    }

    errorPayload <T extends payload>(payload? : T) : errorPayload<T> | object {
        return {
            message : this.message,
            errors : payload ? payload : {}
        }
    }   

    response(res : Response, payload? : payload){
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
            case errorKinds.validationFailed :
                error_status = StatusCode.UnprocessableEntity
        }


        res
            .status(error_status)
            .json(payload && this.errorPayload(payload));
    }
}

export default AppError;