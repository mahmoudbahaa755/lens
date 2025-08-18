"use client";

import { useState, useMemo } from "react";
import { Check, Copy } from "lucide-react";
import jsBeautify from "js-beautify";

interface MongoViewerProps {
  query: string;
}

// MongoDB keywords and operators to highlight
const MONGO_KEYWORDS = [
  "db", "find", "insertOne", "insertMany", "updateOne", "updateMany",
  "deleteOne", "deleteMany", "aggregate", "project", "match", "group",
  "sort", "limit", "skip", "$match", "$project", "$group", "$sort",
  "$limit", "$skip", "$and", "$or", "$eq", "$ne", "$in", "$nin",
];

function highlightMongo(query: string) {
  const tokens = query.split(/(\s+|[{}[\]()=,:])/);

  return tokens.map((token, i) => {
    if (!token.trim()) return <span key={i}>{token}</span>;

    if (/^['"`].*['"`]$/.test(token)) {
      // Strings
      return <span key={i} className="text-green-600 dark:text-green-400">{token}</span>;
    }

    if (/^\d+\.?\d*$/.test(token)) {
      // Numbers
      return <span key={i} className="text-orange-600 dark:text-orange-400">{token}</span>;
    }

    if (MONGO_KEYWORDS.includes(token)) {
      // Keywords
      return <span key={i} className="text-blue-600 dark:text-blue-400 font-semibold">{token}</span>;
    }

    return <span key={i}>{token}</span>;
  });
}

function MongoViewer({ query }: MongoViewerProps) {
  const [copied, setCopied] = useState(false);

  const formattedQuery = useMemo(() => {
    try {
      return jsBeautify.js(query, {
        indent_size: 2,
        space_in_empty_paren: true,
        max_preserve_newlines: 2,
      });
    } catch {
      return query;
    }
  }, [query]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formattedQuery);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const highlightedQuery = useMemo(() => highlightMongo(formattedQuery), [formattedQuery]);

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
        {highlightedQuery}
      </pre>
    </div>
  );
}

export default MongoViewer;
