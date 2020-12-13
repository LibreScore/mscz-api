import winston from "winston";
import webmscore from "webmscore";
import { RequestHandler } from "express";
import nconf from "nconf";
import axios from "axios";

export default ((req, res) => {
    winston.http("/midi accessed.");
    webmscore.ready.then(async () => {
        let score;
        try {  score = await webmscore.load("mscz", req.body, [], false); }
        catch (e) {
            res.sendStatus(400).send(e);
            return;
        }
        const metadata = await score.metadata();

        // Excerpt: eid is the id found in metadata.
        await score.generateExcerpts();
        await score.setExcerptId(metadata.excerpts[req.params.eid].id);

        // Do the actual conversion.
        const midi = await (score.saveMidi());

        // Send it off.
        res.contentType("audio/midi");
        res.send(Buffer.from(midi));

        score.destroy();
    });
}) as RequestHandler;
