import { StatusCode } from "./Status";
import { Response } from "express";

type payload = {
    [key in string | number | symbol] : string[]
}

type errorPayload<T extends payload> = {
    message : string,
    errors? : T | {}
}

export const errorKinds = {
    invalidToken : "invalidToken",
    internalServerError : "internalErrorServer",
    validationFailed : "validationFailed",
    invalidCredential : "invalidCredential",
    notFound : "notFound",
    notAuthorized : "notAuthorized",
    alreadyExist : "alreadyExist",
    forbidden : "forbidden",
    badRequest : "badRequest",
    mailboxUnavailable : "mailboxUnavailable"
} as const;

export type errorKindsType = typeof errorKinds[keyof typeof errorKinds]

export const isErrorKinds = (message : any) : message is errorKindsType => {
    return Object.values(errorKinds).includes(message);
}

class AppError extends Error {
     
    constructor(
        public error : errorKindsType, 
        public message : string, 
        public payload? : payload | {},
    ) {
        super();
    }

    static new(
        error : errorKindsType = errorKinds.internalServerError,
        message : string = "internal Server Error", 
        payload? : payload
    ){ 
        return payload 
            ? new AppError(error, message, payload)
            : new AppError(error, message)
    }

    errorPayload(payload? : payload) : errorPayload<payload | {}> {
        return {
            message : this.message,
            errors : payload ? payload : {}
        }
    }
    
    getStatus(){
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
                error_status = StatusCode.Unauthorized
                break;
            case errorKinds.validationFailed :
                error_status = StatusCode.UnprocessableEntity
                break;
            case errorKinds.invalidCredential : 
                error_status = StatusCode.UnprocessableEntity
                break;
            case errorKinds.alreadyExist : 
                error_status = StatusCode.Conflict
                break;
            case errorKinds.forbidden : 
                error_status = StatusCode.Forbidden
                break;
            case errorKinds.badRequest : 
                error_status = StatusCode.BadRequest
                break;
            case errorKinds.mailboxUnavailable : 
                error_status = StatusCode.MailboxUnavailable
                break;
        }
        return error_status;
    }

    response(res : Response){

        const error_status = this.getStatus();
        return res.status(error_status)
            .json(this.errorPayload(this.payload)).end();
    }
}

export default AppError;