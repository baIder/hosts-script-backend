import "dotenv/config";
import express from "express";
import hosts from "./hosts/hosts";
import { LoggerMiddleware } from "./middleware/logger.middleware";
import { CorsMiddleware } from "./middleware/cors.middleware";

const PORT = 17777;
const app = express();

app.use(express.json());
app.use(CorsMiddleware);
app.use(LoggerMiddleware);
app.use("/hosts", hosts);

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});
