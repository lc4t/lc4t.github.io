const formatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Shanghai",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export default function formatQaLetterDate(date: Date) {
  return formatter.format(date);
}
