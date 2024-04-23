import express from "express";
import * as fs from "node:fs";
import path from "node:path";
import sevenBin from "7zip-bin";
import Seven from "node-7z";
import { getFormattedDate, getFormattedTime } from "../utils/date";
import { logger } from "../utils/logger";
import { genScripts } from "../utils/generate";

const router = express.Router();

router.post("/gen", async (req, res) => {
    let scripts = "\n";
    const { data }: { data: { uuid: string; ip: string; domain: string }[] } =
        req.body;
    for (const item of data) {
        scripts += item.ip + " " + item.domain + "\n";
    }
    const str = genScripts(scripts);

    const dirName = getFormattedDate();
    const dirPath = path.join(process.cwd(), process.env.SCRIPT_DIR!, dirName);
    const FILENAME = getFormattedTime();

    try {
        fs.accessSync(dirPath, fs.constants.F_OK);
    } catch (e) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    try {
        fs.writeFileSync(path.join(dirPath, `${FILENAME}`), str);
        fs.chmodSync(path.join(dirPath, `${FILENAME}`), "755");
    } catch (e) {
        logger.error(e);
        res.send("error");
    }

    const pathTo7zip = sevenBin.path7za;

    try {
        fs.chmodSync(pathTo7zip, "755");
    } catch (e) {
        logger.error(e);
        res.send("error");
    }

    const zipStream = Seven.add(
        path.join(dirPath, `${FILENAME}.zip`),
        [
            path.join(dirPath, `${FILENAME}`),
            path.join(process.cwd(), process.env.SCRIPT_DIR!, "recover.sh"),
        ],
        {
            $bin: pathTo7zip,
        }
    );

    zipStream.on("error", (err) => {
        logger.error(err);
        res.send("error:" + err);
    });

    zipStream.on("end", () => {
        res.sendFile(path.join(dirPath, `${FILENAME}.zip`), (err) => {
            if (err) {
                logger.error(err);
                res.send("error");
            }
        });
    });
});

export default router;
