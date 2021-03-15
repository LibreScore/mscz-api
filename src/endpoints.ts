import meta from "./meta";
import midi from "./midi";
import musicxml from "./musicxml";
import audio from "./audio";
import sheet from "./sheet";

import { RequestHandler } from "express";
import LocalError, { handleHTTP } from "./error";

const endpointDefs = {
  meta: meta,

  midi: midi,

  mxml: musicxml,
  mmxl: musicxml,

  mp3: audio,
  ogg: audio,
  flac: audio,
  wav: audio,

  pdf: sheet
};

export default (async (req, res) => {
  if (!endpointDefs[req.params.target]) {
    return handleHTTP(res, new LocalError(2));
  }
  await endpointDefs[req.params.target](req, res);
}) as RequestHandler;
