
import 'dotenv/config'
import express from "express";
import "./config";
import router from './routes';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

const app = express();
app.use(cookieParser())
app.use(bodyParser.json());

app.use(router);

app.listen(3000, () => {
    console.log("server is running on port 3000")
});