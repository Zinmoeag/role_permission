import { NextFunction, Request, Response } from "express";
import path from "path";
import { existsSync , promises as fsPromises } from "fs";

const logEvents = async (message : string, logName: string) => {
    const dateTime = `${new Date().toISOString().replace(':', '-')}`;
    const logItem = `${dateTime}\t${message}\n`;

    try {
        if (!existsSync(path.join(__dirname, '..', 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
        }

        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logName), logItem);
    } catch (err) {
        console.log(err);
    }
}

const logger = (req : Request, res : Response, next : NextFunction) => {
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt');
    console.log(`${req.method} ${req.path}`);
    next();
}

export default logger;