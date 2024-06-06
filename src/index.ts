
import 'dotenv/config'
import express from "express";
import "./config";
import router from './routes';


const app = express();


app.use(router);

app.listen(3000, () => {
    console.log("server is running on port 3000")
});