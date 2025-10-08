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

export function slotTimeTo24hr(slotLabel: string) {
  const [time, meridian] = slotLabel.split(" ");
  if (!meridian) return time;
  const [hStr, mStr] = time.split(":");
  let h = parseInt(hStr, 10);
  const m = mStr || "00";
  if (meridian.toUpperCase() === "PM" && h !== 12) h += 12;
  if (meridian.toUpperCase() === "AM" && h === 12) h = 0;
  return `${h.toString().padStart(2, "0")}:${m}`;
}

export function slotTimeTo12hr(time24: string) {
  // Handle invalid or empty input
  if (!time24) return time24;

  const [hStr, mStr = "00"] = time24.split(":");
  let h = parseInt(hStr, 10);
  const m = mStr.padStart(2, "0");

  const meridian = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12; // convert 0 → 12, 13 → 1, etc.

  return `${h}:${m} ${meridian}`;
}
