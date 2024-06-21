import { NextFunction, Request, Response } from "express";
import { signWithRS256, verifyWithRS256 } from "../helper";
import prisma from "../../prisma/client";
import { z } from "zod";
import { ReturnUser } from "../types/user";
import AuthService from "../service/authService";
import AppError, { errorKinds } from "../utils/AppError";
import { getGoogleOauthToken, getGoogleUser } from "../service/oauthService";

const service = new AuthService();

const loginCredentialSchema = z.object({
  name: z.string(),
  email: z.string().email({
    message: "Invalid email address",
  }),
  password: z.string().min(8, "at least should have 8").max(20, "20 is max"),
});

class OauthController {

    googleOauth = async (req: Request, res: Response, next: NextFunction) => {

        const code = req.body.code;
        const pathUrl = (req.query.state as string) || "/";

        if(!code){
            return AppError.new(errorKinds.badRequest, "code is required").response(res);
        }

        const {access_token, id_token} = await getGoogleOauthToken({code});

        if(!access_token || !id_token){
            return AppError.new(errorKinds.badRequest, "access_token or id_token is required").response(res);
        }

        const googleUser = await getGoogleUser({id_token, access_token});
        if(!googleUser) return AppError.new(errorKinds.badRequest, "googleUser is required").response(res);

        const foundUser = await prisma.user.findUnique({
            where : {
                email : googleUser.email
            }
        });
        if(!foundUser) return AppError.new(errorKinds.badRequest, "user is already register").response(res);

        const user = await prisma.user.create({
            data : {
                name : googleUser.name,
                email : googleUser.email,
                password : "",
            },
            include : {
                role : true
            }
        })

        const tokenUser = {
            id : user.id,
            name : user.name,
            email : user.email,
            roleId : user.role.role_id,
            role_name : user.role.role_name
        }

        const accessToken = signWithRS256(tokenUser, "ACCESS_TOKEN_PRIVATE_KEY", {expiresIn : "1d"});
        const refreshToken = signWithRS256(tokenUser, "REFRESH_TOKEN_PRIVATE_KEY", {expiresIn: "7d"});

        res.cookie("jwt", refreshToken, { httpOnly: true, secure: true });
        return res.status(200).json({ accessToken }).end();
    }
}

const oauthController = new OauthController();
export default oauthController;

