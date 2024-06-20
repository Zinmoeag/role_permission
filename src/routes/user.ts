import { Router } from "express";

const userRouters = Router();

userRouters.get("/", (req, res) => {
    res.send("user route").status(200).end();
})

export default userRouters