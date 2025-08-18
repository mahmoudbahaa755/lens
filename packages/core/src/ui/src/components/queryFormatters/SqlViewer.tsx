"use client";

import { Check, Copy } from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";

// --- Static constants ---
const KEYWORDS = [
  "SELECT", "FROM", "WHERE", "JOIN", "INNER", "LEFT", "RIGHT", "OUTER", "FULL",
  "ON", "AND", "OR", "NOT", "IN", "EXISTS", "BETWEEN", "LIKE", "IS", "NULL",
  "INSERT", "INTO", "VALUES", "UPDATE", "SET", "DELETE", "CREATE", "TABLE",
  "ALTER", "DROP", "INDEX", "PRIMARY", "KEY", "FOREIGN", "REFERENCES",
  "CONSTRAINT", "UNIQUE", "CHECK", "DEFAULT", "AUTO_INCREMENT", "IDENTITY",
  "GROUP", "BY", "HAVING", "ORDER", "ASC", "DESC", "LIMIT", "OFFSET", "UNION",
  "ALL", "DISTINCT", "COUNT", "SUM", "AVG", "MIN", "MAX", "CASE", "WHEN", "THEN",
  "ELSE", "END", "IF", "IFNULL", "COALESCE", "CAST", "CONVERT", "SUBSTRING",
  "LENGTH", "UPPER", "LOWER", "TRIM",
];

const FUNCTIONS = [
  "NOW", "CURRENT_TIMESTAMP", "CURRENT_DATE", "CURRENT_TIME", "DATE", "TIME",
  "YEAR", "MONTH", "DAY", "HOUR", "MINUTE", "SECOND",
];

const DATA_TYPES = [
  "VARCHAR", "CHAR", "TEXT", "INT", "INTEGER", "BIGINT", "SMALLINT", "TINYINT",
  "DECIMAL", "NUMERIC", "FLOAT", "DOUBLE", "REAL", "BIT", "BOOLEAN", "BOOL",
  "DATE", "TIME", "DATETIME", "TIMESTAMP", "YEAR", "BINARY", "VARBINARY",
  "BLOB", "CLOB", "JSON", "UUID",
];

// --- Syntax highlighter ---
function highlightSql(sqlText: string) {
  // Split into words, spaces, punctuation, strings, numbers, comments
  const tokens = sqlText.split(
    /(\s+|[(),;]|'[^']*'|"[^"]*"|\b\d+\.?\d*\b|--[^\n]*|\/\*[\s\S]*?\*\/)/
  );

  return tokens.map((token, index) => {
    const trimmed = token.trim();
    if (!trimmed) return <span key={index}>{token}</span>;

    if ((token.startsWith("'") && token.endsWith("'")) ||
        (token.startsWith('"') && token.endsWith('"')))
      return <span key={index} className="text-green-600 dark:text-green-400">{token}</span>;

    if (/^\d+\.?\d*$/.test(trimmed))
      return <span key={index} className="text-orange-600 dark:text-orange-400">{token}</span>;

    if (token.startsWith("--") || (token.startsWith("/*") && token.endsWith("*/")))
      return <span key={index} className="text-neutral-500 dark:text-neutral-400">{token}</span>;

    if (KEYWORDS.some(k => k.toLowerCase() === trimmed.toLowerCase()))
      return <span key={index} className="text-blue-600 dark:text-blue-400 font-semibold">{token.toUpperCase()}</span>;

    if (FUNCTIONS.some(f => f.toLowerCase() === trimmed.toLowerCase()))
      return <span key={index} className="text-purple-600 dark:text-purple-400">{token.toUpperCase()}</span>;

    if (DATA_TYPES.some(t => t.toLowerCase() === trimmed.toLowerCase()))
      return <span key={index} className="text-indigo-600 dark:text-indigo-400">{token.toUpperCase()}</span>;

    return <span key={index}>{token}</span>;
  });
}

interface SqlViewerProps {
  sql: string;
}

const SqlViewer: React.FC<SqlViewerProps> = ({ sql }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(sql);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const highlightedSql = useMemo(() => highlightSql(sql), [sql]);

  return (
    <div className="bg-neutral-50 dark:bg-slate-900 rounded-lg p-4 font-mono text-sm overflow-x-auto relative">
      <button
        onClick={copyToClipboard}
        className={`absolute top-3 right-3 p-2 rounded-md transition-colors ${
          copied
            ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
            : "bg-white text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 dark:bg-slate-800 dark:text-neutral-400 dark:hover:text-neutral-300 dark:hover:bg-slate-700"
        }`}
        title={copied ? "Copied!" : "Copy to clipboard"}
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </button>
      <pre className="whitespace-pre-wrap pr-12 text-neutral-800 dark:text-neutral-200">
        {highlightedSql}
      </pre>
    </div>
  );
};

export default SqlViewer;
