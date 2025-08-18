import { createKyselyHandler } from "./kysely";
import { createPrismaHandler } from "./prisma";
import { createSequelizeHandler } from "./sequelize";

export * from "./prisma";
export * from "./kysely";
export * from "./sequelize";

export const queryHandlers = {
  prisma: createPrismaHandler,
  kysely: createKyselyHandler,
  sequelize: createSequelizeHandler,
} as const;
