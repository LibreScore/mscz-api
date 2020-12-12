import winston from "winston";
import webmscore from "webmscore";
import express from "express";

module.exports = (req: Request, res: Response) => {
    // @ts-ignore
    winston.http("/meta accessed.");
    webmscore.ready.then(async () => {
        // @ts-ignore
        const score = await webmscore.load("mscz", req.body, [], false);
        const metadata = await score.metadata();

        // @ts-ignore
        res.json(metadata);

        score.destroy();
    });
};
