export function parseNotes(text) {
  const rows = [];

  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "");

  let currentDate = "";
  let slNo = 1;

  const isVehicleLine = (line) => {
    return (
      line.includes("Pickup") ||
      line.includes("TATA Ace") ||
      line.includes("Mini Truck")
    );
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Date
    if (line.startsWith("Dt.") || line.startsWith("Dt ")) {
      currentDate = line
        .replace("Dt.", "")
        .replace("Dt ", "")
        .trim();
      continue;
    }

    // Vehicle Entry
    if (isVehicleLine(line)) {
      let vehicleLine = line;

      let vehicleType = "";

      if (vehicleLine.includes("Pickup")) {
        vehicleType = "Pickup";
      } else if (vehicleLine.includes("TATA Ace")) {
        vehicleType = "TATA Ace";
      } else if (vehicleLine.includes("Mini Truck")) {
        vehicleType = "Mini Truck";
      }

      const vehicleNumber = vehicleLine
        .replace("Pickup", "")
        .replace("TATA Ace", "")
        .replace("Mini Truck 14ft.", "")
        .replace("Mini Truck", "")
        .trim();

      let ticketNumber = "";
      let from = "Hirakud";
      let to = "";
      let rate = 0;
      let detention = 0;

      // Collect block until next vehicle/date
      let block = [];

      for (let j = i + 1; j < lines.length; j++) {
        const nextLine = lines[j];

        if (
          isVehicleLine(nextLine) ||
          nextLine.startsWith("Dt.") ||
          nextLine.startsWith("Dt ")
        ) {
          break;
        }

        block.push(nextLine);
      }

      const blockText = block.join(" ");

      // Ticket Number
      const ticketMatch = blockText.match(/Ticket\s*no\.?\s*(\d+)/i);

      if (ticketMatch) {
        ticketNumber = ticketMatch[1];
      }

      // Route
      const routeMatch = blockText.match(/Hirakud\s+to\s+(.+)/i);

      if (routeMatch) {
        to = routeMatch[1];
      }

      // Rate
      const rateMatches = [...blockText.matchAll(/=\s*(\d+)/g)];

      if (rateMatches.length > 0) {
        rate = Number(rateMatches[0][1]);
      }

      // Detention
      const detentionMatch = blockText.match(
        /Det[a-zA-Z]*\s*charge\s*=\s*(\d+)/i
      );

      if (detentionMatch) {
        detention = Number(detentionMatch[1]);
      }

      // Clean destination
      to = to
        .replace(/Ticket\s*no.*$/i, "")
        .replace(/=\s*\d+.*/g, "")
        .replace(/1 Day.*$/i, "")
        .trim();

      rows.push({
        slNo,
        date: currentDate,
        vehicleNumber,
        vehicleType,
        ticketNumber,
        from,
        to,
        rate,
        detention,
        total: rate + detention,
      });

      slNo++;
    }
  }

  return rows;
}