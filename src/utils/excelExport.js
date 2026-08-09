import * as XLSX from "xlsx";

function exportExcel(trips) {
  const header = ["SL", "DATE", "VEHICLE", "TYPE", "TICKET", "FROM", "TO", "RATE", "DETENTION", "TOTAL"];
  const rows = trips.map((t) => [
    t.slNo, t.date, t.vehicleNumber, t.vehicleType, t.ticketNumber,
    t.from, t.to, t.rate, t.detention, t.total,
  ]);

  const ws = XLSX.utils.aoa_to_sheet([header, ...rows]);
  ws["!cols"] = [
    { wch: 5 }, { wch: 12 }, { wch: 14 }, { wch: 16 }, { wch: 12 },
    { wch: 16 }, { wch: 16 }, { wch: 12 }, { wch: 12 }, { wch: 12 },
  ];

  rows.forEach((_, i) => {
    [7, 8, 9].forEach((col) => {
      const ref = XLSX.utils.encode_cell({ r: i + 1, c: col });
      if (ws[ref]) ws[ref].z = '"₹"#,##0';
    });
  });

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Trip Report");
  XLSX.writeFile(wb, "Trip2Excel_Report.xlsx");
}

export { exportExcel };
