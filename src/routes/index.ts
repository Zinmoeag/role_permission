import { NextFunction, Response, Request } from "express";
import { Router } from "express";
import userRouters from "./user";
import authRouter from "./auth";

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

//error handling
router.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  res.sendStatus(200);
});

export default router;
