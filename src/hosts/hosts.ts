import express from "express";
import archiver from "archiver";
import * as fs from "node:fs";
import path from "node:path";
import { getFormattedDate } from "../utils/date";
import { logger } from "../utils/logger";
import { genScripts } from "../utils/generate";

const router = express.Router();

router.post("/gen", async (req, res) => {
    let scripts = "\n";
    for (const key in req.body) {
        scripts += key + " " + req.body[key] + "\n";
    }
    const str = genScripts(scripts);

    const dirName = getFormattedDate();
    const dirPath = path.join(process.cwd(), process.env.SCRIPT_DIR!, dirName);
    const FILENAME = "test";

    try {
        fs.accessSync(dirPath, fs.constants.F_OK);
    } catch (e) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    try {
        fs.writeFileSync(path.join(dirPath, `${FILENAME}.sh`), str);
        fs.chmodSync(path.join(dirPath, `${FILENAME}.sh`), "755");
    } catch (e) {
        logger.error(e);
        res.send("error");
    }

    const archive = archiver("zip");

    archive.on("warning", function (err) {
        if (err.code === "ENOENT") {
            logger.warn(err);
            res.send(err);
        } else {
            logger.error(err);
            res.send(err);
        }
    });

    archive.on("error", function (err) {
        logger.error(err);
        res.send(err);
    });

    archive.append(fs.createReadStream(path.join(dirPath, `${FILENAME}.sh`)), {
        name: `update-hosts.sh`,
    });

    archive.append(
        fs.createReadStream(
            path.join(process.cwd(), process.env.SCRIPT_DIR!, "recover.sh")
        ),
        {
            name: "recover-hosts.sh",
        }
    );

    archive.finalize();

    const output = fs.createWriteStream(path.join(dirPath, `${FILENAME}.zip`));

    archive.pipe(output);

    output.on("close", function () {
        res.sendFile(
            path.join(process.env.SCRIPT_DIR!, dirName, `${FILENAME}.zip`),
            { root: "." },
            (err) => {
                if (err) {
                    logger.error(err);
                    res.send("fail");
                }
            }
        );
    });
});

export default router;
