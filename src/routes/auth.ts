import { Router } from "express";
import authController from "../controllers/authController";

const authRouter = Router();

authRouter.post('/register', authController.register)

authRouter.post("/login", authController.login);

authRouter.post("/logout", authController.logout);

authRouter.post("/refreshToken", authController.refreshTokenController);

authRouter.get("/test", authController.test)

export default authRouter;

