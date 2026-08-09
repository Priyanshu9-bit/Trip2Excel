import { Pencil, FileSpreadsheet } from "lucide-react";
import { money } from "../utils/helpers";

export default function PreviewTable({ trips, editing, onEdit }) {
  return (
    <div className="t2x-table-wrap">
      <table className="t2x-table">
        <thead><tr>
          <th>SL</th><th>DATE</th><th>VEHICLE</th><th>TYPE</th><th>TICKET</th>
          <th>FROM</th><th>TO</th><th className="num">RATE</th>
          <th className="num">DETENTION</th><th className="num">TOTAL</th>
        </tr></thead>
        <tbody>
          {trips.map((t, i) => (
            <tr key={i}>
              <td>{t.slNo}</td><td>{t.date}</td><td className="mono">{t.vehicleNumber}</td>
              <td>{t.vehicleType}</td><td className="mono">{t.ticketNumber}</td>
              <td className="truncate" title={t.from}>{t.from}</td>
              <td className="truncate" title={t.to}>{t.to}</td>
              <td className="num mono">{editing ? (
                <input className="t2x-cell-input" type="number" value={t.rate}
                  onChange={(e) => onEdit(i, "rate", Number(e.target.value))} />
              ) : money(t.rate)}</td>
              <td className="num mono highlight-detention">{editing ? (
                <input className="t2x-cell-input" type="number" value={t.detention}
                  onChange={(e) => onEdit(i, "detention", Number(e.target.value))} />
              ) : money(t.detention)}</td>
              <td className="num mono highlight-total">{money(t.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
