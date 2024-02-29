import app from "./app";
import { PORT } from "./config/config";
import { automaticUpdatesCronJob } from "./cron-jobs/automaticUpdatesCronJob";
import { Logger } from "./lib/logger";

const address = `http://localhost:${PORT}`;

const server = app.listen(PORT, () => {
    console.info("------------------------------------------------------------");
    Logger.debug(`Starting APP On -> ${address}`);
    automaticUpdatesCronJob.start();
});

process.on("uncaughtException", (err) => {
    // console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    // console.log(err.name, "\n", err.message);
    Logger.error("💥 UNCAUGHT EXCEPTION! 💥 Shutting down... 💥");
    Logger.error(`${err.name}\n${err.message}`);
    process.exit(1);
});

process.on("unhandledRejection", (err: Error) => {
    // console.log("UNHANDLED REJECTION! 💥 Shutting down...");
    // console.log(err.name, err.message);
    Logger.error("💥 UNHANDLED REJECTION! 💥 Shutting down... 💥");
    Logger.error(`${err.name}\n${err.message}`);
    server.close(() => {
        process.exit(1);
    });
});
