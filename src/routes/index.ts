import { NextFunction, Response, Request } from "express";
import { Router } from "express";
import userRouters from "./user";
import authRouter from "./auth";
import homeRouter from "./home";
import authMiddleWare, { AuthRequest } from "../middlewares/authMiddleware";
import CheckRoleMiddleware from "../middlewares/checkRoleMiddleware";
import dashboardRouter from "./dashboard";
import oauthRouter from "./oauth";
import prisma from "../../prisma/client";
import roomRouters from "./room";
import requiredUser from "../middlewares/requiredUser";

const router = Router();

router.get("/healthChecker", (req : Request , res : Response, next : NextFunction) => {
  res.sendStatus(200).end();
})

router.use(authRouter);
router.use("/user", authMiddleWare, userRouters);
router.use("/api/oauth", oauthRouter);
router.use("/dashboard", authMiddleWare, CheckRoleMiddleware.isAdmin, dashboardRouter)
router.use("/home", authMiddleWare, homeRouter);

router.use("/room", authMiddleWare, requiredUser, roomRouters)

router.get("/testing", async (req : Request, res : Response, next : NextFunction) => {

  const room = await prisma.room.findFirst({
      where : {
        id : "jfksdjfs"
      },
      include : {
        users : {
          include : {
            user : {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                verify: true,
                role: true,
                password: false
              }
            },
            role : {
              select : {
                role_id : true,
                role_name : true,
              }
            }
          }
        },
      }
  })
  console.log(room.users)
  res.send("test route").status(200).end();
  
})

// console.log(path.resolve(__dirname, "build", "index.html"));
// not found route
router.use((req: Request, res: Response, next: NextFunction) => {
  res.send("page not found").status(404).end();
});

export default router;
