import winston from "winston";
import webmscore from "webmscore";
import { RequestHandler } from "express";

module.exports = ((req, res) => {
    winston.http("/meta accessed.");
    webmscore.ready.then(async () => {
        const score = await webmscore.load("mscz", req.body, [], false);
        const metadata = await score.metadata();

        res.json(metadata);

        score.destroy();
    });
}) as RequestHandler
