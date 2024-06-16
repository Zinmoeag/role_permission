import { NextFunction, Request, Response } from "express";
import { signWithRS256, verifyWithRS256 } from "../helper";
import prisma from "../../prisma/client";
import { z } from "zod";
import { ReturnUser } from "../types/user";
import AuthService from "../service/authService";
import AppError, { errorKinds } from "../utils/AppError";


const service = new AuthService();

const loginCredentialSchema = z.object({
  name: z.string(),
  email: z.string().email({
    message: "Invalid email address",
  }),
  password: z.string().min(8, "at least should have 8").max(20, "20 is max"),
});

class AuthController {
  async refreshTokenController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const refreshToken = req.cookies.jwt;

    if (!refreshToken) {
      return AppError.new(errorKinds.invalidToken, "invalid refresh Token")
          .response(res)
    }

    try {
      const user = verifyWithRS256<z.infer<typeof ReturnUser>>(
        refreshToken,
        "REFRESH_TOKEN_PUBLIC_KEY"
      );

      if (!user)
        return next(
          AppError.new(
            errorKinds.invalidToken,
            "invalid refresh Token"
          )
        );

      const foundUser = await prisma.user.findUnique({
        where: {
          id: user.id,
        },
        include: {
          role: true,
        },
      });

      const tokenUser = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        roleId: foundUser.roleId,
        role_name: foundUser.role.name,
      };

      const accessToken = signWithRS256(tokenUser, "ACCESS_TOKEN_PRIVATE_KEY", {
        expiresIn: "20s",
      });
      return res.status(200).json({ accessToken });
    } catch (e) {
      return AppError.new(errorKinds.invalidToken, "invalid refresh Token")
          .response(res)
    }
  }

  async register(req: Request, res: Response, next: NextFunction) {
    //validation
    const cleanData = loginCredentialSchema.safeParse(req.body);
    if (!cleanData.success) {
      return AppError.new(
          errorKinds.validationFailed, 
          "validation Failed",
          cleanData.error.formErrors.fieldErrors
        )
        .response(res)
    }

    try {
      const { accessToken, refreshToken } = await service.register(
        cleanData.data
      );
      //set Cookies
      res.cookie("jwt", refreshToken, { httpOnly: true, secure: true });
      return res.status(200).json({ accessToken }).end();

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
    const cleanData = loginCredentialSchema.safeParse(req.body);
    if(!cleanData.success) return AppError.new(
              errorKinds.validationFailed, 
              "validation Failed",
              cleanData.error.formErrors.fieldErrors
              ).response(res)

    try{
      const {accessToken, refreshToken} = await service.login(cleanData.data);
      res.cookie("jwt", refreshToken, { httpOnly: true, secure: true });
      return res.status(200).json({ accessToken }).end();

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
}

const authController = new AuthController();
export default authController;

