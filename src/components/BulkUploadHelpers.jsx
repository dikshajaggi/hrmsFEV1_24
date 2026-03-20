export function StepIndicator({ phase }) {
  const steps = ["upload", "process", "preview", "done"];
  const labels = { upload: "Upload", process: "Processing", preview: "Preview", done: "Done" };
  const cur = steps.indexOf(phase === "preview" ? "preview" : phase);

  return (
    <div className="flex items-center gap-1 mb-8">
      {steps.map((s, i) => {
        const done = i < cur;
        const active = i === cur;
        return (
          <div key={s} className="flex items-center gap-1">
            <div
              className={`flex items-center gap-1.5 text-xs font-medium transition-colors
                ${done ? "text-emerald-600" : active ? "text-blue-600" : "text-slate-400"}`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] border-[1.5px] flex-shrink-0
                  ${done ? "border-emerald-500 text-emerald-600" : active ? "border-blue-500 text-blue-600" : "border-slate-300 text-slate-400"}`}
              >
                {done ? "✓" : i + 1}
              </span>
              {labels[s]}
            </div>
            {i < steps.length - 1 && (
              <div className="w-6 h-px bg-slate-200 mx-1" />
            )}
          </div>
        );
      })}
    </div>
  );
}