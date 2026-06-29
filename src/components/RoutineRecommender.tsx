import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRoutineStore } from '../store/useRoutineStore';
import {
  SKIN_TYPES,
  CONCERNS,
  buildRecommendedRoutine,
  type SkinType,
  type Concern,
} from '../lib/recommend';
import type { RoutineTime } from '../types';

interface RoutineRecommenderProps {
  onApply: (time: RoutineTime) => void;
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-pill border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
        active
          ? 'border-nykaa-pink bg-nykaa-pink text-white'
          : 'border-line bg-white text-ink-soft hover:border-nykaa-pink hover:text-nykaa-pink'
      }`}
    >
      {children}
    </button>
  );
}

export function RoutineRecommender({ onApply }: RoutineRecommenderProps) {
  const setRoutine = useRoutineStore((s) => s.setRoutine);

  const [skin, setSkin] = useState<SkinType | null>(null);
  const [concern, setConcern] = useState<Concern>('none');
  const [result, setResult] = useState<{ am: number; pm: number; note: string } | null>(null);

  const handleBuild = () => {
    if (!skin) return;
    const { am, pm, note } = buildRecommendedRoutine(skin, concern);
    setRoutine(am, 'AM');
    setRoutine(pm, 'PM');
    setResult({ am: am.length, pm: pm.length, note });
    onApply('AM');
  };

  return (
    <div className="rounded-nykaa border border-line bg-white p-4 shadow-card">
      <h2 className="text-sm font-bold text-ink">Not sure where to start?</h2>
      <p className="mt-0.5 text-xs text-ink-soft">
        Tell us about your skin and we'll build a complete AM &amp; PM routine for you.
      </p>

      {/* Skin type */}
      <p className="mb-1.5 mt-3 text-[11px] font-bold uppercase tracking-wider text-ink-muted">
        Your skin type
      </p>
      <div className="flex flex-wrap gap-2">
        {SKIN_TYPES.map((s) => (
          <Chip key={s.id} active={skin === s.id} onClick={() => setSkin(s.id)}>
            {s.label}
          </Chip>
        ))}
      </div>

      {/* Concern */}
      <p className="mb-1.5 mt-3 text-[11px] font-bold uppercase tracking-wider text-ink-muted">
        Main concern
      </p>
      <div className="flex flex-wrap gap-2">
        {CONCERNS.map((c) => (
          <Chip key={c.id} active={concern === c.id} onClick={() => setConcern(c.id)}>
            {c.label}
          </Chip>
        ))}
      </div>

      {/* Build button */}
      <button
        type="button"
        onClick={handleBuild}
        disabled={!skin}
        className={`mt-4 w-full rounded-nykaa py-2.5 text-xs font-bold uppercase tracking-wide transition-colors ${
          skin
            ? 'bg-nykaa-pink text-white hover:bg-nykaa-pink-dark active:scale-98'
            : 'cursor-not-allowed bg-gray-100 text-ink-muted'
        }`}
      >
        {result ? 'Rebuild my routine' : 'Build my routine'}
      </button>

      {/* Result summary */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 overflow-hidden rounded-nykaa border border-nykaa-pink-mid bg-nykaa-pink-light p-3"
          >
            <p className="text-[11px] font-semibold text-nykaa-pink">
              Added {result.am} morning step{result.am === 1 ? '' : 's'} and {result.pm} night
              step{result.pm === 1 ? '' : 's'} to your routine.
            </p>
            {result.note && (
              <p className="mt-1 text-[11px] text-ink-soft">{result.note}</p>
            )}
            <p className="mt-1 text-[11px] text-ink-soft">
              Switch between AM and PM above to review, then drag to fine-tune.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
