// Web server
import http from "http";
import express from "express";
import {NextFunction} from "express";
import rawBody from "raw-body";
import nconf from "nconf";
import winston from "winston";
import bodyParser from "body-parser";

const app = express();
const server = http.createServer(app);
export {server, app};

// raw body express middleware. https://www.npmjs.com/package/raw-body
/*
// @ts-ignore
app.use((req: Request, res: Response, next: any) => {
    // @ts-ignore
    rawBody(req).then(buf => {
        // @ts-ignore
        req.body = buf;
        next();
    }).catch((e: Error) => {
        return;
    });
});
*/
app.use(bodyParser.raw());

// Add each route.
app.post("/meta", require("./meta"));

// Listen.

function listen() {
    server.listen(3000, () => {
        winston.info("hi.");
    });
}; export {listen};
