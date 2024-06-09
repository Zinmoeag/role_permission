import { Router } from "express";
import { verifyWithRS256 } from "../helper";

const homeRouter = Router();

homeRouter.get('/', (req,res, next) => {

    res.sendStatus(200);
})

export default homeRouter;

