/*
    HTTP API to manage MSCZ files.
    Copyright (C) 2020  Librescore

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import nconf from "nconf";
import winston from "winston";
import setupLogger from "./logger";
import server from "./server";

// Set config
nconf.argv().env({ separator: "." }).file({
    file: nconf.get("config") || "./config.json"
});
// eslint-disable-next-line @typescript-eslint/no-var-requires
nconf.set("version", require("../package.json").version);

// Setup logger
setupLogger();

// Information

winston.info(`mscz-api v${nconf.get("version")}`);
winston.info("Copyright (C) 2020  Librescore");
winston.info("This program comes with ABSOLUTELY NO WARRANTY");
winston.info("This is free software, and you are welcome to redistribute it under certain conditions.");
winston.info("---------------------------------------------------------------------------------------");


// Server
server.listen();

// handle SIGINT signal
process.on("SIGINT", () => {
    process.exit(0);
});
