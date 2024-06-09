import { Router } from "express";
import AuthService from "../service/authService";
import {z} from "zod";

const _saltRound = 10;

const authRouter = Router();

const service = new AuthService()

const loginCredentialSchema = z.object({
    name : z.string(),
    email : z.string()
             .email({
                message : "Invalid email address"
              }),
    password : z.string()
                .min(8, "at least should have 8")
                .max(20, "20 is max")
})

authRouter.post('/register', async (req, res, next) => {
    const dummydata = {
        name : "zin moes",
        email : "zin@gmail.com",
        password : 'dfdfdfsdfsdfd',
    }

    const cleanData = loginCredentialSchema.safeParse(dummydata);
    if(!cleanData.success){
        throw new Error("422")
    }

    try{
        const {accessToken, refreshToken} = await service.register(cleanData.data)
        //set Cookies
        res.cookie('ACCESS_TOKEN', accessToken, {httpOnly : true, secure : true});
        res.cookie("REFRESH_TOKEN", refreshToken, {httpOnly : true, secure : true});
    }catch(e){
        // throw new Error("500")
        res.sendStatus(500);
    }

    return res.sendStatus(200)
})

authRouter.post("/login", async (req, res, next) => {
})

export default authRouter;

