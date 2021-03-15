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
app.use(
  rateLimit({
    windowMs: nconf.get("limiter:time") || 10 * 60 * 1000,
    max: nconf.get("limiter:requests") || 100
  })
);

// Set source type
app.use((req, res, next) => {
  if (!req.headers["content-type"]) {
    return res.status(400).end("Content-Type not specified");
  }

  const ctype = req.headers["content-type"];
  if (ctype == "application/x-musescore") {
    res.locals.type = "mscz";
  } else if (ctype == "audio/midi") {
    res.locals.type = "midi";
  } else if (ctype == "application/xml") {
    res.locals.type = "musicxml";
  } else if (ctype == "application/vnd.recordare.musicxml") {
    res.locals.type = "mxl";
  } else {
    return res.status(400).end("Invalid Content-Type");
  }

  next();
});

// Raw body for MSCZ file.
app.use(
  bodyParser.raw({
    type: "application/x-musescore",
    limit: "10mb"
  })
);

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
