import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
    return new PrismaClient();
};

// Ensure Prisma Client is a singleton across hot reloads in development
const globalForPrisma = globalThis;

const db = globalForPrisma.prismaGlobal ?? prismaClientSingleton();

export default db;

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prismaGlobal = db;
}
