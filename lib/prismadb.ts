import { PrismaClient } from "@prisma/client";


// @ts-ignore
const client = global.prismaDb || new PrismaClient();

if (process.env.NODE_ENV === "production") {
  global.prismaDb = client;
}

export default client;
