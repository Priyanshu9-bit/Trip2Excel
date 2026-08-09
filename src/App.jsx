import { useState, useMemo, useRef, useEffect } from "react";
import {
  BarChart3, Check, CheckCircle2, AlertTriangle, FileSpreadsheet,
  Loader2, Pencil, PiggyBank, Route, Timer, Wallet, X
} from "lucide-react";
import Sidebar from "./components/Sidebar";
import StatCard from "./components/StatCard";
import UploadZone from "./components/UploadZone";
import PreviewTable from "./components/PreviewTable";
import { SAMPLE_NOTES, parseNotes } from "./utils/parser";
import { exportExcel } from "./utils/excelExport";
import { money, greeting } from "./utils/helpers";
import "./index.css";

function ProcessingOverlay({ stepIndex }) {
  const steps = ["Extracting vehicles", "Reading ticket numbers", "Calculating rates", "Processing detention charges"];
  return (
    <div className="t2x-processing">
      <Loader2 className="t2x-spin" size={22} strokeWidth={2} />
      <div className="t2x-processing-title">Analyzing transport records…</div>
      <ul className="t2x-processing-steps">
        {steps.map((s, i) => (
          <li key={s} className={i <= stepIndex ? "done" : ""}>
            <span className="t2x-step-dot">{i < stepIndex ? <Check size={11} strokeWidth={3} /> : null}</span>{s}
          </li>
        ))}
      </ul>
    </div>
  );
}

function EmptyState({ onImportClick }) {
  return (
    <div className="t2x-empty">
      <div className="t2x-empty-icon"><Route size={26} strokeWidth={1.6} /></div>
      <div className="t2x-empty-title">No transport data yet</div>
      <div className="t2x-empty-sub">Paste your transport notes or upload a TXT file to generate your first report.</div>
      <button className="t2x-btn primary" type="button" onClick={onImportClick}>Import Notes</button>
    </div>
  );
}

function Toast({ toast, onClose }) {
  if (!toast) return null;
  const isError = toast.type === "error";
  return (
    <div className={`t2x-toast${isError ? " error" : ""}`}>
      {isError ? <AlertTriangle size={16} strokeWidth={2.25} /> : <CheckCircle2 size={16} strokeWidth={2.25} />}
      <span>{toast.message}</span>
      <button type="button" onClick={onClose} className="t2x-toast-close"><X size={14} /></button>
    </div>
  );
}

