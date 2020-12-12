// Logger setup: winston

import winston from "winston";
import nconf from "nconf";

export default (): void => {
    if (!winston.format) return;

    // From stucco: https://github.com/Toad39/stucco
    const formats = [];
    // @ts-ignore
    formats.push(winston.format.colorize());
    // @ts-ignore
    formats.push((winston.format(msg => {
        // Custom timestamp
        msg.level = `[${Math.floor(Date.now() / 100)}] ${msg.level}`;
        return msg;
    }))());
    // @ts-ignore
    formats.push(winston.format.splat());
    // @ts-ignore
    formats.push(winston.format.simple());
    const fileFormats = [...formats];
    fileFormats.shift(); // Take off the colorization for files.

    winston.configure({
        level: nconf.get("log:level") || "info",
        transports: [
            new winston.transports.Console({
                handleExceptions: true,
                format: winston.format.combine.apply(null, formats)
            }),
            new winston.transports.File({
                filename: nconf.get("log:file") || "../mscz-api.log",
                format: winston.format.combine.apply(null, fileFormats)
            })
        ]
    });
};