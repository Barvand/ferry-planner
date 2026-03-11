export function formatDate(date: string) {
  return new Date(date + "Z").toLocaleString("no-NO", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
