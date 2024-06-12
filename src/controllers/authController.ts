import { NextFunction, Request, Response } from "express";
import { signWithRS256, verifyWithRS256 } from "../helper";
import prisma from "../../prisma/client";
import {z} from "zod";
import { ReturnUser } from "../types/user";
import AuthService from "../service/authService";
import AppError, { errorKinds } from "../utils/AppError";

const userSchema = z.object({
    id : z.string(),
    name : z.string(),
    email : z.string().email(),
    roleId : z.number(),
    role : z.object({
        role_id : z.number(),
        id : z.string(),
        role_name : z.string(),
    })
})

const _saltRound = 10;

const service = new AuthService();

const loginCredentialSchema = z.object({
    name : z.string(),
    email : z.string()
             .email({
                message : "Invalid email address"
              }),
    password : z.string()
                .min(8, "at least should have 8")
                .max(20, "20 is max")
})


class AuthController{
    async refreshTokenController(
        req : Request,
        res : Response, 
        next : NextFunction
    ){
        const refreshToken = req.cookies.jwt;

        if(!refreshToken){
            next(AppError.new(errorKinds.invalidToken, "invalid refresh Token").response(res))
        }

        let user;
        try{
            user = verifyWithRS256<z.infer<typeof ReturnUser>>(
                refreshToken, "REFRESH_TOKEN_PUBLIC_KEY"
            );
        
            if(!user) return next(AppError.new(errorKinds.invalidToken, "invalid refresh Token").response(res));

            const foundUser = await prisma.user.findUnique({
                where : {
                    id : user.id
                },
                include : {
                    role : true
                }
            })

            const tokenUser = {
                id : foundUser.id,
                name : foundUser.name,
                email : foundUser.email,
                roleId : foundUser.roleId,
                role_name : foundUser.role.name
            }

            const accessToken = signWithRS256(tokenUser, "ACCESS_TOKEN_PRIVATE_KEY", {expiresIn : "20s"});
            return res.status(200).json({accessToken});

        }catch(e){
            // return res.sendStatus(403);
            return next(e)
        }

    }

    async  registerController(
        req : Request,
        res : Response,
        next : NextFunction,
    ){
        const cleanData = loginCredentialSchema.safeParse(req.body);
        if(!cleanData.success){
            // throw new Error("422")
            return res.sendStatus(422);
            // next(AppError.new(errorKinds.))
        }
    
        try{
            const {accessToken, refreshToken} = await service.register(cleanData.data)
            //set Cookies
            // res.cookie('ACCESS_TOKEN', accessToken, {httpOnly : true, secure : true});
            res.cookie("jwt", refreshToken, {httpOnly : true, secure : true});
            return res.status(200).json({accessToken}).end();
            
        }catch(e){
            // throw new Error("500")
            // return res.sendStatus(500);
            console.log("throww")
            next(e)
        }
    }
}

const authController = new AuthController();
export default authController;