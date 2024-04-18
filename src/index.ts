import express from "express";
import hosts from "./hosts/hosts";
import { LoggerMiddleware } from "./middleware/logger";

const app = express();

app.use(express.json());
app.use(LoggerMiddleware);
app.use("/hosts", hosts);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});