import { NextFunction, Response, Request } from "express";
import { Router } from "express";
import userRouters from "./user";
import authRouter from "./auth";
import homeRouter from "./home";
import authMiddleWare, { AuthRequest } from "../middlewares/authMiddleware";
import CheckRoleMiddleware from "../middlewares/checkRoleMiddleware";
import dashboardRouter from "./dashboard";
import oauthRouter from "./oauth";
import VerifyEmail from "../service/Email/VerfifyEmail";

const router = Router();

router.use(authRouter);
router.use("/user", authMiddleWare, userRouters);
router.use("/api/oauth", oauthRouter);
router.use("/dashboard", authMiddleWare, CheckRoleMiddleware.isAdmin, dashboardRouter)
router.use("/home", authMiddleWare, homeRouter);

router.get("/testing", async (req : Request, res : Response, next : NextFunction) => {
  // res.send("test route").status(200).end();
  try{
    const email  = new VerifyEmail({
      name : "zin",
      to : "user@gmail.com",
      from : "admin@gmail.com",
      mailObj : {
        url : "http://localhost:3000/verificationCode"
      }
    });

    await email.send();    
    res.sendStatus(200).end();
  }catch(err){
    console.log("error", err);
    res.sendStatus(500).end();
  }
})

// console.log(path.resolve(__dirname, "build", "index.html"));
// not found route
router.use((req: Request, res: Response, next: NextFunction) => {
  res.send("page not found").status(404).end();
});

export default router;
