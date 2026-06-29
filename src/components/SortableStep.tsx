import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import type { RoutineStep, RoutineTime } from '../types';
import { useRoutineStore } from '../store/useRoutineStore';
import { CATEGORY_META } from '../data/products';

interface SortableStepProps {
  step: RoutineStep;
  index: number;
  time: RoutineTime;
  hasConflict: boolean;
}

// A single draggable step in the routine builder.
// dnd-kit gives us the transform/transition values to apply as inline
// styles — the component stays mounted and animates to its new position.
export function SortableStep({ step, index, time, hasConflict }: SortableStepProps) {
  const removeStep = useRoutineStore((s) => s.removeStep);
  const meta = CATEGORY_META[step.product.category];

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: step.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.85 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 8 }}
      transition={{ duration: 0.2 }}
      aria-label={`Step ${index + 1}: ${step.product.title}. Drag to reorder.`}
      className={`flex touch-none select-none items-center gap-2.5 rounded-nykaa border bg-white p-2.5 shadow-card ${
        isDragging ? 'cursor-grabbing shadow-modal ring-1 ring-nykaa-pink/40' : 'cursor-grab'
      } ${hasConflict ? 'border-red-200 bg-red-50' : 'border-line'}`}
    >
      {/* Step number */}
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-nykaa-pink text-[10px] font-bold text-white">
        {index + 1}
      </span>

      {/* Grip affordance — signals the whole row is draggable */}
      <span className="shrink-0 text-ink-muted" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
          <rect x="3" y="3" width="2" height="2" rx="1" />
          <rect x="7" y="3" width="2" height="2" rx="1" />
          <rect x="3" y="7" width="2" height="2" rx="1" />
          <rect x="7" y="7" width="2" height="2" rx="1" />
          <rect x="3" y="11" width="2" height="2" rx="1" />
          <rect x="7" y="11" width="2" height="2" rx="1" />
        </svg>
      </span>

      {/* Product thumbnail */}
      <img
        src={step.product.thumbnail}
        alt={step.product.title}
        className="h-10 w-10 shrink-0 rounded-nykaa border border-line bg-gray-50 object-contain p-1"
        onError={(e) => {
          const img = e.target as HTMLImageElement;
          img.onerror = null;
          img.src =
            'https://cdn.shopify.com/s/files/1/0410/9608/5665/files/Nia_05_10ml_1_1e27f2ef-09d0-4140-bf9e-05d62459489e.jpg?v=1756982138';
        }}
      />

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="text-[9px] font-bold uppercase tracking-wider text-ink-muted">
          {meta?.label}
        </p>
        <p className="truncate text-xs font-semibold text-ink">{step.product.title}</p>
        <p className="text-[10px] text-ink-muted">{step.product.brand}</p>
      </div>

      {/* Conflict indicator */}
      {hasConflict && (
        <span
          title="Ingredient conflict detected"
          className="shrink-0 text-[10px] font-bold uppercase text-red-500"
          aria-label="Conflict detected"
        >
          Conflict
        </span>
      )}

      {/* Remove */}
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={() => removeStep(step.id, time)}
        aria-label={`Remove ${step.product.title} from routine`}
        className="shrink-0 cursor-pointer rounded p-1 text-ink-muted transition-colors hover:bg-red-50 hover:text-red-500"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <line x1="4" y1="4" x2="12" y2="12" />
          <line x1="12" y1="4" x2="4" y2="12" />
        </svg>
      </button>
    </motion.div>
  );
}
