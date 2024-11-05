import AppConfig from "../../config";
import AppError from "../../utils/AppError";
import { errorKinds } from "../../utils/AppError";
import { TokenUser, User } from "../../core/entitity/User";
import jwt, { SignOptions } from "jsonwebtoken";
import UserRepository from "../../core/infrastructure/UserRepository";
import { v4 as uuidv4 } from "uuid";
import Hash from "../../utils/Hash";
import VerifyEmail from "../Email/VerfifyEmail";
import { isExpired } from "../../helper";
import { Response } from "express";

type ReturnToken = {
  access_token: string;
  refresh_Token: string;
  user?: User;
};

class AuthService {
  protected UserRepository: UserRepository;

  constructor(UserRepository: UserRepository) {
    this.UserRepository = UserRepository;
  }

  verifyWithRS256 = <T>(
    token: string,
    key: "ACCESS_TOKEN_PUBLIC_KEY" | "REFRESH_TOKEN_PUBLIC_KEY"
  ): T | null => {
    try {
      const publcKey = Buffer.from(AppConfig.getConfig(key), "base64").toString(
        "ascii"
      );

      const decoded = jwt.verify(token, publcKey, {
        algorithms: ["RS256"],
      });

      return decoded as T;
    } catch (e) {
      throw AppError.new(errorKinds.invalidToken, "Invalid User");
    }
  };

  signJwtToken = (
    payload: TokenUser,
    key: "ACCESS_TOKEN_PRIVATE_KEY" | "REFRESH_TOKEN_PRIVATE_KEY",
    options: SignOptions
  ) => {
    const encodedPrivateKey = Buffer.from(
      AppConfig.getConfig(key),
      "base64"
    ).toString("ascii");

    const token = jwt.sign({ ...payload }, encodedPrivateKey, {
      ...(options && options),
      algorithm: "RS256",
    });
    return token;
  };

  async isEmailExist(email: string): Promise<boolean> {
    try {
      const isEmailUsed = await this.UserRepository.get({
        where: {
          email: email,
        },
      });

      return !!isEmailUsed;
    } catch (e) {
      throw AppError.new(errorKinds.internalServerError, "Prisma Error");
    }
  }

  async isEmailExistWithOtherProvider(
    email: string,
    Provider: string
  ): Promise<boolean> {
    try {
      const user = await this.UserRepository.get({
        where: {
          email: email,
        },
      });

      if (user && user.provider !== Provider) return true;
      return false;
    } catch (e) {
      throw AppError.new(errorKinds.internalServerError, "Prisma Error");
    }
  }

  serilizeUser(res: Response, user: User) {
    try {
      const access_token = this.signJwtToken(user, "ACCESS_TOKEN_PRIVATE_KEY", {
        expiresIn: "1d",
      });

      const refresh_Token = this.signJwtToken(
        user,
        "REFRESH_TOKEN_PRIVATE_KEY",
        {
          expiresIn: "1d",
        }
      );

      res.cookie("auth_access", access_token, { httpOnly: true, secure: true });
      res.cookie("jwt", refresh_Token, { httpOnly: true, secure: true });
      res.cookie("logged_in", true);
    } catch (err) {
      if (err instanceof AppError) {
        throw err;
      } else {
        throw AppError.new(
          errorKinds.internalServerError,
          "Internal Server Error"
        );
      }
    }
  }

  logout(res: Response) {
    try {
      res.clearCookie("auth_access");
      res.clearCookie("jwt");
      res.clearCookie("logged_in");
    } catch (err) {
      if (err instanceof AppError) {
        throw err;
      } else {
        throw AppError.new(
          errorKinds.internalServerError,
          "Internal Server Error"
        );
      }
    }
  }

  async RequestVerificationEmail(user: User): Promise<any> {
    const rawCode = uuidv4();
    const hashedVerificationCode = Hash.make(rawCode);
    const verificationCodeExpiredAt = new Date(Date.now() + 60 * 1000);

    await this.UserRepository.update({
      where: {
        id: user.id,
      },
      data: {
        verificationCode: hashedVerificationCode,
        verificationCode_expried: verificationCodeExpiredAt,
      },
    });

    const verifyEmail = new VerifyEmail({
      name: user.name,
      to: user.email,
      from: "admin@gmail.com",
      mailObj: {
        url: `http://localhost:4000/verify_email/${user.id}/${rawCode}`,
      },
    });
    await verifyEmail.send();
  }

  async verifyAccount(userId: string, verificationCode: string) {
    try {
      const foundUser = await this.UserRepository.getUser({
        id: userId,
      });
      if (!foundUser)
        throw AppError.new(errorKinds.badRequest, "Invalid Verification Code");

      const isVerificationCodeMatch = Hash.compare(
        verificationCode,
        foundUser.verificationCode
      );

      if (!isVerificationCodeMatch)
        throw AppError.new(errorKinds.badRequest, "Invalid Verification Code");

      if (isExpired(foundUser.verificationCode_expried, 60 * 1000))
        throw AppError.new(
          errorKinds.badRequest,
          "Verification Session Expired"
        );

      await this.UserRepository.update({
        where: {
          id: foundUser.id,
        },
        data: {
          verify: true,
        },
      });
    } catch (e) {
      if (!(e instanceof AppError)) {
        throw AppError.new(
          errorKinds.internalServerError,
          "Internal Server Error"
        );
      }
    }
  }

  async generateAccessToken(
    refreshToken: string
  ): Promise<{ access_token: string }> {
    const user = this.verifyWithRS256<User>(
      refreshToken,
      "REFRESH_TOKEN_PUBLIC_KEY"
    );

    if (!user) throw AppError.new(errorKinds.invalidToken, "Invalid User");

    const foundUser = await this.UserRepository.getUser({
      id: user.id,
    });

    const access_token = this.signJwtToken(
      foundUser,
      "ACCESS_TOKEN_PRIVATE_KEY",
      {
        expiresIn: "1s",
      }
    );

    return {
      access_token,
    };
  }
}

export default AuthService;
