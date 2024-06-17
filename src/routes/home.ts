import { Router } from "express";

const homeRouter = Router();

homeRouter.get('/', (req,res, next) => {
    res.sendStatus(200);
})

export default homeRouter;

