import { NextFunction, Request, Response } from "express";
import { signWithRS256, verifyWithRS256 } from "../helper";
import bcrypt from "bcrypt";
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
      return next(
        AppError.new(errorKinds.invalidToken, "invalid refresh Token").response(
          res
        )
      );
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
          ).response(res)
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
      return next(
        AppError.new(errorKinds.invalidToken, "invalid refresh Token").response(
          res
        )
      );
    }
  }

  async registerController(req: Request, res: Response, next: NextFunction) {
    //validation
    const cleanData = loginCredentialSchema.safeParse(req.body);
    if (!cleanData.success) {
      return next(
        AppError.new(errorKinds.validationFailed, "validation Failed").response(
          res,
          cleanData.error.formErrors.fieldErrors
        )
      );
    }

    const isEmailUsed = await prisma.user.findFirst({
      where: {
        email: cleanData.data.email,
      },
    });

    //email unique
    if (isEmailUsed)
      return next(
        AppError.new(
          errorKinds.validationFailed,
          "Email is already is exist"
        ).response(res, { email: ["email is already used"] })
      );

    try {
      const { accessToken, refreshToken } = await service.register(
        cleanData.data
      );

      //set Cookies
      // res.cookie('ACCESS_TOKEN', accessToken, {httpOnly : true, secure : true});
      res.cookie("jwt", refreshToken, { httpOnly: true, secure: true });
      return res.status(200).json({ accessToken }).end();
    } catch (e) {
      return next(
        AppError.new(
          errorKinds.internalServerError,
          "Internal Server Error"
        ).response(res)
      );
    }
  }

  async loginController(req: Request, res: Response, next: NextFunction){
    const cleanData = loginCredentialSchema.safeParse(req.body);
    if(!cleanData.success){
        return(
            AppError.new(errorKinds.validationFailed, "validation Failed").response(
                res,
                cleanData.error.formErrors.fieldErrors
            )
        )
    }
    const foundUser = await prisma.user.findFirst({
        where : {
            email : cleanData.data.email,
        }
    })

    const loginValidationFailedPayload = {
        email : ['Invalid Email'],
        password : ["invalid Password"]
    }

    if(!foundUser) return (
        AppError.new(
            errorKinds.validationFailed,
            "Invalid Email"
        ).response(res, loginValidationFailedPayload)
    )

    const isPasswordMatch = await bcrypt.compare(cleanData.data.password, foundUser.password);
    if(isPasswordMatch) return (
      AppError.new(
        errorKinds.validationFailed, 
        "Invalid Email"
      ).response(res, loginValidationFailedPayload)
    )


  }
}

const authController = new AuthController();
export default authController;
