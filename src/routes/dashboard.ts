import { Router } from "express";

const dashboardRouter = Router();

dashboardRouter.get("/", (req, res) => {
    res.send("dashboard route").status(200).end();
})

export default dashboardRouter;