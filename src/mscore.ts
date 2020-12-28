/*
The point of this is a basic frontent to webmscore, because a lot of the options in webmscore
are/will be hardcoded for the API so there is no need to replace it. An example of this is 
sound font files.
*/
import webmscore from "webmscore";
import fs from "fs";
import LocalError from "./error";
import winston from "winston";

// Init score with boost mode.
async function mkScore(scoreData: Uint8Array, excerpt="", boost=true, soundFont=false) {
    await webmscore.ready;
    let score: webmscore;
    if (boost) {
        try {
            score = await webmscore.load("mscz", scoreData, [], false);
        } catch (e) {
            throw new LocalError(0);
        }
    } else {
        try {
            score = await webmscore.load("mscz", scoreData);
        } catch (e) {
            throw new LocalError(0);
        }
    }

    if (soundFont) {
        // Audio needs soundfonts
        // From https://github.com/Xmader/musescore-downloader/blob/master/src/mscore.ts
        const SF3 = Object.values(require("@librescore/sf3"))[0] as string;
        const data = await fs.promises.readFile(SF3);
        await score.setSoundFont(data);
    }

    const metadata = await score.metadata();

    // Excerpts
    await score.generateExcerpts();
    if (excerpt != "") {
        if (metadata.excerpts[excerpt]) {
            await score.setExcerptId(metadata.excerpts[excerpt].id);
        } else {
            score.destroy();
            throw new LocalError(1);
        }
    }

    return score;
};

export { mkScore };
