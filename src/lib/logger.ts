import winston from "winston";

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4
};

// const level = () => {
//     const env = process.env.NODE_ENV || "dev";
//     const isDevelopment = env === "dev";
//     return isDevelopment ? "debug" : "warn";
// };

const colors = {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    debug: "white"
};

winston.addColors(colors);

const format = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
        (info) =>
            `${info.timestamp} ${info.level}: ${info.message}\n------------------------------------------------------------`
    )
);

const transports = [
    new winston.transports.Console(),
    new winston.transports.File({
        filename: "logs/error.log",
        level: "error"
    }),
    new winston.transports.File({ filename: "logs/all.log" })
];

export const Logger = winston.createLogger({
    level: "debug",
    levels,
    format,
    transports
});
