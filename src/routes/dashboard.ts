import { Router } from "express";
import RoleController from "../controllers/roleController";

const dashboardRouter = Router();
const roleController = new RoleController();

dashboardRouter.get("/", (req, res) => {
    res.send("dashboard route").status(200).end();
})

dashboardRouter.get("/roles", roleController.List)
dashboardRouter.post("/role/checkid/:id", roleController.CheckID)
dashboardRouter.post("/role/create", roleController.Create)


export default dashboardRouter;