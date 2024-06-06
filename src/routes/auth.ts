import { Router } from "express";
import { ZodError, z } from "Zod";

const loginCredentialSchema = z.object({
    email : z.string().email({
        message : "Invalid email address"
    }),
    password : z.string()
                .min(8, "at least should have 8")
                .max(20, "20 is max")
})

const authRouter = Router();

authRouter.post("/login", (req, res, next) => {

    const dummydata = {
        email : "zin@gmail.com",
        password : 'dfdfdfsdfsdfd',
    }

    const cleanData = loginCredentialSchema.safeParse(dummydata);

    if(!cleanData.success){
        throw new Error("422")
    }


    console.log(cleanData.data)

    res.sendStatus(200);
})

export default authRouter;

