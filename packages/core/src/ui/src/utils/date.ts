import dayjs from "dayjs";

export const humanDifferentDate = (date: string | Date) => {
  const d = dayjs(date);
  return {
    label: d.fromNow(),
    exact: d.format("YYYY-MM-DD HH:mm:ss"),
  };
};

export function formateDateToNow(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
}

export function formatTimeAgo(dateString: string): string {
  try {
    const date = new Date(dateString);
    return formateDateToNow(date);
  } catch {
    return "Unknown";
  }
}

export function formatDateWithTimeAgo(
  dateInput: string | number | Date | null | undefined,
  locale: string = "en-US",
): string {
  if (!dateInput) return "N/A";

  try {
    const date = new Date(dateInput);

    if (isNaN(date.getTime())) return "N/A";

    const formatted = date.toLocaleString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const timeAgo = formateDateToNow(date);
    return `${formatted} (${timeAgo})`;
  } catch {
    return "N/A";
  }
}
