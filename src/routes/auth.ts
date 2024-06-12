import { Router } from "express";
import AuthService from "../service/authService";
import {z} from "zod";
import authController from "../controllers/authController";

const authRouter = Router();

authRouter.post('/register', authController.registerController)

authRouter.post("/login", async (req, res, next) => {
})

authRouter.post("/refreshToken", authController.refreshTokenController);

export default authRouter;

