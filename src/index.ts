import "dotenv/config";
import express from "express";
import hosts from "./hosts/hosts";
import { LoggerMiddleware } from "./middleware/logger.middleware";
import { genRecoverScript } from "./utils/generate";
import { CorsMiddleware } from "./middleware/cors.middleware";

const app = express();

app.use(express.json());
app.use(CorsMiddleware);
app.use(LoggerMiddleware);
app.use("/hosts", hosts);

genRecoverScript();

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
