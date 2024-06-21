import { Router } from "express";
import oauthController from "../controllers/oauthController";

const oauthRouter = Router();

oauthRouter.get("/login",oauthController.googleOauth);

export default oauthRouter;