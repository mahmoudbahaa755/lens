import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

export function now() {
  return dayjs().utc();
}

export function nowISO() {
  return now().toISOString();
}

export function sqlDateTime(dateTime?: dayjs.Dayjs | null) {
  const time = dateTime ?? now();

  return time.utc().format("YYYY-MM-DD HH:mm:ss");
}

export function convertToUTC(dateTime: string) {
  return dayjs(dateTime).utc().toISOString();
}

export function getCurrentTimezone(): string {
  return dayjs.tz.guess();
}

function parseBackendUTC(date: string | Date | number) {
  return dayjs.utc(date).tz(getCurrentTimezone());
}

export const humanDifferentDate = (date: string | Date) => {
  const d = parseBackendUTC(date);

  return {
    label: d.fromNow(),
    exact: d.format("YYYY-MM-DD HH:mm:ss"),
  };
};

export function formatTimeAgo(dateInput: string | number | Date): string {
  const d = parseBackendUTC(dateInput);

  return d.isValid() ? d.fromNow() : "Unknown";
}

export function formatDateWithTimeAgo(
  dateInput: string | number | Date | null | undefined,
  locale: string = "en"
): string {
  if (!dateInput) return "N/A";

  const d = parseBackendUTC(dateInput);

  if (!d.isValid()) return "N/A";

  const formatted = d.locale(locale).format("MMMM D, YYYY h:mm A");
  return `${formatted} (${d.fromNow()})`;
}

