import { Router } from "express";
import oauthController from "../controllers/oauthController";

const oauthRouter = Router();

oauthRouter.get("/google",oauthController.googleOauth);

export default oauthRouter;