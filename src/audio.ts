import { RequestHandler } from "express";
import * as mscore from "./mscore";
import * as error from "./error";
import winston from "winston";
import webmscore from "webmscore";

export default (async (req, res) => {
    winston.http("AUDIO accessed");

    let score: webmscore;
    try { score = await mscore.mkScore(res.locals.type, req.body, req.params.eid, false); }
    catch (e) {
        return error.handleHTTP(res, e);
    }

    const audio = await score.saveAudio(req.params.target as ("wav" | "mp3" | "ogg" | "flac"));
    res.setHeader("Content-Disposition", `attachement; filename=${await score.titleFilenameSafe()}_${req.params.eid || "FULLSCORE"}.${req.params.target}`);
    res.contentType(`audio/${req.params.target}`);
    res.send(Buffer.from(audio));

    score.destroy();
}) as RequestHandler;
