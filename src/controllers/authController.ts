import { NextFunction, Request, Response } from "express";import { z } from "zod";
import AuthService from "../service/authService";
import AppError, { errorKinds } from "../utils/AppError";
import {LoginCredentialSchema , RegisterCredentialSchema, VerfyEmailSchema} from "../schema/authSchema";
import { AuthRequest } from "../middlewares/authMiddleware";

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
      const {accessToken, user} = await service.generateAccessToken(refreshToken);
      res.cookie("auth_access", accessToken, { secure: true });
      return res.status(200).json({ accessToken, user }).end();
      
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
    if(!cleanData.success) return AppError.new(
              errorKinds.validationFailed, 
              "validation Failed",
              cleanData.error.formErrors.fieldErrors
              ).response(res)

    try{
      const {accessToken, refreshToken, user} = await service.login(cleanData.data);
      res.cookie("jwt", refreshToken, { httpOnly: true, secure: true });
      res.cookie("auth_access", accessToken, { secure: true });
      return res.status(200).json({ accessToken, user }).end();

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
      await service.verifyAccount(verification_code);
      res.sendStatus(200);
    }catch(err){
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

