import winston from "winston";
import webmscore from "webmscore";
import { RequestHandler } from "express";

export default (async (req, res) => {
    winston.http("/meta accessed.");
    await webmscore.ready;

    let score: webmscore;
    try {  score = await webmscore.load("mscz", req.body, [], false); }
    catch (e) {
        return res.status(400).send(e.toString());
    }
    const metadata = await score.metadata();

    // Excerpt: eid is the id found in metadata.
    await score.generateExcerpts();
    if (req.params.eid) {
        if (metadata.excerpts[req.params.eid]) {
            await score.setExcerptId(metadata.excerpts[req.params.eid].id);
        } else {
            res.status(400).end("Invalid excerpt.");
            return score.destroy();
        }
    }

    // Conversion and send it off.
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
