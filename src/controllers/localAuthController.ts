import { NextFunction, Request, Response } from "express";
import AppError, { errorKinds } from "../utils/AppError";
import { z } from "zod";
import {
  LoginCredentialSchema,
  RegisterCredentialSchema,
} from "../schema/authSchema";
import { AuthRequest } from "../middlewares/authMiddleware";
import LocalAuthService from "../service/authService";
import { User } from "../core/entitity/User";
import prisma from "../../prisma/client";
import UserRepository from "../core/infrastructure/UserRepository";

const service = new LocalAuthService(new UserRepository(prisma));

class AuthController {
  async getAuthUser(req: AuthRequest, res: Response, next: NextFunction) {
    return res.status(200).json({ user: req.user }).end();
  }

  async refreshTokenController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    // console.log(req.cookies);
    const refreshToken = req.cookies.jwt;

    if (!refreshToken) {
      return AppError.new(
        errorKinds.invalidToken,
        "token is not present"
      ).response(res);
    }

    try {
      const { access_token } = await service.generateAccessToken(refreshToken);

      res.cookie("auth_access", access_token, { secure: true });
      return res.status(200).json({ access_token }).end();
    } catch (e) {
      if (e instanceof AppError) {
        return e.response(res);
      } else {
        return AppError.new(
          errorKinds.invalidToken,
          "internal Server Error"
        ).response(res);
      }
    }
  }

  async register(req: Request, res: Response, next: NextFunction) {
    const credential = req.body as z.infer<typeof RegisterCredentialSchema>;
    try {
      const isEmailExist = await service.isEmailExist(credential.email);

      if (isEmailExist) {
        throw AppError.new(errorKinds.alreadyExist, "email already exist");
      }

      await service.store(credential);

      res.sendStatus(200);
    } catch (e) {
      if (e instanceof AppError) {
        next(e);
      } else {
        next(
          AppError.new(
            errorKinds.internalServerError,
            "Internal server error with Registration"
          )
        );
      }
    }
  }


  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const credential = req.body as z.infer<typeof LoginCredentialSchema>;

      const foundUser = await service.checkUserCredential(credential);

      service.serilizeUser(res, new User(foundUser));

      res.sendStatus(200);
    } catch (e) {
      next(e instanceof AppError ? e : AppError.new(errorKinds.internalServerError, "internal Server Error"));
    }
  }

  async verifyAccount(req: Request, res: Response, next: NextFunction) {
    const { userid, verification_code } = req.params;
    if (!userid || !verification_code) {
      return next(AppError.new(errorKinds.badRequest, "invalid user id or verification code"));
    }

    try {
      await service.verifyAccount(userid, verification_code);
      res.sendStatus(200);
    } catch (err) {
      if (err instanceof AppError) {
        return err.response(res);
      }
      next(AppError.new(errorKinds.forbidden, "invalid verification code"));
    }
  }

  logout(req: Request, res: Response, next: NextFunction) {
    service.logout(res);

    res.status(204).json({ message: "logout success" }).end();
  }
}

const authController = new AuthController();
export default authController;
