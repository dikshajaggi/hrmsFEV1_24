import { useState, useEffect, useCallback, useRef } from "react";
import { getAttendanceSheet, markAttendance, markBulkAttendance } from "../apis/index";
import { CalendarDays, BarChart3 } from "lucide-react";
import { EDIT_CYCLE, MONTHS, STATUS_CONFIG } from "../data/attendanceSheet";
import {AttendanceSheetLegend} from "../components/AttendanceSheetComponents.jsx"

const isOffDay = (status) => status === "WEEKLY_OFF" || status === "HOLIDAY";
const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
const getDayName     = (y, m, d) => ["Su","Mo","Tu","We","Th","Fr","Sa"][new Date(y, m, d).getDay()];
const fmtDate        = (y, m, d) => `${y}-${String(m + 1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;


async function fetchSheet(month, page = 1, limit = 50) {
  const res = await getAttendanceSheet(month, page, limit);
  if (res.statusText !== "OK") throw new Error(`Failed to fetch: ${res.status}`);
  return res.data; // { data: [...], pagination: {...} }
}

async function handleMarkAttendance(employeeId, date, status) {
  const res = await markAttendance(employeeId, date, status);
  if (res.status !== 200) throw new Error(`Mark failed: ${res.status}`);
  return res;
}


function Toast({ message, type = "success" }) {
  if (!message) return null;
  const bg = type === "error" ? "#dc2626" : type === "loading" ? "#475569" : "#1e293b";
  return (
    <div style={{ position:"fixed", top:20, right:20, background:bg, color:"#fff", padding:"10px 18px", borderRadius:8, fontSize:13, zIndex:9999, boxShadow:"0 4px 20px rgba(0,0,0,0.25)", display:"flex", alignItems:"center", gap:8 }}>
      {type === "loading" && <span style={{ display:"inline-block", width:12, height:12, border:"2px solid #ffffff44", borderTop:"2px solid #fff", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />}
      {type === "success" && "✓"} {message}
    </div>
  );
}

function Skeleton({ width = "100%", height = 20, radius = 6 }) {
  return (
    <div style={{ width, height, borderRadius:radius, background:"linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)", backgroundSize:"200% 100%", animation:"shimmer 1.4s infinite" }} />
  );
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function Attendance() {
  const today = new Date();
  const [year, setYear]             = useState(today.getFullYear());
  const [month, setMonth]           = useState(today.getMonth());
  const [tab, setTab]               = useState("register");
  const [page, setPage]             = useState(1);

  // API state
  const [rows, setRows]             = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  // Optimistic overrides: { "empId_date": "STATUS" }
  const [overrides, setOverrides]   = useState({});
  const [saving, setSaving]         = useState({});

  const [toast, setToast]           = useState(null);
  const [toastType, setToastType]   = useState("success");
  const [activePopup, setActivePopup] = useState(null);
  const popupRef                    = useRef(null);

  const monthStr = `${year}-${String(month + 1).padStart(2, "0")}`;
  const days     = getDaysInMonth(year, month);
  const [markingToday, setMarkingToday] = useState(false);


  const tabs = [
  { id: "register", label: "Register", icon: CalendarDays },
  { id: "summary", label: "Summary", icon: BarChart3 }
];

  // ────────────────────────────────────────────────────────────────────
  // columnOffSet — built from first employee's attendance data.
  // A column is "off" (greyed header) if the day is WEEKLY_OFF or HOLIDAY
  // for the majority of employees. We use row[0] as a proxy because
  // weekly-off rules are typically company-wide.
  // ────────────────────────────────────────────────────────────────────
  const columnOffSet = new Set(
    rows.length > 0
      ? Object.entries(rows[0].attendance)
          .filter(([, status]) => isOffDay(status))
          .map(([date]) => date)
      : []
  );

  // ── Close popup on outside click ──
  useEffect(() => {
    const handler = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) setActivePopup(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Fetch on month / page change ──
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setOverrides({});

    fetchSheet(monthStr, page)
      .then(res => {
        if (!cancelled) {
          setRows(res.data);
          setPagination(res.pagination);
          setLoading(false);
        }
      })
      .catch(err => {
        if (!cancelled) { setError(err.message); setLoading(false); }
      });
    return () => { cancelled = true; };
  }, [monthStr, page]);

  // ── Toast helper ──
  const showToast = (msg, type = "success", duration = 2200) => {
    setToast(msg); setToastType(type);
    setTimeout(() => setToast(null), duration);
  };

  // ── Resolve display status — override beats API ──
  const getStatus = (empId, dateStr) => {
    const oKey = `${empId}_${dateStr}`;
    // overrides[oKey] is set only when HR manually marks something
    // row.attendance[dateStr] can be null (unmarked) or a status string
    return overrides[oKey] !== undefined
      ? overrides[oKey]
      : (rows.find(r => r.employeeId === empId)?.attendance[dateStr] ?? null);
  };

  // ── Mark a single cell ──
  const handleMark = useCallback(async (empId, dateStr, newStatus) => {
    const oKey = `${empId}_${dateStr}`;
    const prev = getStatus(empId, dateStr);

    setOverrides(o => ({ ...o, [oKey]: newStatus }));
    setSaving(s => ({ ...s, [oKey]: true }));
    setActivePopup(null);

    try {
      await handleMarkAttendance(empId, dateStr, newStatus);
      showToast(`${STATUS_CONFIG[newStatus]?.full} marked`);
    } catch (err) {
      // Rollback
      setOverrides(o => {
        const n = { ...o };
        if (prev !== null && prev !== undefined) n[oKey] = prev;
        else delete n[oKey];
        return n;
      });
      showToast(err.message, "error");
    } finally {
      setSaving(s => { const n = { ...s }; delete n[oKey]; return n; });
    }
  }, [rows, overrides]);

  // ── Cycle on single click ──
  const handleCellClick = (empId, dateStr) => {
    const cur = getStatus(empId, dateStr);
    // Block clicks on non-editable statuses (HOLIDAY, WEEKLY_OFF, LEAVE_*)
    if (cur && !STATUS_CONFIG[cur]?.editable) return;
    const idx  = EDIT_CYCLE.indexOf(cur);
    const next = EDIT_CYCLE[(idx + 1) % EDIT_CYCLE.length];
    handleMark(empId, dateStr, next);
  };


  // ── Mark ALL employees Present for today ──
  const handleMarkAllPresentToday = async () => {
    const todayStr = fmtDate(today.getFullYear(), today.getMonth(), today.getDate());

    // Only mark employees where today is a working day (not WEEKLY_OFF / HOLIDAY)
    // and is either null (unmarked) or an editable status
    const eligible = rows.filter(row => {
      const cur = getStatus(row.employeeId, todayStr);
      return !cur || STATUS_CONFIG[cur]?.editable;
    });

    if (eligible.length === 0) {
      showToast("All employees already marked for today");
      return;
    }

    // Confirm before bulk-marking
    if (!window.confirm(`Mark ${eligible.length} employee(s) as Present for today (${todayStr})?`)) return;

    setMarkingToday(true);

    // Optimistic update for all eligible employees
    const updates = {};
    eligible.forEach(row => { updates[`${row.employeeId}_${todayStr}`] = "PRESENT"; });
    setOverrides(o => ({ ...o, ...updates }));

    try {
      await markBulkAttendance(
        todayStr,
        eligible.map(e => e.employeeId)
      );
      showToast(`✓ ${eligible.length} employees marked Present for today`);
    } catch (err) {
      // Rollback all on failure
      setOverrides(o => {
        const n = { ...o };
        eligible.forEach(row => delete n[`${row.employeeId}_${todayStr}`]);
        return n;
      });
      showToast(err.message, "error");
    } finally {
      setMarkingToday(false);
    }
  };

  // ── Navigation ──
  const prevMonth = () => { setPage(1); if (month === 0) { setYear(y=>y-1); setMonth(11); } else setMonth(m=>m-1); };
  const nextMonth = () => { setPage(1); if (month === 11) { setYear(y=>y+1); setMonth(0); } else setMonth(m=>m+1); };


  // ── Unmarked = null AND not an off day ──
  const unmarkedCount = (row) => {
    let count = 0;
    for (let d = 1; d <= days; d++) {
      const dateStr = fmtDate(year, month, d);
      const s       = getStatus(row.employeeId, dateStr);
      if (!s) count++; // null means not yet marked (off days already have a status)
    }
    return count;
  };


  // Put this ONCE above both functions
const getMergedAttendance = (row) => {
  const merged = { ...row.attendance };
  Object.entries(overrides).forEach(([k, v]) => {
    if (k.startsWith(row.employeeId + "_")) {
      merged[k.replace(row.employeeId + "_", "")] = v;
    }
  });
  return Object.values(merged);
};

// Then both functions become clean:
const getRowSummary = (row) => {
  const s    = { ...row.summary };
  const vals = getMergedAttendance(row);

  s.totalPresentDays = vals.filter(v => v === "PRESENT").length;
  s.totalWFH         = vals.filter(v => v === "WFH").length;
  s.totalLeaveDays   = vals.filter(v => v === "LEAVE_FULL").length
                     + vals.filter(v => v === "LEAVE_FIRST_HALF" || v === "LEAVE_SECOND_HALF").length * 0.5;
  s.totalSickDays    = vals.filter(v => v === "SICK_FULL").length
                     + vals.filter(v => v === "SICK_FIRST_HALF" || v === "SICK_SECOND_HALF").length * 0.5;
  s.totalAbsence     = s.totalLeaveDays + s.totalSickDays;
  return s;
};

const attPct = (row) => {
  const s    = getRowSummary(row);
  const vals = getMergedAttendance(row);
  if (!s.totalWorkingDays) return 0;

  const effectiveDays =
    vals.filter(v => v === "PRESENT").length
  + vals.filter(v => v === "WFH").length
  + vals.filter(v => v === "LEAVE_FIRST_HALF" || v === "SICK_FIRST_HALF" ||
                     v === "LEAVE_SECOND_HALF" || v === "SICK_SECOND_HALF").length * 0.5;

  return Math.round((effectiveDays / s.totalWorkingDays) * 100);
};

  const retry = () => {
    setError(null); setLoading(true);
    fetchSheet(monthStr, page)
      .then(r => { setRows(r.data); setPagination(r.pagination); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  };

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  return (
    <div  className="h-full w-310 mt-4 bg m-auto">
      <style>{`
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes fadeIn  { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
        .att-cell:hover    { filter:brightness(0.93); transform:scale(1.08); }
        .att-cell          { transition:all 0.12s; }
        tr:hover td        { background:#f0f9ff !important; }
      `}</style>

      <Toast message={toast} type={toastType} />

      {/* ── Header ── */}
      <div style={{ background:"#fff", borderBottom:"1px solid #e2e8f0", padding:"0 28px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", height:64 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:36, height:36, background:"linear-gradient(135deg,#3b82f6,#6366f1)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:16 }}>
              <CalendarDays />
            </div>
            <div>
              <div style={{ fontWeight:700, fontSize:16, color:"#0f172a" }}>Attendance Register</div>
              <div style={{ fontSize:11, color:"#64748b" }}>
                {pagination ? `${pagination.totalEmployees} employees · Page ${pagination.page}/${pagination.totalPages}` : "Loading…"}
              </div>
            </div>
          </div>

          <div style={{ display:"flex", background:"#f1f5f9", borderRadius:8, padding:4, gap:2 }}>
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 18px",
                  borderRadius: 6,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                  background: tab === id ? "#fff" : "transparent",
                  color: tab === id ? "#3b82f6" : "#64748b",
                  boxShadow: tab === id ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
                  transition: "all 0.15s"
                }}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>

          <div style={{ display:"flex", gap:8 }}>
            {month === today.getMonth() && year === today.getFullYear() && (
              <button
                onClick={handleMarkAllPresentToday}
                disabled={markingToday || loading}
                title={`Mark all employees Present for today (${fmtDate(today.getFullYear(), today.getMonth(), today.getDate())})`}
                style={{ padding:"8px 14px", border:"none", borderRadius:8, background:markingToday?"#a3e6b8":"#16a34a", cursor:(markingToday||loading)?"not-allowed":"pointer", fontSize:13, color:"#fff", fontWeight:600, display:"flex", alignItems:"center", gap:6, opacity:(markingToday||loading)?0.7:1, transition:"all 0.15s" }}>
                {markingToday
                  ? <><span style={{ width:12, height:12, border:"2px solid #ffffff66", borderTop:"2px solid #fff", borderRadius:"50%", display:"inline-block", animation:"spin 0.7s linear infinite" }} /> Marking…</>
                  : <> Mark All Present Today</>
                }
              </button>
            )}
            <button style={{ padding:"8px 16px", border:"none", borderRadius:8, background:"#3b82f6", cursor:"pointer", fontSize:13, color:"#fff", fontWeight:600 }}>
               Export Excel
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding:"20px 28px" }}>

        {/* ── Controls Bar ── */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16, flexWrap:"wrap", gap:12 }}>
          <div style={{ display:"flex", alignItems:"center", background:"#fff", border:"1px solid #e2e8f0", borderRadius:10, overflow:"hidden" }}>
            <button onClick={prevMonth} style={{ padding:"9px 14px", border:"none", background:"transparent", cursor:"pointer", fontSize:16, borderRight:"1px solid #e2e8f0" }}>‹</button>
            <span style={{ padding:"9px 22px", fontWeight:700, color:"#0f172a", fontSize:15, minWidth:170, textAlign:"center" }}>{MONTHS[month]} {year}</span>
            <button onClick={nextMonth} style={{ padding:"9px 14px", border:"none", background:"transparent", cursor:"pointer", fontSize:16, borderLeft:"1px solid #e2e8f0" }}>›</button>
          </div>

          {/* Legend */}
            <AttendanceSheetLegend />
        </div>

        {/* ── Error Banner ── */}
        {error && (
          <div style={{ background:"#fee2e2", border:"1px solid #fca5a5", borderRadius:10, padding:"12px 16px", marginBottom:16, color:"#dc2626", fontSize:13, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span>⚠ API Error: {error}</span>
            <button onClick={retry} style={{ border:"none", background:"#dc2626", color:"#fff", padding:"4px 12px", borderRadius:6, cursor:"pointer", fontSize:12 }}>Retry</button>
          </div>
        )}

        {/* ──────────── REGISTER VIEW ──────────── */}
        {tab === "register" && (
          <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e2e8f0", overflow:"hidden", boxShadow:"0 2px 12px rgba(0,0,0,0.05)" }}>
            <div style={{ overflowX:"auto" }}>
              <table style={{ borderCollapse:"collapse", width:"100%", fontSize:12 }}>
                <thead>
                  <tr style={{ background:"#f8fafc" }}>
                    {/* Employee Header */}
                    <th style={{ padding:"12px 16px", textAlign:"left", minWidth:220, position:"sticky", left:0, background:"#f8fafc", zIndex:2, borderBottom:"2px solid #e2e8f0", borderRight:"2px solid #e2e8f0" }}>
                      <div style={{ fontWeight:700, color:"#0f172a", fontSize:13 }}>Employee</div>
                      <div style={{ fontWeight:400, color:"#94a3b8", fontSize:11 }}>{loading ? "Loading…" : `${rows.length} shown`}</div>
                    </th>

                    {/* Day headers — grey out if columnOffSet says it's an off day */}
                    {Array.from({ length:days }, (_,i) => i+1).map(day => {
                      const dateStr  = fmtDate(year, month, day);
                      const isOff    = columnOffSet.has(dateStr); // from API data
                      const isToday  = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

                      // Distinguish holiday vs weekly-off for header colour
                      const colStatus = rows.length > 0 ? rows[0].attendance[dateStr] : null;
                      const isHoliday = colStatus === "HOLIDAY";

                      return (
                        <th key={day} style={{
                          padding:"6px 2px", textAlign:"center", minWidth:36,
                          background: isHoliday ? "#faf5ff" : isOff ? "#f8fafc" : "#f8fafc",
                          borderBottom:"2px solid #e2e8f0", borderLeft:"1px solid #f1f5f9"
                        }}>
                          <div style={{ fontSize:10, fontWeight: isToday ? 700 : 500, color: isHoliday ? "#7c3aed" : isOff ? "#94a3b8" : isToday ? "#3b82f6" : "#64748b" }}>
                            {getDayName(year, month, day)}
                          </div>
                          <div style={{ width:24, height:24, borderRadius:"50%", margin:"2px auto 0", display:"flex", alignItems:"center", justifyContent:"center", background: isToday ? "#3b82f6" : "transparent", color: isToday ? "#fff" : isHoliday ? "#7c3aed" : isOff ? "#94a3b8" : "#374151", fontWeight: isToday ? 700 : 600, fontSize:11 }}>
                            {day}
                          </div>
                          {/* Small dot indicator for holiday */}
                          {isHoliday && <div style={{ width:4, height:4, borderRadius:"50%", background:"#7c3aed", margin:"1px auto 0" }} />}
                        </th>
                      );
                    })}

                    <th style={{ padding:"8px 14px", textAlign:"center", minWidth:220, borderBottom:"2px solid #e2e8f0", borderLeft:"2px solid #e2e8f0", background:"#f8fafc", fontWeight:700, color:"#0f172a", fontSize:12 }}>Summary</th>
                  </tr>
                </thead>

                <tbody>
                  {loading
                    ? Array.from({length:6}).map((_,i) => (
                        <tr key={i}>
                          <td style={{ padding:"12px 16px", borderBottom:"1px solid #f1f5f9", borderRight:"2px solid #e2e8f0", position:"sticky", left:0, background:"#fff" }}>
                            <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                              <Skeleton width={32} height={32} radius={16} />
                              <div style={{ flex:1 }}><Skeleton height={12} /><div style={{ height:4 }} /><Skeleton width="60%" height={10} /></div>
                            </div>
                          </td>
                          {Array.from({length:days}).map((_,d) => (
                            <td key={d} style={{ padding:"4px 2px", borderBottom:"1px solid #f1f5f9" }}>
                              <Skeleton width={28} height={26} radius={6} />
                            </td>
                          ))}
                          <td style={{ padding:"10px 14px", borderBottom:"1px solid #f1f5f9" }}><Skeleton height={20} /></td>
                        </tr>
                      ))

                    : rows.map((row, idx) => {
                        const summary = getRowSummary(row);
                        const unc     = unmarkedCount(row);
                        return (
                          <tr key={row.employeeId}>

                            {/* ── Employee Cell ── */}
                            <td style={{ padding:"8px 16px", position:"sticky", left:0, background:idx%2===0?"#fff":"#fafafa", zIndex:1, borderBottom:"1px solid #f1f5f9", borderRight:"2px solid #e2e8f0" }}>
                              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                                <div style={{ width:32, height:32, borderRadius:"50%", background:`hsl(${(row.employeeId * 47) % 360},55%,82%)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:`hsl(${(row.employeeId * 47) % 360},55%,30%)`, flexShrink:0 }}>
                                  {row.name.split(" ").map(n=>n[0]).slice(0,2).join("")}
                                </div>
                                <div>
                                  <div style={{ fontWeight:600, color:"#1e293b", fontSize:13, whiteSpace:"nowrap" }}>{row.name}</div>
                                  <div style={{ fontSize:10, color:"#94a3b8" }}>{row.team}</div>
                                </div>
                              </div>
                              {unc > 0 && (
                                <div style={{ marginTop:4, fontSize:10, color:"#f59e0b", marginLeft:42 }}>⚠ {unc} unmarked</div>
                              )}
                            </td>

                            {/* ── Day Cells ── */}
                            {Array.from({length:days}, (_,i) => i+1).map(day => {
                              const dateStr    = fmtDate(year, month, day);
                              const status     = getStatus(row.employeeId, dateStr);
                              const s          = STATUS_CONFIG[status];
                              const cellKey    = `${row.employeeId}_${dateStr}`;
                              const isSaving   = !!saving[cellKey];
                              const isPopupOpen = activePopup === cellKey;

                              // ── KEY CHANGE: use status from API, not day-of-week ──
                              const offDay = isOffDay(status);

                              return (
                                <td key={day} style={{
                                  padding:"4px 2px", textAlign:"center",
                                  borderBottom:"1px solid #f1f5f9", borderLeft:"1px solid #f1f5f9",
                                  // Tint column background to match off-day type
                                  background: status === "HOLIDAY" ? "#faf5ff" : offDay ? "#f8fafc" : "inherit"
                                }}>
                                  {offDay
                                    // ── Off day cell (WEEKLY_OFF or HOLIDAY) — show badge, no click ──
                                    ? (
                                      <div style={{ width:30, height:26, margin:"0 auto", borderRadius:6, background:s?.bg, border:`1.5px solid ${s?.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700, color:s?.color, cursor:"not-allowed" }}>
                                        {s?.label}
                                      </div>
                                    )
                                    // ── Normal working day cell ──
                                    : (
                                      <div style={{ position:"relative" }}>
                                        <div
                                          className={!isSaving ? "att-cell" : ""}
                                          onClick={() => !isSaving && handleCellClick(row.employeeId, dateStr)}
                                          onContextMenu={e => { e.preventDefault(); if (!isSaving) setActivePopup(isPopupOpen ? null : cellKey); }}
                                          style={{
                                            width:30, height:26, margin:"0 auto", borderRadius:6,
                                            background: status ? s?.bg : "#f8fafc",
                                            border:`1.5px solid ${status ? s?.border : "#e2e8f0"}`,
                                            display:"flex", alignItems:"center", justifyContent:"center",
                                            cursor: (s?.editable === false) ? "not-allowed" : "pointer",
                                            fontSize:10, fontWeight:700,
                                            color: status ? s?.color : "#cbd5e1",
                                            opacity: isSaving ? 0.5 : 1,
                                            position:"relative"
                                          }}
                                          title={s ? `${s.full}${s.editable===false ? " (auto-set)" : ""}` : "Click to mark"}>
                                          {isSaving
                                            ? <span style={{ width:10, height:10, border:"1.5px solid #94a3b8", borderTop:"1.5px solid #3b82f6", borderRadius:"50%", display:"block", animation:"spin 0.7s linear infinite" }} />
                                            : (status ? s?.label : "·")
                                          }
                                          {/* Yellow dot = auto-set by system (leave) */}
                                          {s?.editable === false && status && (
                                            <span style={{ position:"absolute", top:-3, right:-3, width:8, height:8, background:"#f59e0b", borderRadius:"50%", border:"1px solid #fff" }} title="Auto from leave/system" />
                                          )}
                                        </div>

                                        {/* ── Quick Picker Popup (right-click) ── */}
                                        {isPopupOpen && (
                                          <div ref={popupRef} style={{ position:"absolute", top:32, left:"50%", transform:"translateX(-50%)", background:"#1e293b", borderRadius:10, padding:8, display:"flex", flexDirection:"column", gap:4, zIndex:200, boxShadow:"0 8px 28px rgba(0,0,0,0.35)", whiteSpace:"nowrap", minWidth:160, animation:"fadeIn 0.12s ease" }}>
                                            <div style={{ fontSize:9, color:"#94a3b8", padding:"0 4px 4px", borderBottom:"1px solid #334155", marginBottom:2 }}>Mark as:</div>
                                            {EDIT_CYCLE.map(k => {
                                              const v = STATUS_CONFIG[k];
                                              return (
                                                <button key={k}
                                                  onClick={e => { e.stopPropagation(); handleMark(row.employeeId, dateStr, k); }}
                                                  style={{ display:"flex", alignItems:"center", gap:8, padding:"5px 8px", borderRadius:6, border:"none", background:status===k?"#334155":"transparent", cursor:"pointer", color:"#f1f5f9", fontSize:12, textAlign:"left", fontWeight:status===k?700:400 }}>
                                                  <span style={{ width:24, height:20, borderRadius:4, background:v.bg, border:`1px solid ${v.border}`, display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700, color:v.color }}>{v.label}</span>
                                                  {v.full}
                                                  {status === k && <span style={{ marginLeft:"auto", color:"#3b82f6" }}>✓</span>}
                                                </button>
                                              );
                                            })}
                                          </div>
                                        )}
                                      </div>
                                    )
                                  }
                                </td>
                              );
                            })}

                            {/* ── Summary Cell ── */}
                            <td style={{ padding:"6px 14px", borderBottom:"1px solid #f1f5f9", borderLeft:"2px solid #e2e8f0" }}>
                              <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                                {[
                                  ["P",   summary.totalPresentDays, "#16a34a", "#dcfce7"],
                                  ["L",   summary.totalLeaveDays,   "#d97706", "#fef3c7"],
                                  ["WFH", summary.totalWFH,         "#0369a1", "#e0f2fe"],
                                  ["S",   summary.totalSickDays,    "#db2777", "#fce7f3"],
                                ].map(([lbl, val, clr, bg]) =>
                                  val > 0 && (
                                    <span key={lbl} style={{ display:"inline-flex", alignItems:"center", gap:3, background:bg, padding:"2px 7px", borderRadius:12 }}>
                                      <span style={{ fontSize:9, fontWeight:700, color:clr }}>{lbl}</span>
                                      <span style={{ fontSize:11, fontWeight:700, color:clr }}>{val}</span>
                                    </span>
                                  )
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                  }
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div style={{ padding:"10px 16px", background:"#f8fafc", borderTop:"1px solid #e2e8f0", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
              {pagination && pagination.totalPages > 1 && (
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <button disabled={page===1} onClick={()=>setPage(p=>p-1)} style={{ padding:"5px 12px", borderRadius:6, border:"1px solid #e2e8f0", background:"#fff", cursor:page===1?"not-allowed":"pointer", fontSize:12, color:"#374151", opacity:page===1?0.4:1 }}>← Prev</button>
                  <span style={{ fontSize:12, color:"#64748b" }}>Page {pagination.page} / {pagination.totalPages}</span>
                  <button disabled={page===pagination.totalPages} onClick={()=>setPage(p=>p+1)} style={{ padding:"5px 12px", borderRadius:6, border:"1px solid #e2e8f0", background:"#fff", cursor:page===pagination.totalPages?"not-allowed":"pointer", fontSize:12, color:"#374151", opacity:page===pagination.totalPages?0.4:1 }}>Next →</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ──────────── SUMMARY VIEW ──────────── */}
        {tab === "summary" && (
          <div style={{ display:"grid", gap:12 }}>
            <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e2e8f0", overflow:"hidden" }}>
              <div style={{ padding:"14px 20px", borderBottom:"1px solid #f1f5f9" }}>
                <div style={{ fontWeight:700, color:"#0f172a", fontSize:15 }}>Monthly Summary — {MONTHS[month]} {year}</div>
              </div>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                <thead>
                  <tr style={{ background:"#f8fafc" }}>
                    {["Employee","Team","Working Days","Present","Leave","WFH","Sick","Att %"].map(h => (
                      <th key={h} style={{ padding:"10px 16px", textAlign:["Employee","Team"].includes(h)?"left":"center", color:"#64748b", fontWeight:600, fontSize:12, borderBottom:"1px solid #e2e8f0" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? Array.from({length:5}).map((_,i) => (
                        <tr key={i} style={{ borderBottom:"1px solid #f1f5f9" }}>
                          {Array.from({length:9}).map((_,j) => (
                            <td key={j} style={{ padding:"12px 16px" }}><Skeleton height={14} /></td>
                          ))}
                        </tr>
                      ))
                    : rows.map((row, idx) => {
                        const s   = getRowSummary(row);
                        const pct = attPct(row);
                        return (
                          <tr key={row.employeeId} style={{ background:idx%2===0?"#fff":"#fafafa", borderBottom:"1px solid #f1f5f9" }}>
                            <td style={{ padding:"10px 16px" }}>
                              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                                <div style={{ width:28, height:28, borderRadius:"50%", background:`hsl(${(row.employeeId * 47) % 360},55%,82%)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:`hsl(${(row.employeeId * 47) % 360},55%,30%)` }}>
                                  {row.name.split(" ").map(n=>n[0]).slice(0,2).join("")}
                                </div>
                                <span style={{ fontWeight:600, color:"#1e293b" }}>{row.name}</span>
                              </div>
                            </td>
                            <td style={{ padding:"10px 16px" }}><span style={{ background:"#f1f5f9", padding:"2px 8px", borderRadius:12, fontSize:11, color:"#475569", fontWeight:600 }}>{row.team}</span></td>
                            <td style={{ textAlign:"center", padding:"10px 16px", fontWeight:600, color:"#374151" }}>{s.totalWorkingDays}</td>
                            <td style={{ textAlign:"center", padding:"10px 16px" }}><span style={{ color:"#16a34a", fontWeight:700 }}>{s.totalPresentDays}</span></td>
                            <td style={{ textAlign:"center", padding:"10px 16px" }}><span style={{ color:s.totalLeaveDays>0?"#d97706":"#94a3b8", fontWeight:700 }}>{s.totalLeaveDays}</span></td>
                            <td style={{ textAlign:"center", padding:"10px 16px" }}><span style={{ color:s.totalWFH>0?"#0369a1":"#94a3b8", fontWeight:700 }}>{s.totalWFH}</span></td>
                            <td style={{ textAlign:"center", padding:"10px 16px" }}><span style={{ color:s.totalSickDays>0?"#db2777":"#94a3b8", fontWeight:700 }}>{s.totalSickDays}</span></td>
                            <td style={{ padding:"10px 16px" }}>
                              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                                <div style={{ flex:1, height:6, background:"#f1f5f9", borderRadius:3 }}>
                                  <div style={{ height:"100%", width:`${pct}%`, background:pct>=90?"#16a34a":pct>=75?"#f59e0b":"#dc2626", borderRadius:3 }} />
                                </div>
                                <span style={{ fontSize:12, fontWeight:700, color:pct>=90?"#16a34a":pct>=75?"#f59e0b":"#dc2626", minWidth:32 }}>{pct}%</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                  }
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// import { useState } from "react";

// const employees = [
//   { id: 1, name: "Priya Sharma", dept: "HR", avatar: "PS" },
//   { id: 2, name: "Rahul Mehta", dept: "Tech", avatar: "RM" },
//   { id: 3, name: "Anjali Singh", dept: "Finance", avatar: "AS" },
//   { id: 4, name: "Vikram Nair", dept: "Tech", avatar: "VN" },
//   { id: 5, name: "Sneha Patel", dept: "Sales", avatar: "SP" },
//   { id: 6, name: "Arjun Das", dept: "Ops", avatar: "AD" },
//   { id: 7, name: "Meera Iyer", dept: "HR", avatar: "MI" },
//   { id: 8, name: "Rohan Gupta", dept: "Finance", avatar: "RG" },
// ];

// const STATUS = {
//   P: { label: "P", full: "Present", color: "#16a34a", bg: "#dcfce7", border: "#86efac" },
//   A: { label: "A", full: "Absent", color: "#dc2626", bg: "#fee2e2", border: "#fca5a5" },
//   L: { label: "L", full: "Leave", color: "#d97706", bg: "#fef3c7", border: "#fcd34d" },
//   H: { label: "H", full: "Holiday", color: "#7c3aed", bg: "#ede9fe", border: "#c4b5fd" },
//   HD: { label: "HD", full: "Half Day", color: "#0369a1", bg: "#e0f2fe", border: "#7dd3fc" },
//   "": { label: "—", full: "Not Marked", color: "#9ca3af", bg: "#f9fafb", border: "#e5e7eb" },
// };

// const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
// const getDayName = (year, month, day) =>
//   ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"][new Date(year, month, day).getDay()];
// const isWeekend = (year, month, day) => {
//   const d = new Date(year, month, day).getDay();
//   return d === 0 || d === 6;
// };

// const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

// export default function Attendance() {
//   const today = new Date();
//   const [year, setYear] = useState(today.getFullYear());
//   const [month, setMonth] = useState(today.getMonth());
//   const [attendance, setAttendance] = useState({});
//   const [activeCell, setActiveCell] = useState(null);
//   const [filterDept, setFilterDept] = useState("All");
//   const [tab, setTab] = useState("register");
//   const [bulkMode, setBulkMode] = useState(false);
//   const [selectedRows, setSelectedRows] = useState([]);
//   const [toast, setToast] = useState(null);

//   const days = getDaysInMonth(year, month);
//   const key = (empId, day) => `${year}-${month}-${empId}-${day}`;
//   const getStatus = (empId, day) => attendance[key(empId, day)] || "";

//   const setStatus = (empId, day, status) => {
//     setAttendance((prev) => ({ ...prev, [key(empId, day)]: status }));
//     showToast(`Marked ${STATUS[status]?.full} for Day ${day}`);
//   };

//   const showToast = (msg) => {
//     setToast(msg);
//     setTimeout(() => setToast(null), 2000);
//   };

//   const cycleStatus = (empId, day) => {
//     if (isWeekend(year, month, day)) return;
//     const cycle = ["P", "A", "L", "HD", ""];
//     const cur = getStatus(empId, day);
//     const next = cycle[(cycle.indexOf(cur) + 1) % cycle.length];
//     setStatus(empId, day, next);
//   };

//   const markAllPresent = (empId) => {
//     const updates = {};
//     for (let d = 1; d <= days; d++) {
//       if (!isWeekend(year, month, d)) updates[key(empId, d)] = "P";
//     }
//     setAttendance((prev) => ({ ...prev, ...updates }));
//     showToast("All working days marked Present");
//   };

//   const markAllHoliday = (day) => {
//     const updates = {};
//     employees.forEach((e) => { updates[key(e.id, day)] = "H"; });
//     setAttendance((prev) => ({ ...prev, ...updates }));
//     showToast(`Day ${day} marked Holiday for all`);
//   };

//   const depts = ["All", ...new Set(employees.map((e) => e.dept))];
//   const filteredEmps = filterDept === "All" ? employees : employees.filter((e) => e.dept === filterDept);

//   const getSummary = (empId) => {
//     let P = 0, A = 0, L = 0, HD = 0, H = 0;
//     for (let d = 1; d <= days; d++) {
//       const s = getStatus(empId, d);
//       if (s === "P") P++;
//       else if (s === "A") A++;
//       else if (s === "L") L++;
//       else if (s === "HD") HD++;
//       else if (s === "H") H++;
//     }
//     return { P, A, L, HD, H };
//   };

//   const prevMonth = () => {
//     if (month === 0) { setYear(y => y - 1); setMonth(11); }
//     else setMonth(m => m - 1);
//   };
//   const nextMonth = () => {
//     if (month === 11) { setYear(y => y + 1); setMonth(0); }
//     else setMonth(m => m + 1);
//   };

//   return (
//     <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#f0f4f8", minHeight: "100vh", padding: "0" }}>

//       {/* Toast */}
//       {toast && (
//         <div style={{ position: "fixed", top: 20, right: 20, background: "#1e293b", color: "#fff", padding: "10px 18px", borderRadius: 8, fontSize: 13, zIndex: 9999, boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
//           ✓ {toast}
//         </div>
//       )}

//       {/* Header */}
//       <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "0 28px" }}>
//         <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//             <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,#3b82f6,#6366f1)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 16 }}>📋</div>
//             <div>
//               <div style={{ fontWeight: 700, fontSize: 16, color: "#0f172a" }}>Attendance Register</div>
//               <div style={{ fontSize: 11, color: "#64748b" }}>HR Management System</div>
//             </div>
//           </div>

//           {/* Tabs */}
//           <div style={{ display: "flex", background: "#f1f5f9", borderRadius: 8, padding: 4, gap: 2 }}>
//             {[["register", "📅 Register View"], ["summary", "📊 Summary View"]].map(([t, label]) => (
//               <button key={t} onClick={() => setTab(t)} style={{ padding: "6px 16px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, background: tab === t ? "#fff" : "transparent", color: tab === t ? "#3b82f6" : "#64748b", boxShadow: tab === t ? "0 1px 4px rgba(0,0,0,0.1)" : "none", transition: "all 0.15s" }}>
//                 {label}
//               </button>
//             ))}
//           </div>

//           <div style={{ display: "flex", gap: 8 }}>
//             <button onClick={() => showToast("Exported to Excel!")} style={{ padding: "8px 14px", border: "1px solid #e2e8f0", borderRadius: 8, background: "#fff", cursor: "pointer", fontSize: 13, color: "#374151", fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
//               ⬇ Export
//             </button>
//             <button style={{ padding: "8px 14px", border: "none", borderRadius: 8, background: "#3b82f6", cursor: "pointer", fontSize: 13, color: "#fff", fontWeight: 600 }}>
//               + Add Leave
//             </button>
//           </div>
//         </div>
//       </div>

//       <div style={{ padding: "20px 28px" }}>

//         {/* Controls Bar */}
//         <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>

//           {/* Month Navigator */}
//           <div style={{ display: "flex", alignItems: "center", gap: 0, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, overflow: "hidden" }}>
//             <button onClick={prevMonth} style={{ padding: "9px 14px", border: "none", background: "transparent", cursor: "pointer", color: "#374151", fontSize: 16, borderRight: "1px solid #e2e8f0" }}>‹</button>
//             <span style={{ padding: "9px 20px", fontWeight: 700, color: "#0f172a", fontSize: 15, minWidth: 160, textAlign: "center" }}>
//               {MONTHS[month]} {year}
//             </span>
//             <button onClick={nextMonth} style={{ padding: "9px 14px", border: "none", background: "transparent", cursor: "pointer", color: "#374151", fontSize: 16, borderLeft: "1px solid #e2e8f0" }}>›</button>
//           </div>

//           <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
//             {/* Dept Filter */}
//             <div style={{ display: "flex", gap: 4 }}>
//               {depts.map(d => (
//                 <button key={d} onClick={() => setFilterDept(d)} style={{ padding: "6px 12px", borderRadius: 20, border: filterDept === d ? "none" : "1px solid #e2e8f0", background: filterDept === d ? "#3b82f6" : "#fff", color: filterDept === d ? "#fff" : "#374151", cursor: "pointer", fontSize: 12, fontWeight: 600, transition: "all 0.15s" }}>
//                   {d}
//                 </button>
//               ))}
//             </div>

//             {/* Legend */}
//             <div style={{ display: "flex", gap: 6, marginLeft: 8 }}>
//               {Object.entries(STATUS).filter(([k]) => k !== "").map(([k, v]) => (
//                 <div key={k} style={{ display: "flex", alignItems: "center", gap: 4 }}>
//                   <div style={{ width: 20, height: 20, borderRadius: 4, background: v.bg, border: `1px solid ${v.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: v.color }}>
//                     {v.label}
//                   </div>
//                   <span style={{ fontSize: 10, color: "#64748b" }}>{v.full}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* ─── REGISTER VIEW ─── */}
//         {tab === "register" && (
//           <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
//             <div style={{ overflowX: "auto" }}>
//               <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 12 }}>
//                 <thead>
//                   {/* Day Numbers Row */}
//                   <tr style={{ background: "#f8fafc" }}>
//                     <th style={{ padding: "12px 16px", textAlign: "left", minWidth: 200, position: "sticky", left: 0, background: "#f8fafc", zIndex: 2, borderBottom: "2px solid #e2e8f0", borderRight: "2px solid #e2e8f0" }}>
//                       <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 13 }}>Employee</div>
//                       <div style={{ fontWeight: 400, color: "#94a3b8", fontSize: 11 }}>{filteredEmps.length} members</div>
//                     </th>
//                     {Array.from({ length: days }, (_, i) => i + 1).map(day => {
//                       const weekend = isWeekend(year, month, day);
//                       const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
//                       return (
//                         <th key={day} style={{ padding: "6px 2px", textAlign: "center", minWidth: 38, background: weekend ? "#fef9ff" : "#f8fafc", borderBottom: "2px solid #e2e8f0", borderLeft: "1px solid #f1f5f9", cursor: weekend ? "default" : "pointer" }}
//                           onClick={() => !weekend && markAllHoliday(day)}
//                           title={!weekend ? "Click to mark holiday for all" : ""}>
//                           <div style={{ fontSize: 11, color: weekend ? "#c084fc" : isToday ? "#3b82f6" : "#64748b", fontWeight: isToday ? 700 : 500 }}>
//                             {getDayName(year, month, day)}
//                           </div>
//                           <div style={{ width: 26, height: 26, borderRadius: "50%", margin: "2px auto 0", display: "flex", alignItems: "center", justifyContent: "center", background: isToday ? "#3b82f6" : "transparent", color: isToday ? "#fff" : weekend ? "#c084fc" : "#374151", fontWeight: isToday ? 700 : 600, fontSize: 12 }}>
//                             {day}
//                           </div>
//                         </th>
//                       );
//                     })}
//                     <th style={{ padding: "8px 12px", textAlign: "center", minWidth: 200, borderBottom: "2px solid #e2e8f0", borderLeft: "2px solid #e2e8f0", background: "#f8fafc" }}>
//                       <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 12 }}>Summary</div>
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredEmps.map((emp, idx) => {
//                     const summary = getSummary(emp.id);
//                     const unmarked = Array.from({ length: days }, (_, i) => i + 1).filter(d => !isWeekend(year, month, d) && !getStatus(emp.id, d)).length;
//                     return (
//                       <tr key={emp.id} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa", transition: "background 0.1s" }}
//                         onMouseEnter={e => e.currentTarget.style.background = "#f0f9ff"}
//                         onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? "#fff" : "#fafafa"}>

//                         {/* Employee Cell */}
//                         <td style={{ padding: "8px 16px", position: "sticky", left: 0, background: "inherit", zIndex: 1, borderBottom: "1px solid #f1f5f9", borderRight: "2px solid #e2e8f0" }}>
//                           <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                             <div style={{ width: 32, height: 32, borderRadius: "50%", background: `hsl(${emp.id * 47}, 60%, 85%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: `hsl(${emp.id * 47}, 60%, 30%)`, flexShrink: 0 }}>
//                               {emp.avatar}
//                             </div>
//                             <div>
//                               <div style={{ fontWeight: 600, color: "#1e293b", fontSize: 13, whiteSpace: "nowrap" }}>{emp.name}</div>
//                               <div style={{ fontSize: 10, color: "#94a3b8" }}>{emp.dept}</div>
//                             </div>
//                             <button onClick={() => markAllPresent(emp.id)} title="Mark all days Present" style={{ marginLeft: "auto", padding: "3px 8px", border: "1px solid #86efac", borderRadius: 4, background: "#dcfce7", color: "#16a34a", cursor: "pointer", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>
//                               All P
//                             </button>
//                           </div>
//                           {unmarked > 0 && (
//                             <div style={{ marginTop: 4, fontSize: 10, color: "#f59e0b", marginLeft: 42 }}>
//                               ⚠ {unmarked} days unmarked
//                             </div>
//                           )}
//                         </td>

//                         {/* Day Cells */}
//                         {Array.from({ length: days }, (_, i) => i + 1).map(day => {
//                           const weekend = isWeekend(year, month, day);
//                           const status = getStatus(emp.id, day);
//                           const s = STATUS[status] || STATUS[""];
//                           const isActive = activeCell === key(emp.id, day);
//                           return (
//                             <td key={day} style={{ padding: "4px 2px", textAlign: "center", borderBottom: "1px solid #f1f5f9", borderLeft: "1px solid #f1f5f9", background: weekend ? "#fdf4ff" : "inherit" }}>
//                               {weekend ? (
//                                 <div style={{ width: 30, height: 28, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", color: "#d8b4fe", fontSize: 11 }}>—</div>
//                               ) : (
//                                 <div
//                                   onClick={() => cycleStatus(emp.id, day)}
//                                   onContextMenu={(e) => { e.preventDefault(); setActiveCell(isActive ? null : key(emp.id, day)); }}
//                                   style={{ width: 30, height: 28, margin: "0 auto", borderRadius: 6, background: status ? s.bg : "#f8fafc", border: `1.5px solid ${status ? s.border : "#e5e7eb"}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 11, fontWeight: 700, color: status ? s.color : "#cbd5e1", transition: "all 0.1s", position: "relative" }}
//                                   title={`${emp.name} - Day ${day}: Click to cycle status`}>
//                                   {status || "·"}
//                                   {/* Quick picker popup */}
//                                   {isActive && (
//                                     <div style={{ position: "absolute", top: 32, left: "50%", transform: "translateX(-50%)", background: "#1e293b", borderRadius: 8, padding: 6, display: "flex", gap: 4, zIndex: 100, boxShadow: "0 8px 24px rgba(0,0,0,0.3)", whiteSpace: "nowrap" }}>
//                                       {Object.entries(STATUS).filter(([k]) => k !== "").map(([k, v]) => (
//                                         <button key={k} onClick={(e) => { e.stopPropagation(); setStatus(emp.id, day, k); setActiveCell(null); }}
//                                           style={{ width: 28, height: 28, borderRadius: 6, border: `1px solid ${v.border}`, background: v.bg, color: v.color, cursor: "pointer", fontWeight: 700, fontSize: 11 }}>
//                                           {v.label}
//                                         </button>
//                                       ))}
//                                     </div>
//                                   )}
//                                 </div>
//                               )}
//                             </td>
//                           );
//                         })}

//                         {/* Summary Cell */}
//                         <td style={{ padding: "6px 12px", borderBottom: "1px solid #f1f5f9", borderLeft: "2px solid #e2e8f0", minWidth: 200 }}>
//                           <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
//                             {[["P", summary.P, "#16a34a", "#dcfce7"], ["A", summary.A, "#dc2626", "#fee2e2"], ["L", summary.L, "#d97706", "#fef3c7"], ["HD", summary.HD, "#0369a1", "#e0f2fe"]].map(([label, val, color, bg]) => (
//                               val > 0 && (
//                                 <div key={label} style={{ display: "flex", alignItems: "center", gap: 3, background: bg, padding: "2px 7px", borderRadius: 12 }}>
//                                   <span style={{ fontSize: 10, fontWeight: 700, color }}>{label}</span>
//                                   <span style={{ fontSize: 11, fontWeight: 700, color }}>{val}</span>
//                                 </div>
//                               )
//                             ))}
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>

//             {/* Footer tip */}
//             <div style={{ padding: "10px 16px", background: "#f8fafc", borderTop: "1px solid #e2e8f0", display: "flex", gap: 20, alignItems: "center" }}>
//               <span style={{ fontSize: 11, color: "#94a3b8" }}>💡 <strong>Click</strong> a cell to cycle P → A → L → HD → blank</span>
//               <span style={{ fontSize: 11, color: "#94a3b8" }}>🖱 <strong>Right-click</strong> for quick status picker</span>
//               <span style={{ fontSize: 11, color: "#94a3b8" }}>📅 <strong>Click a date header</strong> to mark Holiday for all</span>
//               <span style={{ fontSize: 11, color: "#94a3b8" }}>✅ <strong>"All P"</strong> button marks all working days as Present</span>
//             </div>
//           </div>
//         )}

//         {/* ─── SUMMARY VIEW ─── */}
//         {tab === "summary" && (
//           <div style={{ display: "grid", gap: 12 }}>
//             {/* Top Stats */}
//             <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
//               {[
//                 { label: "Total Employees", value: employees.length, icon: "👥", color: "#3b82f6", bg: "#eff6ff" },
//                 { label: "Avg Attendance", value: "84%", icon: "📈", color: "#16a34a", bg: "#dcfce7" },
//                 { label: "On Leave Today", value: "2", icon: "🏖", color: "#d97706", bg: "#fef3c7" },
//                 { label: "Unmarked Today", value: "3", icon: "⚠️", color: "#dc2626", bg: "#fee2e2" },
//               ].map(s => (
//                 <div key={s.label} style={{ background: "#fff", borderRadius: 12, padding: "16px 20px", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 14 }}>
//                   <div style={{ width: 44, height: 44, borderRadius: 10, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{s.icon}</div>
//                   <div>
//                     <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
//                     <div style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>{s.label}</div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Per-employee summary table */}
//             <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden" }}>
//               <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9" }}>
//                 <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 15 }}>Monthly Summary — {MONTHS[month]} {year}</div>
//               </div>
//               <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
//                 <thead>
//                   <tr style={{ background: "#f8fafc" }}>
//                     {["Employee", "Dept", "Working Days", "Present", "Absent", "Leave", "Half Day", "Attendance %"].map(h => (
//                       <th key={h} style={{ padding: "10px 16px", textAlign: h === "Employee" || h === "Dept" ? "left" : "center", color: "#64748b", fontWeight: 600, fontSize: 12, borderBottom: "1px solid #e2e8f0" }}>{h}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {employees.map((emp, idx) => {
//                     const s = getSummary(emp.id);
//                     const workingDays = Array.from({ length: days }, (_, i) => i + 1).filter(d => !isWeekend(year, month, d)).length;
//                     const pct = workingDays > 0 ? Math.round(((s.P + s.HD * 0.5) / workingDays) * 100) : 0;
//                     return (
//                       <tr key={emp.id} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa", borderBottom: "1px solid #f1f5f9" }}>
//                         <td style={{ padding: "10px 16px" }}>
//                           <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                             <div style={{ width: 28, height: 28, borderRadius: "50%", background: `hsl(${emp.id * 47}, 60%, 85%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: `hsl(${emp.id * 47}, 60%, 30%)` }}>{emp.avatar}</div>
//                             <span style={{ fontWeight: 600, color: "#1e293b" }}>{emp.name}</span>
//                           </div>
//                         </td>
//                         <td style={{ padding: "10px 16px" }}><span style={{ background: "#f1f5f9", padding: "2px 8px", borderRadius: 12, fontSize: 11, color: "#475569", fontWeight: 600 }}>{emp.dept}</span></td>
//                         <td style={{ padding: "10px 16px", textAlign: "center", color: "#374151", fontWeight: 600 }}>{workingDays}</td>
//                         <td style={{ padding: "10px 16px", textAlign: "center" }}><span style={{ color: "#16a34a", fontWeight: 700 }}>{s.P}</span></td>
//                         <td style={{ padding: "10px 16px", textAlign: "center" }}><span style={{ color: s.A > 0 ? "#dc2626" : "#94a3b8", fontWeight: 700 }}>{s.A}</span></td>
//                         <td style={{ padding: "10px 16px", textAlign: "center" }}><span style={{ color: s.L > 0 ? "#d97706" : "#94a3b8", fontWeight: 700 }}>{s.L}</span></td>
//                         <td style={{ padding: "10px 16px", textAlign: "center" }}><span style={{ color: s.HD > 0 ? "#0369a1" : "#94a3b8", fontWeight: 700 }}>{s.HD}</span></td>
//                         <td style={{ padding: "10px 16px", textAlign: "center" }}>
//                           <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//                             <div style={{ flex: 1, height: 6, background: "#f1f5f9", borderRadius: 3 }}>
//                               <div style={{ height: "100%", width: `${pct}%`, background: pct >= 90 ? "#16a34a" : pct >= 75 ? "#f59e0b" : "#dc2626", borderRadius: 3, transition: "width 0.3s" }} />
//                             </div>
//                             <span style={{ fontSize: 12, fontWeight: 700, color: pct >= 90 ? "#16a34a" : pct >= 75 ? "#f59e0b" : "#dc2626", minWidth: 32 }}>{pct}%</span>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
