import { NextFunction, Request, Response } from "express";import { z } from "zod";
import AuthService from "../service/authService";
import AppError, { errorKinds } from "../utils/AppError";
import {LoginCredentialSchema , RegisterCredentialSchema} from "../schema/authSchema";


const service = new AuthService();

class AuthController {
  async refreshTokenController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const refreshToken = req.cookies.jwt;

    if (!refreshToken) {
      return AppError.new(errorKinds.invalidToken, "token is not present")
    }

    try {
      const {accessToken, user} = await service.generateAccessToken(refreshToken);
      return res.status(200).json({ accessToken, user });
      
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
      const { accessToken, refreshToken, user } = await service.register(
        cleanData.data
      );
      //set Cookies
      res.cookie("jwt", refreshToken, { httpOnly: true, secure: true });
      return res.status(200).json({ accessToken, user }).end();

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

  logout(
    req : Request,
    res : Response,
    next : NextFunction,
  ){
    res.clearCookie("jwt")
    res.status(204).json({message : "logout success"}).end()
  }

  test(req: Request, res: Response, next: NextFunction){
    // service.testService();

    res.sendStatus(200);
  }
}

const authController = new AuthController();
export default authController;

