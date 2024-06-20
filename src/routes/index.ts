import { NextFunction, Response, Request } from "express";
import { Router } from "express";
import userRouters from "./user";
import authRouter from "./auth";
import homeRouter from "./home";
import authMiddleWare, { AuthRequest } from "../middlewares/authMiddleware";
import CheckRoleMiddleware from "../middlewares/checkRoleMiddleware";
import dashboardRouter from "./dashboard";

const router = Router();

router.use(authRouter);
router.use("/user", authMiddleWare, userRouters);
router.use("/dashboard", authMiddleWare, CheckRoleMiddleware.isAdmin, dashboardRouter)
router.use("/home", authMiddleWare, homeRouter);

// not found route
router.use((req: Request, res: Response, next: NextFunction) => {
  res.send("page not found").status(404).end();
});

export default router;
