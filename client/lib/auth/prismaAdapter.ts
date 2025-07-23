import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { Adapter } from "next-auth/adapters";

// Your singleton Prisma instance
import prisma from "@/lib/prisma";

export function CustomPrismaAdapter(prisma: PrismaClient): Adapter {
    const base = PrismaAdapter(prisma);

    return {
        ...base,
        deleteSession: async (sessionToken: string) => {

            await prisma.session.deleteMany({
                where: { sessionToken },
            });
        },
    };
}
