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
  return format(query, {
    dataTypeCase: "upper",
    keywordCase: "upper",
    functionCase: "upper",
  });
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
  return params.includes("assets");
}

export function stripBeforeAssetsPath(url: string) {
  const match = url.match(/assets.*/);
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

export function prettyHrTime(
  hrtime: [number, number],
  verbose = false,
): string {
  const seconds = hrtime[0];
  const nanoseconds = hrtime[1];
  const ms = seconds * 1000 + nanoseconds / 1e6;

  if (verbose) {
    if (seconds > 60) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}m ${remainingSeconds}s`;
    }
    if (seconds >= 1) {
      return `${seconds}.${Math.floor(nanoseconds / 1e7)}s`;
    }
    return `${ms.toFixed(3)} ms`;
  }

  if (ms < 1000) {
    return `${ms.toFixed(0)} ms`;
  }

  return `${(ms / 1000).toFixed(1)} s`;
}
