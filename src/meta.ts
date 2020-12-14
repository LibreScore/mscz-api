import winston from "winston";
import webmscore from "webmscore";
import { RequestHandler } from "express";

export default (async (req, res) => {
    winston.http("/meta accessed.");
    await webmscore.ready;

    let score;
    try {  score = await webmscore.load("mscz", req.body, [], false); }
    catch (e) {
        return res.sendStatus(400).send(e);
    }
    const metadata = await score.metadata();

    res.json(metadata);

    score.destroy();
}) as RequestHandler;
