import type { Prisma } from "@prisma/client";

export const userSelect = {
    id: true,
    avatar: true,
    name: true,
    username: true,
    phone: true,
    employee: {
        select: {
            role: true,
            permissions: true,
            company: {
                select: {
                    id: true,
                    name: true,
                    logo: true,
                    color: true
                }
            }
        }
    },
    client: {
        select: {
            role: true,
            company: {
                select: {
                    id: true,
                    name: true,
                    logo: true,
                    color: true
                }
            }
        }
    },
    admin: {
        select: {
            // phone: true,
            role: true
        }
    }
} satisfies Prisma.UserSelect;

export const userSelectReform = (
    user: Prisma.UserGetPayload<{
        select: typeof userSelect;
    }> | null
) => {
    if (!user) {
        throw new Error("لم يتم العثور على المستخدم");
    }
    return {
        id: user.id,
        avatar: user.avatar || "",
        name: user.name,
        username: user.username,
        phone: user.phone,
        role: user.employee?.role || user.client?.role || user.admin?.role || "",
        company: user.employee?.company || user.client?.company || null,
        permissions: user.employee?.permissions || []
    };
};
