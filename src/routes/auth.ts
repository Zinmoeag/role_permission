import { Router } from "express";
import authController from "../controllers/localAuthController";
import { allowedVerifiedUser, deserilizedUser, verifyRoles } from "../middlewares/authMiddleware";
import validate from "../middlewares/vaildate";
import {
  LoginCredentialSchema,
  RegisterCredentialSchema,
  VerfyEmailSchema,
} from "../schema/authSchema";

const authRouter = Router();

//router

authRouter
  .get("/user", deserilizedUser, authController.getAuthUser)
  .post(
    "/register",
    validate(RegisterCredentialSchema),
    authController.register
  )
  .post("/login", validate(LoginCredentialSchema), authController.login)
  .post("/logout", authController.logout)
  .post("/refreshToken", authController.refreshTokenController)
  .post(
    "/verify_email",
    validate(VerfyEmailSchema),
    authController.verifyAccount
  );

export default authRouter;
