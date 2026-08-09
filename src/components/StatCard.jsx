export default function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className={`t2x-stat-card${accent ? " accent" : ""}`}>
      <div className="t2x-stat-top">
        <span className="t2x-stat-label">{label}</span>
        <span className="t2x-stat-icon"><Icon size={16} strokeWidth={2} /></span>
      </div>
      <div className="t2x-stat-value">{value}</div>
      <div className="t2x-stat-line" />
    </div>
  );
}
