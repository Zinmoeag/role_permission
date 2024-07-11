import { NextFunction, Response, Request, Router } from "express";
import oauthController from "../controllers/oauthController";

const oauthRouter = Router();

oauthRouter.get("/google",oauthController.googleOauth);
// oauthRouter.get("/github",(req : Request, res : Response, next : NextFunction) => {

//     console.log(oauthController.githubOauth)
//     res.sendStatus(400).end();
// });
oauthRouter.get('/github', oauthController.githubOauth);

export default oauthRouter;