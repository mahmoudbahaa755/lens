"use client";

import type React from "react";
import type { JSX } from "react";
import { useState } from "react";

interface JsonViewerProps {
  data: Record<string, any>;
}

function generateRandomKey(prefix = "key") {
  return prefix + "-" + Math.random().toString(36).substr(2, 9);
}

const JsonViewer: React.FC<JsonViewerProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const CopyIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );

  const CheckIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );

  const formatJson = (obj: any, indent = 0): JSX.Element[] => {
    const elements: JSX.Element[] = [];
    const indentStr = "  ".repeat(indent);

    if (Array.isArray(obj)) {
      elements.push(
        <span
          key={generateRandomKey("open-bracket")}
          className="text-neutral-600 dark:text-neutral-400"
        >
          [
        </span>,
      );
      obj.forEach((item, index) => {
        elements.push(<br key={generateRandomKey("br")} />);
        elements.push(
          <span key={generateRandomKey("indent")} className="text-transparent">
            {indentStr}{" "}
          </span>,
        );
        elements.push(...formatJson(item, indent + 1));
        if (index < obj.length - 1) {
          elements.push(
            <span
              key={generateRandomKey("comma")}
              className="text-neutral-600 dark:text-neutral-400"
            >
              ,
            </span>,
          );
        }
      });
      elements.push(<br key={generateRandomKey("br-close")} />);
      elements.push(
        <span
          key={generateRandomKey("indent-close")}
          className="text-transparent"
        >
          {indentStr}
        </span>,
      );
      elements.push(
        <span
          key={generateRandomKey("close-bracket")}
          className="text-neutral-600 dark:text-neutral-400"
        >
          ]
        </span>,
      );
    } else if (typeof obj === "object" && obj !== null) {
      elements.push(
        <span
          key={generateRandomKey("open-brace")}
          className="text-neutral-600 dark:text-neutral-400"
        >
          {"{"}
        </span>,
      );
      const entries = Object.entries(obj);
      entries.forEach(([key, value], index) => {
        elements.push(<br key={generateRandomKey("br")} />);
        elements.push(
          <span key={generateRandomKey("indent")} className="text-transparent">
            {indentStr}{" "}
          </span>,
        );
        elements.push(
          <span
            key={generateRandomKey("key")}
            className="text-blue-600 dark:text-blue-400"
          >
            "{key}"
          </span>,
        );
        elements.push(
          <span
            key={generateRandomKey("colon")}
            className="text-neutral-600 dark:text-neutral-400"
          >
            :{" "}
          </span>,
        );
        if (typeof value === "string") {
          elements.push(
            <span
              key={generateRandomKey("value-string")}
              className="text-green-600 dark:text-green-400"
            >
              "{value}"
            </span>,
          );
        } else if (typeof value === "number") {
          elements.push(
            <span
              key={generateRandomKey("value-number")}
              className="text-orange-600 dark:text-orange-400"
            >
              {value}
            </span>,
          );
        } else if (typeof value === "boolean") {
          elements.push(
            <span
              key={generateRandomKey("value-boolean")}
              className="text-purple-600 dark:text-purple-400"
            >
              {value.toString()}
            </span>,
          );
        } else if (value === null) {
          elements.push(
            <span
              key={generateRandomKey("value-null")}
              className="text-neutral-500 dark:text-neutral-400"
            >
              null
            </span>,
          );
        } else {
          elements.push(...formatJson(value, indent + 1));
        }
        if (index < entries.length - 1) {
          elements.push(
            <span
              key={generateRandomKey("comma")}
              className="text-neutral-600 dark:text-neutral-400"
            >
              ,
            </span>,
          );
        }
      });
      elements.push(<br key={generateRandomKey("br-close")} />);
      elements.push(
        <span
          key={generateRandomKey("indent-close")}
          className="text-transparent"
        >
          {indentStr}
        </span>,
      );
      elements.push(
        <span
          key={generateRandomKey("close-brace")}
          className="text-neutral-600 dark:text-neutral-400"
        >
          {"}"}
        </span>,
      );
    }
    return elements;
  };

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
        {copied ? <CheckIcon /> : <CopyIcon />}
      </button>
      <pre className="whitespace-pre-wrap pr-12 text-neutral-800 dark:text-neutral-200">
        {formatJson(data)}
      </pre>
    </div>
  );
};

export default JsonViewer;
