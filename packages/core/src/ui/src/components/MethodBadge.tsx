export default function MethodBadge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    GET: "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-white",
    POST: "bg-blue-100 text-blue-800 dark:bg-blue-600 dark:text-white",
    PUT: "bg-yellow-100 text-yellow-800 dark:bg-yellow-600 dark:text-white",
    DELETE: "bg-red-100 text-red-800 dark:bg-red-600 dark:text-white",
  };

  return (
    <span
      className={`rounded px-2 py-1 text-sm font-semibold ${
        colors[method.toUpperCase()] || "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-white"
      }`}
    >
      {method}
    </span>
  );
}

