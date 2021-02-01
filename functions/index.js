/* eslint-disable @typescript-eslint/no-var-requires */

const functions = require("firebase-functions");
const app = require("./dist/index").default;

const runtimeOpts = {
    memory: "512MB",
};

exports.api = functions.runWith(runtimeOpts).https.onRequest(app);
