import { Router } from "express";
import RoleController from "../controllers/roleController";
import { checkPermission } from "../middlewares/authMiddleware";

const dashboardRouter = Router();
const roleController = new RoleController();

dashboardRouter.get("/", (req, res) => {
  res.send("dashboard route").status(200).end();
});

dashboardRouter.get(
  "/roles",
  checkPermission({ resource: "ROLE", action: "READ" }),
  roleController.List
);
dashboardRouter.post("/role/checkid/:id", roleController.CheckID);
dashboardRouter.post("/role/create", roleController.Create);

export default dashboardRouter;
