import { NextFunction, Response, Request } from "express";
import { Router } from "express";
import userRouters from "./user";
import authRouter from "./auth";
import homeRouter from "./home";
import authMiddleWare from "../middlewares/authMiddleware";
import AppError, { errorKinds } from "../utils/AppError";

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
  next("hey");
});


router.use(authRouter);
router.use("/user", userRouters);
router.use("/home", authMiddleWare, homeRouter);

// //error handling
router.use((err: any, req: Request, res: Response, next: NextFunction) => {

  if(err instanceof Error){
    console.log('loging error')
    console.log(err.message, err)
  }
  res.sendStatus(200);
  // AppError.new(errorKinds.)
});

export default router;
