import { NextFunction, Response, Request } from "express";
import { Router } from "express";
import authRouter from "./auth";
import {
  checkPermission,
  deserilizedUser,
  verifyRoles,
} from "../middlewares/authMiddleware";
import dashboardRouter from "./dashboard";
import oauthRouter from "./oauth";
import AppError, { errorKinds } from "../utils/AppError";
import ErrorResponse from "../core/entitity/ErrorResponse";
import redisClient from "../core/redis";
import UserController from "../controllers/UserController";

const router = Router();

const userController = new UserController();

router.get(
  "/healthCheck",
  (req: Request, res: Response, next: NextFunction) => {
    res.sendStatus(200).end();
  }
);

router.use(authRouter);
router.use("/api/oauth", oauthRouter);

router.use(
  "/dashboard",
  // deserilizedUser,
  // verifyRoles(["ADMIN"]),
  dashboardRouter
);

router.get(
  "/testing",
  userController.getUserExcelData
);



//404 handler
router.use("*", (req: Request, res: Response, next: NextFunction) => {
  AppError.new(errorKinds.notFound, "Not Found").response(res);
});

// error handling
router.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  console.log("err ===> ", err);
  if (err instanceof AppError) {
    return res
      .status(err.getStatus())
      .json(
        new ErrorResponse({
          status: String(err.getStatus()),
          message: err.message,
          endpoint: req.url,
          data: err.payload,
        })
      )
      .end();
  }
});

export default router;
