import { NextFunction, Response, Request } from "express";
import { Router } from "express";
import userRouters from "./user";
import authRouter from "./auth";
import homeRouter from "./home";
import authMiddleWare, { AuthRequest } from "../middlewares/authMiddleware";
import CheckRoleMiddleware from "../middlewares/checkRoleMiddleware";
import dashboardRouter from "./dashboard";
import { getGoogleOauthToken } from "../service/oauthService";
import oauthController from "../controllers/oauthController";
import oauthRouter from "./oauth";

const router = Router();

router.use(authRouter);
router.use("/user", authMiddleWare, userRouters);
router.use("/api/oauth", oauthRouter);
router.use("/dashboard", authMiddleWare, CheckRoleMiddleware.isAdmin, dashboardRouter)
router.use("/home", authMiddleWare, homeRouter);

router.get("/test", (req : Request, res : Response, next : NextFunction) => {
  // getGoogleOauthToken();
  res.send("test route").status(200).end();
})

// not found route
router.use((req: Request, res: Response, next: NextFunction) => {
  res.send("page not found").status(404).end();
});

export default router;
