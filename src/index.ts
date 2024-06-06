
import 'dotenv/config'
import express from "express";
import "./config";
import router from './routes';
import { signJwt, verifyJwt } from './helper';
import { verify } from 'crypto';
import { copyFileSync } from 'fs';


const app = express();


app.use(router);

app.listen(3000, () => {
    console.log("server is running on port 3000")
});


//testing jwt

const user = {
    id : 'dfdfdfd',
    name : "Admin",
    email : "admin@gmail.com"
}

const token = signJwt(
    {data : user},
    {
        expiresIn : '2000m'
    }
)

const payload = verifyJwt(token);

console.log(payload);