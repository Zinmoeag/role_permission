
import 'dotenv/config'
import express from "express";
import "./config";
import router from './routes';
import { signJwt, signWithRS256, verifyJwt, verifyWithRS256 } from './helper';
import { verify } from 'crypto';
import { copyFileSync } from 'fs';
import AppConfig from './config';


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

// rs256 key

const access_token = signWithRS256(
    {
        data : user,
    },
    "ACCESS_TOKEN_PRIVATE_KEY",
    {
        expiresIn : "60"
    }
)


const refresh_token = signWithRS256(
    {
        data : user,
    },
    "REFRESH_TOKEN_PRIVATE_KEY",
    {
        expiresIn  :"60"
    }
)

console.log(access_token, refresh_token)