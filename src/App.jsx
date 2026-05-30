import { useState } from "react";
import { parseNotes } from "./utils/parser";
import { exportExcel } from "./utils/excelExport";

function App() {
  const [notes, setNotes] = useState("");

  const handleExport = async () => {
    const rows = parseNotes(notes);

    // DEBUG
    console.log("Parsed Rows:", rows);

    await exportExcel(rows);
  };

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "auto",
        padding: "30px",
        fontFamily: "Arial",
      }}
    >
      <h1>🚚 Trip2Excel</h1>

      <h3>Convert Transport Notes into Excel Reports</h3>

      <textarea
        rows={20}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Paste your transport notes here..."
        style={{
          width: "100%",
          padding: "15px",
          fontSize: "14px",
          borderRadius: "8px",
        }}
      />

      <br />
      <br />

      <button
        onClick={handleExport}
        style={{
          padding: "12px 24px",
          cursor: "pointer",
          fontSize: "16px",
          borderRadius: "8px",
        }}
      >
        Convert To Excel
      </button>
    </div>
  );
}

export default App;