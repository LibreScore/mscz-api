import winston from "winston";
import webmscore from "webmscore";
import { RequestHandler } from "express";
import * as mscore from "./mscore";
import * as error from "./error";

export default (async (req, res) => {
  winston.http("MIDI accessed.");

  let score: webmscore;
  try {
    score = await mscore.mkScore(res.locals.type, req.body, req.params.eid);
  } catch (e) {
    return error.handleHTTP(res, e);
  }

  // Do the actual conversion.
  const midi = await score.saveMidi();

  // Send it off.
  res.setHeader(
    "Content-Disposition",
    `attachement; filename=${await score.titleFilenameSafe()}_${
      req.params.eid || "FULLSCORE"
    }.mid`
  );
  res.contentType("audio/midi");
  res.send(Buffer.from(midi));

  score.destroy();
}) as RequestHandler;
