import { PrismaClient } from "@prisma/client";

declare global {
  namespace globalThis {
    let prismaDb: PrismaClient;
  }
}
