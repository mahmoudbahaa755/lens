"use client";

import type React from "react";
import { useState } from "react";
import JsonViewer from "../JsonViewer";

export interface TabbedDataProps {
  tabs: TabItem[];
  title?: string;
  defaultActiveTab?: string;
}

export interface TabItem {
  id: string;
  label: string;
  data: Record<string, any>;
  content?: React.ReactNode;
}

const TabbedDataViewer: React.FC<TabbedDataProps> = ({
  tabs,
  title,
  defaultActiveTab,
}) => {
  const [activeTab, setActiveTab] = useState<string>(
    defaultActiveTab || tabs[0]?.id || ""
  );

  return (
    <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-sm">
      {/* Header */}
      {title && (
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            {title}
          </h2>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-neutral-200 dark:border-neutral-700">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6 bg-white dark:bg-neutral-800">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={activeTab === tab.id ? "block" : "hidden"}
          >
            {tab.content ? (
              <div>{tab.content}</div>
            ) : (
              <JsonViewer data={tab.data} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabbedDataViewer;
