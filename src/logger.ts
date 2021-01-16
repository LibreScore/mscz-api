// Logger setup: winston

import winston, { Logform } from "winston";
import nconf from "nconf";

export default (): void => {
    if (!winston.format) return;

    // Improved from stucco: https://github.com/Toad39/stucco
    const formats: Logform.Format[] = [];
    formats.push(winston.format.colorize());
    formats.push((winston.format(msg => {
        // Custom timestamp
        msg.level = `[${Math.floor(Date.now() / 1000)}] ${msg.level}`;
        return msg;
    }))());
    formats.push(winston.format.splat());
    formats.push(winston.format.simple());

    const fileFormats = formats.slice(1); // Take off the colorization for files.

    winston.configure({
        level: nconf.get("log:level") || "info",
        transports: [
            new winston.transports.Console({
                handleExceptions: true,
                format: winston.format.combine(...formats)
            }),
            new winston.transports.File({
                filename: nconf.get("log:file") || "../mscz-api.log",
                format: winston.format.combine(...fileFormats)
            })
        ]
    });
};

export function getStreamWriter(logger: (msg: Uint8Array) => unknown): (byte: number) => void {
    let buf = [] as number[];
    return (byte: number) => {
        if (byte === 0x0A /* \n */) {
            // flush on newlines
            logger(new Uint8Array(buf));
            buf = [];
        } else {
            buf.push(byte);
        }
    };
}
