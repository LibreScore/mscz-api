import { CustomError } from "ts-custom-error";
import express from "express";

/*
==MSCZ-API ERROR DEFINITIONS==
0: Invalid MSCZ file or error loading program
1: Invalid excerpt/instrument id, bad request
2: Invalid path/conversion target
3 (unused): problem converting, internal server error
*/

class LocalError extends CustomError {
    public static errorDefinitions = [
        "Invalid MSCZ file",
        "Invalid excerpt/instrument id",
        "Invalid path/conversion target",
        "problem converting, internal server error"
    ];

    public static errorCodes = [
        400,
        400,
        404,
        500
    ];

    public static defaultError = "Unknown error.";
    public constructor(
        public code: number,
        message?: string
    ) {
        super(message || LocalError.errorDefinitions[code] || LocalError.defaultError);
    }
}

export default LocalError;

function handleHTTP(res: express.Response, err: LocalError) {
    res.status(LocalError.errorCodes[err.code] || 500).send(err.message);
}
export {handleHTTP};
