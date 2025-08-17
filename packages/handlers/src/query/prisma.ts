import { PrismaClient } from "@prisma/client";
import { lensUtils } from "@lens/core";
import { QueryWatcherHandler } from "../types";

function shouldIgnorePrismaQuery(query: string) {
  const ignoredQueries = ["COMMIT", "BEGIN", "ROLLBACK", "SAVEPOINT"];

  return ignoredQueries.includes(query);
}

export function createPrismaHandler(prisma: PrismaClient): QueryWatcherHandler {
  return async ({ onQuery }) => {
    prisma.$on("query", (e: any) => {
      if (!shouldIgnorePrismaQuery(e.query)) {
        onQuery({
          query: lensUtils.interpolateQuery(e.query.toLowerCase(), JSON.parse(e.params)),
          duration: e.duration,
          createdAt: e.timestamp,
        });
      }
    });
  };
}