export default function App() {
  const [notes, setNotes] = useState("");
  const [trips, setTrips] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [parseError, setParseError] = useState(false);
  const [editing, setEditing] = useState(false);
  const [toast, setToast] = useState(null);
  const importRef = useRef(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (!isProcessing) return;
    setStepIndex(0);
    const interval = setInterval(() => setStepIndex((i) => Math.min(i + 1, 4)), 380);
    return () => clearInterval(interval);
  }, [isProcessing]);

  const stats = useMemo(() => ({
    totalTrips: trips.length,
    totalRate: trips.reduce((s, t) => s + t.rate, 0),
    totalDetention: trips.reduce((s, t) => s + t.detention, 0),
    grandTotal: trips.reduce((s, t) => s + t.total, 0),
  }), [trips]);

  const handleParse = () => {
    if (!notes.trim()) return;
    setIsProcessing(true); setParseError(false); setEditing(false);
    setTimeout(() => {
      const parsed = parseNotes(notes);
      setTrips(parsed); setParseError(parsed.length === 0); setIsProcessing(false);
    }, 1550);
  };

  const handleClear = () => {
    setNotes(""); setTrips([]); setParseError(false); setEditing(false);
  };

  const handleEditCell = (index, field, value) => {
    setTrips((prev) => prev.map((t, i) => {
      if (i !== index) return t;
      const next = { ...t, [field]: Number.isFinite(value) ? value : 0 };
      next.total = next.rate + next.detention;
      return next;
    }));
  };

  const handleDownload = () => {
    if (!trips.length) return;
    exportExcel(trips);
    setToast({ type: "success", message: "Excel report downloaded successfully" });
  };

  const scrollToImport = () => importRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="t2x-root">
      <div className="t2x-glow" aria-hidden="true" />
      <div className="t2x-shell">
        <Sidebar />
        <main className="t2x-main">
          <header className="t2x-header">
            <div>
              <div className="t2x-greeting">{greeting()} 👋</div>
              <h1 className="t2x-title">Transport Report</h1>
              <p className="t2x-subtitle">Turn your raw transport notes into structured Excel reports.</p>
            </div>
            <button className="t2x-btn primary" type="button" onClick={scrollToImport}>Import Notes</button>
          </header>

          <section className="t2x-stats stats-grid">
            <StatCard icon={Route} label="TOTAL TRIPS" value={stats.totalTrips} />
            <StatCard icon={Wallet} label="TOTAL RATE" value={money(stats.totalRate)} />
            <StatCard icon={Timer} label="DETENTION" value={money(stats.totalDetention)} />
            <StatCard icon={PiggyBank} label="GRAND TOTAL" value={money(stats.grandTotal)} accent />
          </section>

          <section className="t2x-card t2x-import" ref={importRef}>
            <div className="t2x-card-head">
              <h2>Import Transport Notes</h2>
              <p>Paste your transport notes or upload a text file. We’ll automatically structure them into a clean report.</p>
            </div>
            <div className="import-grid">
              <UploadZone onFile={setNotes} />
              <div className="t2x-textarea-col">
                <textarea className="t2x-textarea" placeholder="Paste your notes here..." value={notes} onChange={(e) => setNotes(e.target.value)} />
                {!notes && <button type="button" className="t2x-sample-link" onClick={() => setNotes(SAMPLE_NOTES)}>Use sample notes</button>}
              </div>
            </div>
            {parseError && (
              <div className="t2x-error">
                <AlertTriangle size={16} strokeWidth={2.25} />
                <div><div className="t2x-error-title">Unable to process these notes</div>
                  <div className="t2x-error-sub">Please check that your transport notes contain vehicle numbers, ticket numbers or route information.</div>
                </div>
              </div>
            )}
            <div className="t2x-import-actions">
              <button className="t2x-btn primary" type="button" onClick={handleParse} disabled={!notes.trim() || isProcessing}>Parse Notes</button>
              <button className="t2x-btn ghost" type="button" onClick={handleClear}>Clear</button>
            </div>
            {isProcessing && <ProcessingOverlay stepIndex={stepIndex} />}
          </section>

          {!isProcessing && trips.length > 0 && (
            <section className="t2x-card t2x-preview">
              <div className="t2x-card-head row">
                <div><h2>Report Preview</h2><p>{trips.length} trip{trips.length !== 1 ? "s" : ""} found</p></div>
                <div className="t2x-preview-actions">
                  <button className="t2x-btn ghost" type="button" onClick={() => setEditing((v) => !v)}>
                    <Pencil size={14} strokeWidth={2.25} />{editing ? "Done" : "Edit"}
                  </button>
                  <button className="t2x-btn primary" type="button" onClick={handleDownload}>
                    <FileSpreadsheet size={15} strokeWidth={2.25} />Download Excel
                  </button>
                </div>
              </div>
              <PreviewTable trips={trips} editing={editing} onEdit={handleEditCell} />
              <div className="t2x-summary">
                <div className="t2x-summary-title">Report Summary</div>
                <div className="t2x-summary-row"><span>Trips</span><span className="mono">{stats.totalTrips}</span></div>
                <div className="t2x-summary-row"><span>Transport Charges</span><span className="mono">{money(stats.totalRate)}</span></div>
                <div className="t2x-summary-row"><span>Detention Charges</span><span className="mono">{money(stats.totalDetention)}</span></div>
                <div className="t2x-summary-row grand"><span>Grand Total</span><span className="mono">{money(stats.grandTotal)}</span></div>
              </div>
            </section>
          )}

          {!isProcessing && trips.length === 0 && !parseError && (
            <section className="t2x-card"><EmptyState onImportClick={scrollToImport} /></section>
          )}
        </main>
      </div>
      <div className="t2x-toast-wrap"><Toast toast={toast} onClose={() => setToast(null)} /></div>
    </div>
  );
}
