import { UserWithRoleAndPermission } from "../../prisma/client";
import bcrypt from "bcrypt";
import AppError, { errorKinds } from "../utils/AppError";
import { z } from "zod";
import {
  LoginCredentialSchema,
  RegisterCredentialSchema,
} from "../schema/authSchema";
import Verification from "./Auth/Verification";
import UserRepository from "../core/infrastructure/UserRepository";
import AuthService from "./Auth/AuthService";

const _saltRound = 10;

export default class LocalAuthService extends AuthService {
  private verification = new Verification();

  _exclude = ["password", "role.id", "permission.id"];

  acesssTokenExp = "1d";
  refreshTokenExp = "1d";

  constructor(userRepo: UserRepository) {
    super(userRepo);
  }

  async checkUserCredential(
    data: z.infer<typeof LoginCredentialSchema>
  ): Promise<UserWithRoleAndPermission> {
    const foundUser = await this.UserRepository.getUser({ email: data.email });

    if (!foundUser)
      throw AppError.new(errorKinds.invalidCredential, "invalid credential", {
        email: ["invalid email"],
      });

    if (foundUser.provider) {
      throw AppError.new(
        errorKinds.oauthAccoundAlreadyExist,
        "oauthAccoundAlreadyExist",
        {
          email: ["This Email is Already Used"],
        }
      );
    }

    const isPasswordMatch = await bcrypt.compare(
      data.password,
      foundUser.password
    );
    if (!isPasswordMatch)
      throw AppError.new(errorKinds.invalidCredential, "invalid credential", {
        password: ["invalid password"],
      });

    return foundUser;
  }

  async store(data: z.infer<typeof RegisterCredentialSchema>): Promise<any> {
    try {
      const salt = bcrypt.genSaltSync(_saltRound);
      const hashedPassword = bcrypt.hashSync(data.password, salt);

      await this.UserRepository.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashedPassword,
        },
      });
    } catch (e) {
      throw AppError.new(
        errorKinds.internalServerError,
        "internal server error"
      );
    }
  }
}
