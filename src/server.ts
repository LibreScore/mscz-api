// Web server
import http from "http";
import express from "express";
import winston from "winston";
import bodyParser from "body-parser";

const app = express();
const server = http.createServer(app);
export {server, app};

app.use(bodyParser.raw({
    type: "application/x-musescore",
    limit: "10mb"
}));

// Add each route.
app.post("/meta", require("./meta"));

// Listen.

function listen() {
    server.listen(3000, () => {
        winston.info("mscz-api online.");
    });
}; export {listen};
