import { useRef, useState, useCallback } from "react";
import { UploadCloud } from "lucide-react";

export default function UploadZone({ onFile }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = useCallback((files) => {
    const file = files && files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => onFile(String(e.target.result || ""));
    reader.readAsText(file);
  }, [onFile]);

  return (
    <div
      className={`t2x-dropzone${dragging ? " dragging" : ""}`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
      onClick={() => inputRef.current && inputRef.current.click()}
      role="button" tabIndex={0}
    >
      <input ref={inputRef} type="file" accept=".txt" hidden onChange={(e) => handleFiles(e.target.files)} />
      <div className="t2x-dropzone-icon"><UploadCloud size={22} strokeWidth={1.75} /></div>
      <div className="t2x-dropzone-title">Drop your file here</div>
      <div className="t2x-dropzone-or">or</div>
      <div className="t2x-dropzone-browse">Browse files</div>
      <div className="t2x-dropzone-hint">TXT files supported</div>
    </div>
  );
}
