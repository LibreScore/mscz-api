import winston from "winston";
import webmscore from "webmscore";
import { RequestHandler } from "express";
import * as mscore from "./mscore";
import * as error from "./error";

export default (async (req, res) => {
  winston.http("SHEET accessed.");

  let score: webmscore;
  try {
    score = await mscore.mkScore(
      res.locals.type,
      req.body,
      req.params.eid,
      false
    );
  } catch (e) {
    return error.handleHTTP(res, e);
  }

  const sheet = await score.savePdf();

  // Send it off.
  res.setHeader(
    "Content-Disposition",
    `attachement; filename=${await score.titleFilenameSafe()}_${
      req.params.eid || "FULLSCORE"
    }.pdf`
  );
  res.contentType("application/pdf");
  res.send(Buffer.from(sheet));

  score.destroy();
}) as RequestHandler;
