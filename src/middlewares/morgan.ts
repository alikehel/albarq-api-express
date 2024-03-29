import morgan, { StreamOptions } from "morgan";

import { Logger } from "../lib/logger";

// Override the stream method by telling
// Morgan to use our custom logger instead of the console.log.
const stream: StreamOptions = {
    // Use the http severity
    write: (message) => Logger.http(message.replace(/\n$/, ""))
};

// Skip all the Morgan http log if the
// application is not running in dev mode.
// This method is not really needed here since
// we already told to the logger that it should print
// only warning and error messages in production.
// const skip = () => {
//     const env = process.env.NODE_ENV || "dev";
//     return env !== "dev";
// };

// Build the morgan middleware

export const morganMiddlewareImmediate = morgan(
    '--> [ :user-agent | :remote-addr | :remote-user | ":method :url" ]',
    {
        stream,
        immediate: true
    }
);

export const morganMiddleware = morgan(
    '<-- [ :user-agent | :remote-addr | :remote-user | ":method :url" | :status | :res[content-length] | :response-time ms ]',
    // ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"',
    { stream }
);
