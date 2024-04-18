import log4js from "log4js";

log4js.configure({
    appenders: {
        out: { type: "console", layout: { type: "colored" } },
        file: { type: "file", filename: "logs/server.log" },
    },
    categories: { default: { appenders: ["out", "file"], level: "info" } },
});

export const logger = log4js.getLogger("default");
