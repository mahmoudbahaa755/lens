import { createPrismaHandler } from "./prisma";

export * from "./prisma";
export const queryHandlers = {
  prisma: createPrismaHandler,
} as const;
