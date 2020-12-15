// Web server
import http from "http";
import express from "express";
import winston from "winston";
import bodyParser from "body-parser";
import rateLimit from "express-rate-limit";

// Targets
import meta from "./meta";
import midi from "./midi";
import mxml from "./musicxml";

const app = express();
const server = http.createServer(app);

// Rate limit: 100 requests for 10 minutes.
app.use(rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100
}));

// Raw body for MSCZ file.
app.use(bodyParser.raw({
    type: "application/x-musescore",
    limit: "10mb"
}));

// Add each route.
app.post("/meta", meta);

app.post("/midi", midi);
app.post("/midi/:eid", midi);

app.post("/mxml", mxml);
app.post("/mxml/:eid", mxml);

app.post("/mmxl", mxml);
app.post("/mmxl/:eid", mxml);

// Listen.
function listen(): void {
    server.listen(3000, () => {
        winston.info("mscz-api online.");
    });
}

export default {server, app, listen};
