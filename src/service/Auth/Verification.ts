import prisma from "../../../prisma/client";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import VerifyEmail from "../Email/VerfifyEmail";
import AppError, { errorKinds } from "../../utils/AppError";
import { isExpired } from "../../helper";
import { returnStates, Result } from "../../types"
import { ReturnUser } from "../../types/user";
import {z} from 'zod';
import { User } from "../../core/entitity/User";

type VerifiedUser = {
    verifiedUser : z.infer<typeof ReturnUser>
}

type VerificationCode = {
    unhashedVerificationCode : string,
}

class Verification {
    _saltRound = 10;
    _verificatonCodeExpired = 60 * 1000;

    async request(user : User) : Promise<any> {

        const salt = bcrypt.genSaltSync(this._saltRound);
        const unhashedVerificationCode = uuidv4();
        const hashedVerificationCode = bcrypt.hashSync(unhashedVerificationCode, salt);
        const verificationCodeExpiredAt = new Date(Date.now() + this._verificatonCodeExpired);

        try{    
            const userAccount = await prisma.user.update({
                where : {
                    email : user.email
                },
                data : {
                    verificationCode_expried : verificationCodeExpiredAt,
                    verificationCode : unhashedVerificationCode,
                    verify : false,
                }
            })

            const verifyEmail = new VerifyEmail({
                name : user.name,
                to : user.email,
                from : "admin@gmail.com",
                mailObj : {
                    url : `http://localhost:4000/verify_email/${unhashedVerificationCode}`
                }
            });
    
            const info = await verifyEmail.send();

        }catch(err){
            if(err instanceof AppError){
                throw err;
            }
            throw AppError.new(errorKinds.internalServerError, "Failed To Verify")
        }
    }

    async VerifyAccount(verificationCode : string) : Promise<Result<VerifiedUser, any>> {
        try{
            const foundUser = await prisma.user.findUnique({
                where : {
                    verificationCode : verificationCode
                }
            });

            if(!foundUser) return {
                state : returnStates.FAILED,
                errorKind : errorKinds.badRequest,
                message : "Invalid Verification Code",
                errors : null
            }
            const isVerificationCodeExpired = isExpired(foundUser.verificationCode_expried, this._verificatonCodeExpired);

            if(isVerificationCodeExpired) return {
                state : returnStates.FAILED,
                errorKind : errorKinds.badRequest,
                message : "Verification Session Expired",
                errors : null,
            }

            const verifiedUser = await prisma.user.update({
                where : {
                    verificationCode : verificationCode
                },
                data : {
                    verify : true
                }
            })

            return {
                state : returnStates.SUCCESS,
                payload : {
                    verifiedUser : verifiedUser
                }
            }
        }catch(err){
            return {
                state : returnStates.FAILED,
                errorKind : errorKinds.badRequest,
                message : "Verification Failed For This Account",
                errors : null
            }
        }
    }
}
export default Verification;