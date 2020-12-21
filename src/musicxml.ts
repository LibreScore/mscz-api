import winston from "winston";
import webmscore from "webmscore";
import { RequestHandler } from "express";
import * as mscore from "./mscore";
import * as error from "./error";

export default (async (req, res) => {
    winston.http("MUSICXML accessed.");

    let score: webmscore;
    try { score = await mscore.mkScore(req.body, req.params.eid) }
    catch (e) {
        return error.handleHTTP(res, e);
    }
    
    if (req.url.startsWith("/mmxl")) {
        const mxml = await (score.saveMxl());

        // Send it off.
        res.setHeader("Content-Disposition", `attachement; filename=${await score.titleFilenameSafe()}_${req.params.eid || "FULLSCORE"}.mxl`);
        res.contentType("application/vnd.recordare.musicxml");
        res.send(Buffer.from(mxml));
    } else {
        const mxml = await (score.saveXml());

        // Send it off.
        res.setHeader("Content-Disposition", `attachement; filename=${await score.titleFilenameSafe()}_${req.params.eid || "FULLSCORE"}.musicxml`);
        res.contentType("application/xml");
        res.send(mxml);
    }

    score.destroy();
}) as RequestHandler;
