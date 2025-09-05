import React from "react";

interface StackTraceViewerProps {
  trace: string[];
}

const StackTraceViewer: React.FC<StackTraceViewerProps> = ({ trace }) => {
  return (
    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md overflow-auto text-sm">
      {trace.map((line, index) => (
        <code
          key={index}
          className="block font-mono text-red-600 dark:text-red-400 leading-relaxed py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
          title={line}
        >
          {line}
        </code>
      ))}
    </div>
  );
};

export default StackTraceViewer;
