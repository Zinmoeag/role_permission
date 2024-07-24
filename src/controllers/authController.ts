import { NextFunction, Request, Response } from "express";import { z } from "zod";
import AuthService from "../service/authService";
import AppError, { errorKinds, errorKindsType } from "../utils/AppError";
import {LoginCredentialSchema , RegisterCredentialSchema, VerfyEmailSchema} from "../schema/authSchema";
import { AuthRequest } from "../middlewares/authMiddleware";
import { LoginOrRequestVerfy, LoginResponse, RequestVerifyEmail } from "../types/authType";
import { Result, returnStates } from "../types";

const service = new AuthService();

class AuthController {

  async getAuthUser(req: Request, res: Response, next: NextFunction){
    const authReq = req as AuthRequest;
    const user = authReq.user;
    return res.status(200).json({user}).end();
  }
  
  async refreshTokenController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const refreshToken = req.cookies.jwt;

    if (!refreshToken) {
      return AppError.new(errorKinds.invalidToken, "token is not present").response(res);
    }

    try {
      const {access_token, user} = await service.generateAccessToken(refreshToken);
      res.cookie("auth_access", access_token, { secure: true });
      return res.status(200).json({ access_token, user }).end();
      
    } catch (e) {
      if(e instanceof AppError){
        return e.response(res)
      }else{
        return AppError.new(errorKinds.invalidToken, "internal Server Error")
            .response(res)
      }
    }
  }

  async register(req: Request, res: Response, next: NextFunction) {
    //validation
    const cleanData = RegisterCredentialSchema.safeParse(req.body);
    if (!cleanData.success) {
      return AppError.new(
          errorKinds.validationFailed, 
          "validation Failed",
          cleanData.error.formErrors.fieldErrors
        )
        .response(res)
    }

    try {
      const {isSuccess} = await service.register(
        cleanData.data
      );

      return res.status(200).json({ isVerfyEmailSend :  isSuccess }).end();
    } catch (e) {
      if(e instanceof AppError){
        return e.response(res)
      }
      next(
        AppError.new(
          errorKinds.internalServerError,
          "internal server error"
        ).response(res)
      );
    }
  }

  async login(req: Request, res: Response, next: NextFunction){
    const cleanData = LoginCredentialSchema.safeParse(req.body);
    if(!cleanData.success) 
      return AppError.new(
                errorKinds.validationFailed, 
                "validation Failed",
                cleanData.error.formErrors.fieldErrors
              ).response(res);
  
    try{
      const account : LoginResponse | RequestVerifyEmail = await service.loginOrReqVerify(cleanData.data);

      if(account.type === LoginOrRequestVerfy.LOGIN_RESPONSE){

        // if account verified do login
        const {access_token, refresh_token, user} = account;
        res.cookie("jwt", refresh_token, { httpOnly: true, secure: true });
        res.cookie("auth_access", access_token, { secure: true });
        
        return res.status(200).json({ auth_access : access_token, user }).end();

      }else{
        console.log("verify");
        const {is_verfiy_email_sent} = account;
        //if account is not verified do verify process
        res.status(200).json({
          ...account
        }).end();
      }
    }catch(e){
      //error handling
      if(e instanceof AppError){
        return e.response(res);
      }
      return AppError.new(
        errorKinds.internalServerError,
        "internal Server Error",
      ).response(res);
    }
  }

  async verifyAccount(req: Request, res: Response, next: NextFunction){
    const cleanData = VerfyEmailSchema.safeParse(req.body);
    if(!cleanData.success) return AppError.new(
      errorKinds.validationFailed, 
      "validation Failed",
      cleanData.error.formErrors.fieldErrors
      ).response(res)

    try{  
      const {verification_code} = cleanData.data;
      const verification = await service.verifyAccount(verification_code);
  
      res.sendStatus(200);
    }catch(err){
      if(err instanceof AppError){
        return err.response(res);
      }
      return AppError.new(errorKinds.forbidden, "inivalid verification code").response(res)
    }
  }

  logout(
    req : Request,
    res : Response,
    next : NextFunction,
  ){
    res.clearCookie("jwt");
    res.clearCookie("auth_access");
    res.status(204).json({message : "logout success"}).end()
  }
}

const authController = new AuthController();
export default authController;

