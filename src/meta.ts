import winston from "winston";
import webmscore from "webmscore";
import { RequestHandler } from "express";

export default ((req, res) => {
    winston.http("/meta accessed.");
    webmscore.ready.then(async () => {
        let score;
        try {  score = await webmscore.load("mscz", req.body, [], false); }
        catch (e) {
            res.sendStatus(400).send(e);
            return;
        }
        const metadata = await score.metadata();

        res.json(metadata);

        score.destroy();
    });
}) as RequestHandler;
