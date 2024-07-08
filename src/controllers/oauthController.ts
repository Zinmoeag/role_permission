import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import AppError, { errorKinds } from "../utils/AppError";
import OauthService, { getGoogleOauthToken, getGoogleUser } from "../service/oauthService";
import { ReturnToken } from "../types/authType";
import qs from "qs";

const oauthService = new OauthService();

const loginCredentialSchema = z.object({
  name: z.string(),
  email: z.string().email({
    message: "Invalid email address",
  }),
  password: z.string().min(8, "at least should have 8").max(20, "20 is max"),
});

class OauthController {

    googleOauth = async (req: Request, res: Response, next: NextFunction) => {

        const code = req.query.code as string;
        const pathUrl = (req.query.state as string) || "/";

        if(!code){
            return AppError.new(errorKinds.badRequest, "code is required").response(res);
        }

        try{
            const {accessToken, refreshToken} : ReturnToken = await oauthService.oauthHandler("GOOGLE", code);

            res.cookie("jwt", refreshToken, { httpOnly: true, secure: true });
            // res.json({accessToken}).end(); 
            const encodedToken = encodeURIComponent(accessToken);
            const params = qs.stringify({ token: encodedToken });

            res.redirect(`${pathUrl}?${params}`);

        }catch(err){
            if(err instanceof AppError){
                return err.response(res);
            }
            return AppError.new(errorKinds.internalServerError, "internal server error").response(res);
        }
    }
}

const oauthController = new OauthController();
export default oauthController;