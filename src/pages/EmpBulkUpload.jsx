import { useState, useRef, useCallback } from "react";
import { StepIndicator } from "../components/BulkUploadHelpers";
import { bulkUploadEmployeesAPI } from "../apis";

// ─── helpers ──────────────────────────────────────────────────────────────────

const fmtNum = (n) => (n ?? 0).toLocaleString();

// ─── sub-components ───────────────────────────────────────────────────────────

function Toggle({ on, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      className={`relative w-10 h-[22px] rounded-full transition-colors duration-200 flex-shrink-0
        ${on ? "bg-emerald-500" : "bg-slate-300"}`}
    >
      <span
        className={`absolute top-[3px] w-4 h-4 bg-white rounded-full shadow transition-all duration-200
          ${on ? "left-[22px]" : "left-[3px]"}`}
      />
    </button>
  );
}

function StatCard({ label, value, color }) {
  const colors = {
    default: "text-slate-900",
    green: "text-emerald-600",
    blue: "text-blue-600",
    amber: "text-amber-600",
    red: "text-red-500",
  };
  return (
    <div className="flex-1 min-w-[110px] bg-slate-50 rounded-xl p-4">
      <p className="text-[11px] uppercase tracking-widest text-slate-400 font-medium mb-1">
        {label}
      </p>
      <p className={`text-2xl font-semibold leading-tight ${colors[color] ?? colors.default}`}>
        {fmtNum(value)}
      </p>
    </div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export default function BulkUpload() {
  /*
    onUpload(fileBuffer, { adminId, dryRun }) → Promise<results>
    results shape:
    {
      total, created, updated, skipped,
      previewCreated, previewUpdated,
      errors: [{ empCode, reason }]
    }
  */

  const [phase, setPhase] = useState("upload"); // upload | process | preview | done
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [dryRun, setDryRun] = useState(true);
  const [adminId, setAdminId] = useState("");
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const inputRef = useRef(null);
  const progressRef = useRef(null);

  // ── drag handlers ──
  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setDragging(true);
  }, []);
  const onDragLeave = useCallback(() => setDragging(false), []);
  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f && /\.xlsx?$/.test(f.name)) setFile(f);
  }, []);

  const onFileChange = (e) => {
    const f = e.target.files[0];
    if (f) setFile(f);
  };

  // ── simulate animated progress ──
  function animateProgress(onDone) {
    let p = 0;
    clearInterval(progressRef.current);
    progressRef.current = setInterval(() => {
      p += Math.random() * 14 + 6;
      if (p >= 100) {
        clearInterval(progressRef.current);
        setProgress(100);
        onDone();
      } else {
        setProgress(Math.min(p, 98));
      }
    }, 220);
  }

  // ── submit ──
  async function handleSubmit() {
    if (!file) return;
    setError(null);
    setProgress(0);
    setPhase("process");

    try {
      const resultPromise = bulkUploadEmployeesAPI(file, { adminId: adminId || null, dryRun })
      console.log(resultPromise, "resultPromise")

      animateProgress(async () => {
        const res = await resultPromise;
        // If no real API, use mock data for demo
        const mockResults = {
          total: 148,
          created: dryRun ? 0 : 31,
          updated: dryRun ? 0 : 114,
          skipped: 3,
          previewCreated: dryRun ? 31 : 0,
          previewUpdated: dryRun ? 114 : 0,
          errors: [
            { empCode: "EMP047", reason: "Missing name or designation" },
            { empCode: "EMP113", reason: "Duplicate email: john.doe@company.internal" },
            { empCode: "EMP201", reason: "Invalid date format in DOJ column" },
          ],
        };
        setResults(res ?? mockResults);
        setPhase(dryRun ? "preview" : "done");
      });
    } catch (err) {
      clearInterval(progressRef.current);

      setResults({
        total: 0,
        created: 0,
        updated: 0,
        skipped: 0,
        previewCreated: 0,
        previewUpdated: 0,
        errors: [
          {
            empCode: "-",
            reason: err.message
          }
        ]
      });

      setPhase("preview");
    }
  }

  function reset() {
    setPhase("upload");
    setFile(null);
    setResults(null);
    setProgress(0);
    setError(null);
  }

  // ──────────────────────────────────────────────────────────────────
  // RENDER: Upload phase
  // ──────────────────────────────────────────────────────────────────
  function renderUpload() {
    return (
      <>
        <h1 className="text-3xl font-light text-slate-900 mb-1" style={{ fontFamily: "'Georgia', serif" }}>
          Bulk Employee Upload
        </h1>
        <p className="text-sm text-slate-500 mb-8">
          Upload an Excel workbook with a{" "}
          <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 text-xs font-mono">
            master data
          </code>{" "}
          sheet to create or update employee records.
        </p>

        {/* Drop zone */}
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all select-none
            ${file
              ? "border-emerald-400 bg-emerald-50"
              : dragging
              ? "border-blue-400 bg-blue-50"
              : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100"}`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={onFileChange}
          />
          <div className="flex justify-center mb-3">
            {file ? (
              <svg className="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                <rect x="3" y="3" width="18" height="18" rx="3" strokeLinecap="round" />
              </svg>
            ) : (
              <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
              </svg>
            )}
          </div>
          <p className={`font-medium text-sm mb-1 ${file ? "text-emerald-700" : "text-slate-700"}`}>
            {file ? file.name : "Drop your Excel file here"}
          </p>
          <p className="text-xs text-slate-400">
            {file
              ? `${(file.size / 1024).toFixed(1)} KB · .xlsx / .xls`
              : "or click to browse — .xlsx and .xls accepted"}
          </p>
        </div>

        {/* Options */}
        <div className="mt-5 bg-slate-50 rounded-2xl p-5 space-y-4">
          <p className="text-[11px] uppercase tracking-widest text-slate-400 font-medium">
            Upload options
          </p>

          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-800">Dry run (preview only)</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Simulate the upload without writing to the database
              </p>
            </div>
            <Toggle on={dryRun} onChange={setDryRun} />
          </div>

          {/* <div className="space-y-1.5">
            <label className="text-xs text-slate-500">Admin ID (optional)</label>
            <input
              type="text"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              placeholder="e.g. admin_001"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-800
                placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
            />
          </div> */}
        </div>

        {error && (
          <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="mt-5 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={!file}
            className="px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl
              hover:bg-slate-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {dryRun ? "Preview changes →" : "Upload employees →"}
          </button>
        </div>
      </>
    );
  }

  // ──────────────────────────────────────────────────────────────────
  // RENDER: Processing phase
  // ──────────────────────────────────────────────────────────────────
  function renderProcess() {
    return (
      <div className="py-16 text-center">
        <div className="flex justify-center mb-5">
          <svg
            className="w-12 h-12 text-blue-400 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
        </div>
        <p className="text-base font-medium text-slate-800 mb-1">
          {dryRun ? "Analysing your file…" : "Uploading employees…"}
        </p>
        <p className="text-sm text-slate-400 mb-8">
          Processing in batches of 20 · {Math.round(progress)}% complete
        </p>
        <div className="max-w-xs mx-auto h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────
  // RENDER: Results (preview or done)
  // ──────────────────────────────────────────────────────────────────
  function renderResults(isDryRun) {
    const r = results;
    const stats = isDryRun
      ? [
          { label: "Total rows", value: r.total, color: "default" },
          { label: "Would create", value: r.previewCreated, color: "green" },
          { label: "Would update", value: r.previewUpdated, color: "blue" },
          { label: "Would skip", value: r.skipped, color: "amber" },
        ]
      : [
          { label: "Total rows", value: r.total, color: "default" },
          { label: "Created", value: r.created, color: "green" },
          { label: "Updated", value: r.updated, color: "blue" },
          { label: "Skipped", value: r.skipped, color: "amber" },
        ];

    return (
      <>
        {/* Header */}
        <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl font-light text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>
              {isDryRun ? <>Preview <em>ready</em></> : <>Upload <em>complete</em></>}
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {isDryRun
                ? `${r.total} rows scanned · no changes written`
                : `${r.total} rows processed · ${new Date().toLocaleTimeString()}`}
            </p>
          </div>
          <button
            onClick={reset}
            className="text-sm text-slate-500 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 transition"
          >
            ← New upload
          </button>
        </div>

        {/* Stat cards */}
        <div className="flex gap-2.5 flex-wrap mb-5">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        {/* Errors */}
        {r.errors?.length > 0 ? (
          <div className="rounded-xl border border-red-200 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-red-50">
              <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" />
                <path strokeLinecap="round" d="M12 8v4M12 16h.01" />
              </svg>
              <p className="text-sm font-medium text-red-700">
                {r.errors.length} row{r.errors.length > 1 ? "s" : ""} failed
              </p>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-red-100">
                  <th className="text-left px-4 py-2 text-xs text-slate-400 font-medium">Emp Code</th>
                  <th className="text-left px-4 py-2 text-xs text-slate-400 font-medium">Reason</th>
                </tr>
              </thead>
              <tbody>
                {r.errors.map((e, i) => (
                  <tr
                    key={i}
                    className={`${
                      e.reason.toLowerCase().includes("duplicate")
                        ? "bg-amber-50"
                        : i % 2 === 0
                        ? "bg-white"
                        : "bg-slate-50"
                    }`}
                  >
                    <td className="px-4 py-2.5 font-mono text-xs text-slate-700">{e.empCode}</td>
                    <td className="px-4 py-2.5 text-slate-500 flex items-center gap-2">
                      {e.reason.toLowerCase().includes("duplicate") && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-700 font-medium">
                          DUPLICATE
                        </span>
                      )}
                      {e.reason}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 px-4 py-3 bg-emerald-50 rounded-xl border border-emerald-200">
            <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
              <circle cx="12" cy="12" r="10" />
            </svg>
            <p className="text-sm text-emerald-700">No errors — all rows processed successfully</p>
          </div>
        )}

        {/* Dry run CTA */}
        {isDryRun && (
          <div className="mt-5 flex items-center justify-between gap-4 flex-wrap">
            <p className="text-xs text-slate-400">
              Happy with the preview? Switch off dry run to commit changes.
            </p>
            <button
              onClick={() => {
                setDryRun(false);
                setPhase("process");
                handleSubmit();
              }}
              className="px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-700 transition"
            >
              Proceed with real upload →
            </button>
          </div>
        )}
      </>
    );
  }

  // ──────────────────────────────────────────────────────────────────
  // TOP-LEVEL RENDER
  // ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white flex items-start justify-center p-6 pt-12">
      <div className="w-full max-w-2xl">
        <StepIndicator phase={phase} />

        {phase === "upload" && renderUpload()}
        {phase === "process" && renderProcess()}
        {phase === "preview" && renderResults(true)}
        {phase === "done" && renderResults(false)}
      </div>
    </div>
  );
}