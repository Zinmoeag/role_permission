import OauthServiceInterface from "./interfaces/OauthServiceInterface";
import prisma from "../../../prisma/client";
import { ReturnUser } from "../../types/user";
import Service from "../service";
import { z } from "zod";
import { signWithRS256 } from "../../helper";
import { OauthToken, OauthUser } from "../../types/oauthType";
import { ReturnToken } from "../../types/authType";
import AppError from "../../utils/AppError";
import { errorKinds } from "../../utils/AppError";
import { verify } from "crypto";
import UserRepository from "../../core/infrastructure/UserRepository";
import Verification from "../Auth/Verification";
import { LoginOrRequestVerfy } from "../../types/authType";
import { User } from "../../core/entitity/User";
import AuthService from "../Auth/AuthService";

const userRepos = new UserRepository(prisma);

class OauthService<T extends OauthToken> extends AuthService {
  _exclude = ["password"];

  private verification = new Verification();

  private OauthServiceInterface: OauthServiceInterface<T>;
  constructor(OauthServiceInterface: OauthServiceInterface<T>) {
    super(userRepos);
    this.OauthServiceInterface = OauthServiceInterface;
  }

  async getOauthUser(code: string): Promise<OauthUser> {
    const tokens: T = await this.OauthServiceInterface.getOauthToken(code);
    return await this.OauthServiceInterface.getOauthUser(tokens);
  }

  async store(user: OauthUser): Promise<User> {
    const newUser = await prisma.user.upsert({
      where: {
        email: user.email,
      },
      update: {},
      create: {
        provider : user.provider,
        name: user.name,
        email: user.email,
        avatar: user?.avatar,
        password: "",
      },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    return new User(newUser);
  }

  // async login(code: string): Promise<any> {
  //   // try {
  //   //   const OauthUser: OauthUser = await this.getOauthUser(code);
  //   //   //check user presnet or not
  //   //   const user = await userRepos.getUser(OauthUser.email);

  //   //   if (!user) {
  //   //     //store to database
  //   //     const newUser = await this.store(OauthUser);

  //   //     await this.verification.request(newUser);
  //   //     return;
  //   //   }

  //   //   if (user.verify === false) {
  //   //     await this.verification.request(user);
  //   //     return {
  //   //       type: LoginOrRequestVerfy.REQUEST_VERFIFY_RESPONSE,
  //   //       is_verfiy_email_sent: true,
  //   //     };
  //   //   } else {

  //   //     const accessToken = signWithRS256(user, "ACCESS_TOKEN_PRIVATE_KEY", {
  //   //       expiresIn: this.acesssTokenExp,
  //   //     });
  //   //     const refreshToken = signWithRS256(user, "REFRESH_TOKEN_PRIVATE_KEY", {
  //   //       expiresIn: this.refreshTokenExp,
  //   //     });
  //   //     return { accessToken, refreshToken };
  //   //   }
  //   // } catch (err) {
  //   //   console.log(err);
  //   //   if (err instanceof AppError) {
  //   //     //handling error from service
  //   //     throw err;
  //   //   }
  //   //   throw AppError.new(
  //   //     errorKinds.internalServerError,
  //   //     "internal server error during login"
  //   //   );
  //   // }
  // }
}

export default OauthService;
