/*
The point of this is a basic frontent to webmscore, because a lot of the options in webmscore
are/will be hardcoded for the API so there is no need to replace it. An example of this is 
sound font files.
*/
import webmscore from "webmscore";
import SOUNDFONT_FILES from "@librescore/sf3";
import fs from "fs";
import LocalError from "./error";
import { getStreamWriter } from "./logger";
import winston from "winston";

type scoreType = "mscz" | "mxl" | "musicxml" | "midi";

const ready = (async function () {
  webmscore["stderr"] = getStreamWriter(winston.debug);
  webmscore["stdout"] = getStreamWriter(winston.debug);

  await webmscore.ready;

  // Audio needs soundfonts
  // From https://github.com/Xmader/musescore-downloader/blob/master/src/mscore.ts
  const SF3 = Object.values(SOUNDFONT_FILES)[0] as string;
  const data = await fs.promises.readFile(SF3);
  await webmscore["setSoundFont"](data);
})();

// Init score with boost mode.
async function mkScore(
  t: scoreType,
  scoreData: Uint8Array,
  excerpt = "",
  boost = true
): Promise<webmscore> {
  await ready;

  winston.debug(`Type: ${t}`);

  let score: webmscore;
  if (boost) {
    try {
      score = await webmscore.load(t, scoreData, [], false);
    } catch (e) {
      winston.debug(`(mscore 39): ${e}`);
      throw new LocalError(0);
    }
  } else {
    try {
      score = await webmscore.load(t, scoreData);
    } catch (e) {
      winston.debug(`(mscore 46): ${e}`);
      throw new LocalError(0);
    }
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
}

export { mkScore };
