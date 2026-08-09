import { Truck, LayoutDashboard, BarChart3, UploadCloud, Settings } from "lucide-react";

export default function Sidebar() {
  const items = [
    { icon: LayoutDashboard, label: "Dashboard", active: true },
    { icon: BarChart3, label: "Reports" },
    { icon: UploadCloud, label: "Import" },
    { icon: Settings, label: "Settings" },
  ];

  return (
    <aside className="t2x-sidebar">
      <div className="t2x-logo">
        <span className="t2x-logo-mark"><Truck size={18} strokeWidth={2.25} /></span>
        <span className="t2x-logo-text">Trip2Excel</span>
      </div>
      <nav className="t2x-nav">
        {items.map((it) => (
          <button key={it.label} className={`t2x-nav-item${it.active ? " active" : ""}`} type="button">
            <it.icon size={17} strokeWidth={2} />
            <span className="label">{it.label}</span>
          </button>
        ))}
      </nav>
      <div className="t2x-sidebar-footer">
        <span>Trip2Excel</span><span className="t2x-version">v1.0</span>
      </div>
    </aside>
  );
}
