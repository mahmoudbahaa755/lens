import React from "react";
import type { ExceptionEntry } from "../types";

interface CodeFrameViewerProps {
  codeFrame: ExceptionEntry["codeFrame"];
}

const CodeFrameViewer: React.FC<CodeFrameViewerProps> = ({ codeFrame }) => {
  if (!codeFrame) {
    return null;
  }

  const { file, line, column, context } = codeFrame;
  const { pre, error, post } = context;

  const allLines = [...pre, error, ...post];
  const errorLineIndex = pre.length;

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md overflow-auto text-sm font-mono">
      <div className="mb-2 text-gray-700 dark:text-gray-300">
        File: {file} (Line: {line}, Column: {column})
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-md p-2">
        {allLines.map((codeLine, index) => {
          const currentLineNumber = line - errorLineIndex + index;
          const isErrorLine = index === errorLineIndex;

          return (
            <div
              key={index}
              className={`flex items-start ${isErrorLine ? "bg-red-100 dark:bg-red-900" : ""}`}
            >
              <span className="text-gray-500 dark:text-gray-400 w-8 text-right pr-2 select-none">
                {currentLineNumber}
              </span>
              <pre className="flex-1 whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                {codeLine}
                {isErrorLine && (
                  <div
                    className="relative h-4"
                    style={{ left: `${(column - 1) * 0.6}rem` }} // Approximate character width
                  >
                    <span className="absolute top-0 left-0 text-red-500 dark:text-red-400 text-3xl leading-none">
                      ↑
                    </span>
                  </div>
                )}
              </pre>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CodeFrameViewer;
