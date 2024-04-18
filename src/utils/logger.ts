import log4js from "log4js";

log4js.configure({
    appenders: {
        console: { type: "console", layout: { type: "colored" } },
        dateFile: {
            type: "dateFile",
            filename: "logs/server.log",
            pattern: "yyyy-MM-dd",
            alwaysIncludePattern: true,
            keepFileExt: true,
        },
    },
    categories: {
        default: { appenders: ["console", "dateFile"], level: "info" },
    },
});

export const logger = log4js.getLogger("default");
