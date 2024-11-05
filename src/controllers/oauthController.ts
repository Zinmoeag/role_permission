import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import AppError, { errorKinds } from "../utils/AppError";

//new OauthService
import OauthService from "../service/oauth/OauthService";
import GoogleOauthService from "../service/oauth/GogleOauthService";
import GitHubOauthService from "../service/oauth/GitHubOauthService";
import AppConfig from "../config";

//test

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

    if (!code) {
      return AppError.new(errorKinds.badRequest, "code is required").response(
        res
      );
    }

    try {
      const oauthService = new OauthService(new GoogleOauthService());
      const user = await oauthService.getOauthUser(code);
      if (
        await oauthService.isEmailExistWithOtherProvider(
          user.email,
          user.provider
        )
      ) {
        return res.redirect(
          `${AppConfig.getConfig("CLIENT_URL")}email-already-exist`
        );
      }

      const newUser = await oauthService.store(user);

      oauthService.serilizeUser(res, newUser);

      res.redirect(`${pathUrl}`);
    } catch (err) {
      if (err instanceof AppError) {
        next(err);
      }
      next(
        AppError.new(errorKinds.internalServerError, "internal server error")
      );
    }
  };

  githubOauth = async (req: Request, res: Response, next: NextFunction) => {
    const code = req.query.code as string;
    const pathUrl = (req.query.state as string) || "/";

    try {
      const oauthService = new OauthService(new GitHubOauthService());
      const user = await oauthService.getOauthUser(code);
      if (
        await oauthService.isEmailExistWithOtherProvider(
          user.email,
          user.provider
        )
      ) {
        return res.redirect(
          `${AppConfig.getConfig("CLIENT_URL")}email-already-exist`
        );
      }

      const newUser = await oauthService.store(user);

      oauthService.serilizeUser(res, newUser);

      res.redirect(`${pathUrl}`);
    } catch (err) {
      if (err instanceof AppError) {
        next(err);
      }
      next(
        AppError.new(errorKinds.internalServerError, "internal server error")
      );
    }
  };
}

const oauthController = new OauthController();
export default oauthController;
