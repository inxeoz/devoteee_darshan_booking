export function formatDateTime(dateStr: string, timeStr: string) {
  try {
    if (!dateStr && !timeStr) return "—";
    const candidate =
      dateStr && timeStr ? `${dateStr}T${timeStr}` : (dateStr ?? timeStr);
    const d = new Date(candidate);
    if (isNaN(+d)) {
      const d2 = new Date(`${dateStr} ${timeStr}`);
      if (!isNaN(+d2)) return d2.toLocaleString();
      return `${dateStr ?? ""} ${timeStr ?? ""}`.trim();
    }
    return new Intl.DateTimeFormat(undefined, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return `${dateStr ?? ""} ${timeStr ?? ""}`.trim();
  }
}
