import { DateTime } from "luxon";
import { format } from "sql-formatter";
import { randomUUID } from "crypto";
import { fileURLToPath } from "url";
import path from "path/posix";

export const generateRandomUuid = () => {
  return randomUUID();
};

export function interpolateQuery(query: string, bindings: any[]): string {
  let i = 0;
  return query.replace(/\?/g, () => {
    if (i >= bindings.length) {
      throw new Error("Not enough bindings for placeholders");
    }

    const value = bindings[i++];

    if (value === null || value === undefined) {
      return "NULL";
    }

    if (typeof value === "string") {
      return `'${value.replace(/'/g, "''")}'`;
    }

    if (value instanceof DateTime) {
      return `'${value.toISO()}'`;
    }

    if (value instanceof Date) {
      return `'${value.toISOString()}'`;
    }

    if (Array.isArray(value)) {
      return value
        .map((v) => (typeof v === "string" ? `'${v.replace(/'/g, "''")}'` : v))
        .join(", ");
    }

    if (typeof value === "object") {
      return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
    }

    return value;
  });
}

export const formatSqlQuery = (query: string) => {
  return format(query);
};

export function now() {
  return DateTime.now();
}

export function sqlDateTime(dateTime?: DateTime | null) {
  const time = dateTime ?? now();

  return time.toSQL({ includeOffset: false });
}

export function getMeta(metaUrl?: string): {
  __filename: string;
  __dirname: string;
} {
  const isESM = typeof __dirname === "undefined";

  if (isESM) {
    if (!metaUrl) {
      throw new Error("In ESM, you must pass import.meta.url to getMeta()");
    }

    const __filename = fileURLToPath(metaUrl);
    const __dirname = path.dirname(__filename);
    return { __filename, __dirname };
  } else {
    // @ts-ignore - available only in CJS
    return { __filename, __dirname };
  }
}

export function isStaticFile(params: string[]) {
  return params.includes("_app");
}

export function stripBeforeAppPath(url: string) {
  const match = url.match(/_app.*/);
  return match ? match[0] : url;
}

export function prepareIgnoredPaths(path: string, ignoredPaths: RegExp[]) {
  const normalizedPath = path.replace(/^\/+|\/+$/g, "");
  ignoredPaths = [
    ...ignoredPaths,
    new RegExp(`^\/?${normalizedPath}(\/|$)`),
    /^\/?lens-config$/,
    /^\/\.well-known\//,
  ];

  return { ignoredPaths, normalizedPath };
}
