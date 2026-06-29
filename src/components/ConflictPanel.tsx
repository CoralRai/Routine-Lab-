import type { DetectedConflict } from '../types';

const SEVERITY_STYLES = {
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    badge: 'bg-red-100 text-red-700',
    label: 'Conflict',
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    badge: 'bg-amber-100 text-amber-700',
    label: 'Caution',
  },
  tip: {
    bg: 'bg-pink-50',
    border: 'border-pink-200',
    text: 'text-pink-700',
    badge: 'bg-pink-100 text-pink-700',
    label: 'Tip',
  },
};

interface ConflictPanelProps {
  conflicts: DetectedConflict[];
}

export function ConflictPanel({ conflicts }: ConflictPanelProps) {
  return (
    <div className="space-y-2" role="alert" aria-label="Ingredient conflicts detected">
      <p className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
        Ingredient Conflicts
      </p>
      {conflicts.map((d, i) => {
        const style = SEVERITY_STYLES[d.conflict.severity];
        return (
          <div
            key={i}
            className={`rounded-nykaa border p-3 ${style.bg} ${style.border}`}
          >
            <div className="flex items-center gap-2">
              <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${style.badge}`}>
                {style.label}
              </span>
              <p className={`text-[10px] font-semibold ${style.text}`}>
                {d.productA} + {d.productB}
              </p>
            </div>
            <p className={`mt-1.5 text-[11px] ${style.text}`}>
              {d.conflict.message}
            </p>
            <p className="mt-1 text-[11px] text-ink-soft">
              {d.conflict.suggestion}
            </p>
          </div>
        );
      })}
    </div>
  );
}
