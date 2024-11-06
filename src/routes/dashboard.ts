import { Router } from "express";
import RoleController from "../controllers/roleController";
import { checkPermission } from "../middlewares/authMiddleware";
import UserController from "../controllers/UserController";

const dashboardRouter = Router();
const roleController = new RoleController();
const userController = new UserController();

dashboardRouter
  .get("/", (req, res) => {
    res.send("dashboard route").status(200).end();
  })
  .get(
    "/roles",
    checkPermission({ resource: "ROLE", action: "READ" }),
    roleController.List
  )
  .post(
    "/role/checkid/:id",
    // checkPermission({ resource: "ROLE", action: "CREATE" }),
    roleController.CheckID
  )
  .post("/role/create", roleController.Create);

dashboardRouter
    .get("/users", userController.getAll);

export default dashboardRouter;
