import { PrismaClient } from "@prisma/client";
// import organizations from "../database/seed/data/organizations";
// import AppError from "../utils/AppError.util";
import { UserSigninType } from "./auth.zod";

const prisma = new PrismaClient();
export class AuthModel {
    async signin(user: UserSigninType) {
        const returnedUser = await prisma.user.findUnique({
            where: {
                username: user.username
            },
            select: {
                id: true,
                role: true,
                password: true,
                username: true,
                name: true
            }
        });
        return returnedUser;
    }
}
