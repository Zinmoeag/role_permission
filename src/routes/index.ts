import { NextFunction, Response, Request } from "express";
import { Router } from "express";
import userRouters from "./user";
import authRouter from "./auth";
import homeRouter from "./home";
import authMiddleWare from "../middlewares/authMiddleware";

const router = Router();

//the whole middleware
router.use((req, res, next) => {
  console.log("whoe middleware is running");
  next();
});

router.get("/", (req: Request, res: Response, next: NextFunction): void => {
  const isAuth = false;

  if (isAuth) {
    res.sendStatus(200);
    return;
  }
  next();
});


router.use(authRouter);
router.use("/user", userRouters);
router.use("/home", authMiddleWare, homeRouter);

// not found route
router.use((req: Request, res: Response, next: NextFunction) => {
  res.sendStatus(404);
});

export default router;
