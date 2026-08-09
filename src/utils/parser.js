const SAMPLE_NOTES = `1. 15/01/2025, MH12AB1234, Truck, Ticket TKT10234, From Mumbai to Pune, Rate 12000, Detention 500
2. 16/01/2025, KA05CD5678, Trailer, TKT10235, From Bangalore to Chennai, Rate 18000
3. 17/01/2025, GJ01EF9012, Container, Ticket TKT10236, From Ahmedabad to Surat, Rate 9500, Detention 800
4. 18/01/2025, MH14GH3456, Tempo, TKT10237, From Pune to Nashik, Rate 6200
5. 19/01/2025, RJ14IJ7890, Truck, TKT10238, From Jaipur to Udaipur, Rate 14500, Detention 700`;

const VEHICLE_TYPES = [
  "Open Body Truck", "Container Truck", "Trailer 40ft", "Tempo Traveller",
  "Mini Truck", "Container", "Trailer", "Tempo", "Pickup", "Truck", "Van",
].sort((a, b) => b.length - a.length);

function detectVehicleType(block) {
  const lower = block.toLowerCase();
  for (const type of VEHICLE_TYPES) {
    if (lower.includes(type.toLowerCase())) return type;
  }
  return null;
}

function toNumber(str) {
  if (!str) return 0;
  const n = parseInt(String(str).replace(/,/g, ""), 10);
  return Number.isFinite(n) ? n : 0;
}

function titleCase(str) {
  return str.trim().replace(/\s+/g, " ")
    .replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase());
}

function formatDate(raw) {
  if (!raw) return "—";
  const parts = raw.split(/[\/\-]/).map((p) => p.trim());
  if (parts.length !== 3) return raw;
  let y, m, d;
  if (parts[0].length === 4) [y, m, d] = parts;
  else {
    [d, m, y] = parts;
    if (y.length === 2) y = (Number(y) > 50 ? "19" : "20") + y;
  }
  const dt = new Date(Number(y), Number(m) - 1, Number(d));
  if (Number.isNaN(dt.getTime())) return raw;
  return dt.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function splitIntoBlocks(text) {
  const trimmed = text.trim();
  if (!trimmed) return [];
  if (/\n\s*\n/.test(trimmed)) {
    return trimmed.split(/\n\s*\n+/).map((b) => b.trim()).filter(Boolean);
  }
  if (/^\s*\d+[\.\)]/m.test(trimmed)) {
    return trimmed.split(/(?=^\s*\d+[\.\)]\s*)/m).map((b) => b.trim()).filter(Boolean);
  }
  return trimmed.split(/\n+/).map((b) => b.trim()).filter(Boolean);
}

function parseBlock(block) {
  const flat = block.replace(/\s+/g, " ").trim();
  const vehicleMatch = flat.match(/\b([A-Za-z]{2}\s?-?\d{1,2}\s?-?[A-Za-z]{1,3}\s?-?\d{3,4})\b/);
  const ticketMatch = flat.match(/\b(?:ticket|tkt)[\s:#\-]*([A-Za-z0-9\/\-]+)/i);
  const dateMatch = flat.match(/\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})\b/);
  const rateMatch = flat.match(/\brate[\s:]*(?:rs\.?|inr|₹)?\s*([\d,]+)/i);
  const detentionMatch = flat.match(/\bdetention[\s:]*(?:rs\.?|inr|₹)?\s*([\d,]+)/i);
  const totalMatch = flat.match(/\btotal[\s:]*(?:rs\.?|inr|₹)?\s*([\d,]+)/i);

  const routeMatch =
    flat.match(/\bfrom\s+([A-Za-z][A-Za-z\s]{1,30}?)\s+to\s+([A-Za-z][A-Za-z\s]{1,30}?)(?=[,\.]|\s+(?:rate|ticket|tkt|detention|total|via)|$)/i) ||
    flat.match(/\b([A-Za-z][A-Za-z\s]{1,30}?)\s+(?:to|[-–>])\s+([A-Za-z][A-Za-z\s]{1,30}?)(?=[,\.]|\s+(?:rate|ticket|tkt|detention|total|via)|$)/i);

  const vehicleNumber = vehicleMatch ? vehicleMatch[1].toUpperCase().replace(/[\s\-]/g, "") : "";
  const ticketNumber = ticketMatch ? ticketMatch[1].toUpperCase() : "";
  const from = routeMatch ? titleCase(routeMatch[1]) : "";
  const to = routeMatch ? titleCase(routeMatch[2]) : "";

  if (!vehicleNumber && !ticketNumber && !(from && to)) return null;

  const rate = toNumber(rateMatch && rateMatch[1]);
  const detention = toNumber(detentionMatch && detentionMatch[1]);
  const total = totalMatch ? toNumber(totalMatch[1]) : rate + detention;

  return {
    date: dateMatch ? formatDate(dateMatch[1]) : "—",
    vehicleNumber: vehicleNumber || "—",
    vehicleType: detectVehicleType(flat) || (vehicleNumber ? "Truck" : "—"),
    ticketNumber: ticketNumber || "—",
    from: from || "—",
    to: to || "—",
    rate,
    detention,
    total,
  };
}

function parseNotes(text) {
  const blocks = splitIntoBlocks(text);
  const trips = [];
  blocks.forEach((block) => {
    const parsed = parseBlock(block);
    if (parsed) trips.push({ slNo: trips.length + 1, ...parsed });
  });
  return trips;
}

export { SAMPLE_NOTES, parseNotes };
