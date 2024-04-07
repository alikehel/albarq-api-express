import dotenv from "dotenv";
import z from "zod";

dotenv.config();

const schema = z.object({
    PORT: z.coerce.number().min(1).max(65535),
    NODE_ENV: z.enum(["production", "development"]),
    JWT_SECRET: z.string().min(1),
    JWT_EXPIRES_IN: z.string().min(1),
    SECRET: z.string().min(1),
    DATABASE_URL: z.string().min(1).url(),
    FIREBASE_PROJECT_ID: z.string().min(1),
    FIREBASE_CLIENT_EMAIL: z.string().min(1),
    FIREBASE_PRIVATE_KEY: z.string().min(1)
});

export const env = schema.parse(process.env);
