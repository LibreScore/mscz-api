import winston from "winston";
import webmscore from "webmscore";
import { RequestHandler } from "express";
import * as mscore from "./mscore";
import * as error from "./error";

export default (async (req, res) => {
    winston.http("META accessed.");

    let score: webmscore;
    try { score = await mscore.mkScore(req.body) }
    catch (e) {
        return error.handleHTTP(res, e);
    }

    const meta = await score.metadata();
    res.json(meta);

    score.destroy();
}) as RequestHandler;
