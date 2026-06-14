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

    // Vehicle
    if (isVehicleLine(line)) {
      let vehicleType = "";
      let vehicleNumber = line;

      if (line.includes("Pickup")) {
        vehicleType = "Pickup";
        vehicleNumber = line.replace("Pickup", "").trim();
      } else if (line.includes("TATA Ace")) {
        vehicleType = "TATA Ace";
        vehicleNumber = line.replace("TATA Ace", "").trim();
      } else if (line.includes("Mini Truck")) {
        vehicleType = "Mini Truck";
        vehicleNumber = line
          .replace("Mini Truck 14ft.", "")
          .replace("Mini Truck", "")
          .trim();
      }

      let ticketNumber = "";
      let from = "Hirakud";
      let to = "";
      let rate = 0;
      let detention = 0;

      // Collect all lines belonging to this trip
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

      // Destination
      const routeMatch = blockText.match(/Hirakud\s+to\s+(.+)/i);

      if (routeMatch) {
        to = routeMatch[1];
      }

      // Rate
      const rateMatches = [...blockText.matchAll(/=\s*(\d+)/g)];

      if (rateMatches.length > 0) {
        rate = Number(rateMatches[0][1]);
      }

      // Detention / Detaintion
      const detentionMatch = blockText.match(
        /(Detention|Detaintion).*?=\s*(\d+)/i
      );

      if (detentionMatch) {
        detention = Number(detentionMatch[2]);
      }

      // Clean destination text
      to = to
        .replace(/Ticket\s*no.*$/i, "")
        .replace(/1 Day.*$/i, "")
        .replace(/2 Day.*$/i, "")
        .replace(/3 Day.*$/i, "")
        .replace(/Detention.*$/i, "")
        .replace(/Detaintion.*$/i, "")
        .replace(/=\s*\d+.*/g, "")
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