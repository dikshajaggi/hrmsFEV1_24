import { STATUS_CONFIG } from "../data/attendanceSheet";

export const AttendanceSheetLegend = () => {
    return (
        <>
        <div
            style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                padding: "10px 12px",
                background: "#f8fafc",
                borderRadius: 10,
                border: "1px solid #e2e8f0"
            }}
            >
            {["PRESENT","WFH", "COMP_OFF", "SICK_FULL", "SICK_FIRST_HALF", "SICK_SECOND_HALF",  "LEAVE_FULL", "LEAVE_FIRST_HALF", "LEAVE_SECOND_HALF", "HOLIDAY","WEEKLY_OFF"].map(k => {
                const v = STATUS_CONFIG[k];
                return (
                <div
                    key={k}
                    style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "4px 8px",
                    borderRadius: 8,
                    background: "#ffffff",
                    border: "1px solid #e2e8f0"
                    }}
                >
                    <div
                    style={{
                        minWidth: 24,
                        height: 20,
                        borderRadius: 5,
                        background: v.bg,
                        border: `1px solid ${v.border}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                        fontWeight: 700,
                        color: v.color
                    }}
                    >
                    {v.label}
                    </div>

                    <span
                    style={{
                        fontSize: 11,
                        fontWeight: 500,
                        color: "#475569",
                        whiteSpace: "nowrap"
                    }}
                    >
                    {v.full}
                    </span>
                </div>
                );
            })}
        </div>
        </>
    )
}