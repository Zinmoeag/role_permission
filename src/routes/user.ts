import { NextFunction, Response , Request} from "express";
import { Router } from "express";

const userRouters = Router();

userRouters.get("/", (req, res, next) => {
    if(true){
        res.sendStatus(200);
        return;
    }
    next({hey : "hey"})
})


userRouters.post("/api/login", (req, res, next) => {
    res.sendStatus(400);
})


userRouters.get("/edit", (req : Request, res : Response, next : NextFunction) => {
    res.send("edit").status(200);
})
export default userRouters