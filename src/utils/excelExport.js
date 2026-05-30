import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export async function exportExcel(data) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Trips");

  worksheet.columns = [
    { header: "SL No", key: "slNo", width: 10 },
    { header: "Date", key: "date", width: 15 },
    { header: "Vehicle Number", key: "vehicleNumber", width: 20 },
    { header: "Vehicle Type", key: "vehicleType", width: 15 },
    { header: "Ticket Number", key: "ticketNumber", width: 25 },
    { header: "From", key: "from", width: 15 },
    { header: "To", key: "to", width: 40 },
    { header: "Rate", key: "rate", width: 15 },
    { header: "Detention", key: "detention", width: 15 },
    { header: "Total", key: "total", width: 15 },
  ];

  // Header Style
  worksheet.getRow(1).font = {
    bold: true,
    size: 12,
  };

  // Data Rows
  data.forEach((row) => {
    worksheet.addRow({
      slNo: row.slNo,
      date: row.date,
      vehicleNumber: row.vehicleNumber,
      vehicleType: row.vehicleType,
      ticketNumber: row.ticketNumber,
      from: row.from,
      to: row.to,
      rate: row.rate,
      detention: row.detention,
      total: row.total,
    });
  });

  // Totals
  const totalTrips = data.length;

  const totalRate = data.reduce(
    (sum, row) => sum + Number(row.rate || 0),
    0
  );

  const totalDetention = data.reduce(
    (sum, row) => sum + Number(row.detention || 0),
    0
  );

  const grandTotal = data.reduce(
    (sum, row) => sum + Number(row.total || 0),
    0
  );

  worksheet.addRow([]);

  worksheet.addRow({
    to: "TOTAL TRIPS",
    total: totalTrips,
  });

  worksheet.addRow({
    to: "TOTAL RATE",
    total: totalRate,
  });

  worksheet.addRow({
    to: "TOTAL DETENTION",
    total: totalDetention,
  });

  worksheet.addRow({
    to: "GRAND TOTAL",
    total: grandTotal,
  });

  const buffer = await workbook.xlsx.writeBuffer();

  const blob = new Blob([buffer], {
    type:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, "Trip2Excel_Report.xlsx");
}