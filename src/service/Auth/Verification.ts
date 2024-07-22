import prisma from "../../../prisma/client";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import VerifyEmail from "../Email/VerfifyEmail";
import AppError, { errorKinds } from "../../utils/AppError";

type User = {
    email : string,
    name : string,
    verify : boolean
}

type VerificationCode = {
    hashedVerificationCode : string,
    unhashedVerificationCode : string,
  }

class Verification {
    _saltRound = 10;

    async request(user : User) : Promise<VerificationCode> {
        const salt = bcrypt.genSaltSync(this._saltRound);
        const unhashedVerificationCode = uuidv4();
        const hashedVerificationCode = bcrypt.hashSync(unhashedVerificationCode, salt);

        try{
            const userAccount = await prisma.user.update({
                where : {
                email : user.email
                },
                data : {
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
    
            await verifyEmail.send();
    
            return {
               hashedVerificationCode,
               unhashedVerificationCode
            }
        }catch(err){
            if(err instanceof AppError){
                throw err
            }
            throw AppError.new(errorKinds.internalServerError, "Verification failed")
        }
    }

    async VerifyAccount(verificationCode : string){
        console.log(verificationCode);
        try{
            const verifiedUser = await prisma.user.update({
                where : {
                    verificationCode : verificationCode
                },
                data : {
                    verify : true
                }
            })
            console.log(verifiedUser)
            return {
                verifiedUser
            }
        }catch(err){
            throw AppError.new(errorKinds.badRequest, "verification failed for this user");
        }
    }
}
export default Verification;