// Web server
import http from "http";
import express from "express";
import winston from "winston";
import bodyParser from "body-parser";

// Targets
import meta from "./meta";
import midi from "./midi";

const app = express();
const server = http.createServer(app);

// Raw body for MSCZ file.
app.use(bodyParser.raw({
    type: "application/x-musescore",
    limit: "10mb"
}));

// Add each route.
app.post("/meta", meta);

// Listen.
function listen() {
    server.listen(3000, () => {
        winston.info("mscz-api online.");
    });
};

export default {server, app, listen};
