// Web server
import http from "http";
import express from "express";
import winston from "winston";
import bodyParser from "body-parser";
import rateLimit from "express-rate-limit";
import endpoints from "./endpoints";
import nconf from "nconf";

const app = express();
const server = http.createServer(app);

// Rate limit: 100 requests for 10 minutes.
app.use(rateLimit({
    windowMs: nconf.get("limiter:time") || 10 * 60 * 1000,
    max: nconf.get("limiter:requests") || 100
}));

// Raw body for MSCZ file.
app.use(bodyParser.raw({
    type: "application/x-musescore",
    limit: "10mb"
}));

// version header
app.use((req, res, next) => {
    res.setHeader("X-API-Version", nconf.get("version"));
    next();
});

// Bad request if method is not POST
app.use((req, res, next) => {
    if (req.method != "POST") {
        return res.status(400).end("Please use the POST method.");
    }
    next();
});

// Endpoints
app.post("/:target", endpoints);
app.post("/:target/:eid", endpoints);

// Listen.
function listen(): void {
    server.listen(nconf.get("port") || 3000, () => {
        winston.info("mscz-api online.");
    });
}

export { server, app, listen };
