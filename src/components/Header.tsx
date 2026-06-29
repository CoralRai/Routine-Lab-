import type { RoutineTime } from '../types';

interface HeaderProps {
  activeTime: RoutineTime;
  onToggleTime: (time: RoutineTime) => void;
}

export function Header({ activeTime, onToggleTime }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white">
      <div className="mx-auto max-w-6xl px-4">
        {/* Top bar */}
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold italic tracking-tight text-nykaa-pink">
              Nykaa
            </span>
            <div className="hidden h-5 w-px bg-line sm:block" aria-hidden="true" />
            <span className="hidden text-sm font-semibold text-ink sm:block">
              Routine Lab
            </span>
          </div>

          {/* AM / PM toggle */}
          <div
            className="flex rounded-nykaa border border-line bg-gray-50 p-0.5"
            role="group"
            aria-label="Switch between morning and night routine"
          >
            {(['AM', 'PM'] as RoutineTime[]).map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => onToggleTime(time)}
                aria-pressed={activeTime === time}
                className={`rounded-[4px] px-5 py-1.5 text-xs font-bold transition-colors ${
                  activeTime === time
                    ? 'bg-nykaa-pink text-white'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* Sub-nav hint */}
        <div className="flex items-center gap-3 overflow-x-auto border-t border-line py-2 text-xs text-ink-muted">
          <span className="whitespace-nowrap font-semibold text-nykaa-pink">
            Build your {activeTime === 'AM' ? 'morning' : 'night'} routine
          </span>
          <span className="whitespace-nowrap">Add products · Reorder steps · Check conflicts</span>
        </div>
      </div>
    </header>
  );
}
