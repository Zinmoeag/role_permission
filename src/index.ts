
import 'dotenv/config'
import express from "express";
import "./config";
import router from './routes';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import logger from './middlewares/logger';
import cors from "cors"

const corsOptions = {
    origin: "http://localhost:4000",
    credentials: true,
}

const app = express();
//template engine
app.set('view engine', 'pug');
app.set('views', '${__dirname}/views');

console.log(`${__dirname}/views`);

app.use(cors(corsOptions));
app.use(logger);

app.use(cookieParser())
app.use(bodyParser.json());

app.use(router);

app.listen(3000, () => {
    console.log("server is running on port 3000")
});