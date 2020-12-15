import winston from "winston";
import webmscore from "webmscore";
import { RequestHandler } from "express";

export default (async (req, res) => {
    winston.http("/meta accessed.");
    await webmscore.ready;

    let score: webmscore;
    try {  score = await webmscore.load("mscz", req.body, [], false); }
    catch (e) {
        return res.sendStatus(400).send(`Invalid MSCZ file - ${e.toString()}`);
    }
    const metadata = await score.metadata();

    res.json(metadata);

    score.destroy();
}) as RequestHandler;
