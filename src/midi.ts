import winston from "winston";
import webmscore from "webmscore";
import { RequestHandler } from "express";
import nconf from "nconf";

export default ((req, res) => {
    winston.http("/midi accessed.");
    webmscore.ready.then(async () => {
        let score;
        try {  score = await webmscore.load("mscz", req.body, [], false); }
        catch (e) {
            res.sendStatus(400).send(e);
            return;
        }
        const soundFontData = new Uint8Array(
            await (
                await fetch(nconf.get("soundFile"))
            ).arrayBuffer()
        );
        const metadata = await score.metadata();
    })
}) as RequestHandler;