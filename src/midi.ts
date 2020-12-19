import winston from "winston";
import webmscore from "webmscore";
import { RequestHandler } from "express";

export default (async (req, res) => {
    winston.http("MIDI accessed.");
    await webmscore.ready;

    let score: webmscore;
    try {  score = await webmscore.load("mscz", req.body, [], false); }
    catch (e) {
        return res.status(400).end(`Invalid MSCZ file - ${e.toString()}`);
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

    // Do the actual conversion.
    const midi = await (score.saveMidi());

    // Send it off.
    res.setHeader("Content-Disposition", `attachement; filename=${await score.titleFilenameSafe()}_${req.params.eid || "FULLSCORE"}.mid`);
    res.contentType("audio/midi");
    res.send(Buffer.from(midi));

    score.destroy();
}) as RequestHandler;
