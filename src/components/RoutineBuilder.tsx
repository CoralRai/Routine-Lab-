import { AnimatePresence, motion } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { useRoutineStore } from '../store/useRoutineStore';
import { SortableStep } from './SortableStep';
import { ConflictPanel } from './ConflictPanel';
import { detectConflicts, canonicalOrder } from '../lib/conflicts';
import type { RoutineTime } from '../types';

interface RoutineBuilderProps {
  time: RoutineTime;
}

// The main routine panel — drag to reorder, conflict detection live.
export function RoutineBuilder({ time }: RoutineBuilderProps) {
  const amSteps = useRoutineStore((s) => s.amSteps);
  const pmSteps = useRoutineStore((s) => s.pmSteps);
  const reorderSteps = useRoutineStore((s) => s.reorderSteps);
  const clearRoutine = useRoutineStore((s) => s.clearRoutine);

  const steps = time === 'AM' ? amSteps : pmSteps;
  const conflicts = detectConflicts(steps);

  // Products involved in any conflict
  const conflictedProducts = new Set(
    conflicts.flatMap((c) => [c.productA, c.productB])
  );

  const sensors = useSensors(
    // Small activation distance so a click/tap on a step (e.g. the
    // remove button) isn't mistaken for the start of a drag.
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = steps.findIndex((s) => s.id === active.id);
    const newIndex = steps.findIndex((s) => s.id === over.id);
    reorderSteps(arrayMove(steps, oldIndex, newIndex), time);
  };

  // Recommended application order (cleanser → toner → serum → … → SPF).
  const orderOf = (s: (typeof steps)[number]) => canonicalOrder(s.product.category);
  const isInRecommendedOrder = steps.every(
    (s, i) => i === 0 || orderOf(steps[i - 1]) <= orderOf(s)
  );
  const sortToRecommended = () => {
    const sorted = [...steps]
      .map((s, i) => [s, i] as const)
      .sort((a, b) => orderOf(a[0]) - orderOf(b[0]) || a[1] - b[1])
      .map(([s]) => s);
    reorderSteps(sorted, time);
  };

  const totalPrice = steps.reduce((sum, s) => sum + s.product.price, 0);

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-ink">
            {time === 'AM' ? 'Morning' : 'Night'} Routine
          </h2>
          <p className="text-[11px] text-ink-muted">
            {steps.length === 0
              ? 'Add products from the catalogue'
              : `${steps.length} step${steps.length > 1 ? 's' : ''} · drag to reorder`}
          </p>
        </div>
        {steps.length > 0 && (
          <button
            type="button"
            onClick={() => clearRoutine(time)}
            className="text-[11px] font-medium text-ink-muted underline-offset-2 hover:text-nykaa-pink hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Empty state */}
      {steps.length === 0 && (
        <div className="rounded-nykaa border border-dashed border-line bg-gray-50 py-10 text-center">
          <p className="text-sm font-semibold text-ink">Your routine is empty</p>
          <p className="mt-1 px-6 text-xs text-ink-soft">
            Add products from the catalogue, then <span className="font-semibold text-nykaa-pink">drag to reorder</span> them into the right order.
          </p>
        </div>
      )}

      {/* Recommended-order nudge */}
      <AnimatePresence>
        {steps.length >= 2 && !isInRecommendedOrder && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            onClick={sortToRecommended}
            className="flex w-full items-center justify-between rounded-nykaa border border-nykaa-pink-mid bg-nykaa-pink-light px-3 py-2 text-left transition-colors hover:bg-nykaa-pink-mid/40"
          >
            <span className="text-[11px] font-semibold text-nykaa-pink">
              Steps are out of the recommended order
            </span>
            <span className="rounded-pill bg-nykaa-pink px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              Auto-arrange
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Sortable steps */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={steps.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          <AnimatePresence>
            {steps.map((step, i) => (
              <SortableStep
                key={step.id}
                step={step}
                index={i}
                time={time}
                hasConflict={conflictedProducts.has(step.product.title)}
              />
            ))}
          </AnimatePresence>
        </SortableContext>
      </DndContext>

      {/* Conflict panel */}
      <AnimatePresence>
        {conflicts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3 }}
          >
            <ConflictPanel conflicts={conflicts} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* All clear */}
      <AnimatePresence>
        {steps.length > 0 && conflicts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 rounded-nykaa border border-green-200 bg-green-50 px-3 py-2"
          >
            <p className="text-xs font-medium text-green-700">
              No ingredient conflicts — your routine looks good.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary footer */}
      {steps.length > 0 && (
        <div className="mt-1 flex items-center justify-between border-t border-line pt-3">
          <span className="text-[11px] text-ink-soft">
            {steps.length} step{steps.length > 1 ? 's' : ''} · {conflicts.length} conflict
            {conflicts.length === 1 ? '' : 's'}
          </span>
          <span className="text-xs text-ink-soft">
            Routine total{' '}
            <span className="text-sm font-bold text-ink">
              ₹{totalPrice.toLocaleString('en-IN')}
            </span>
          </span>
        </div>
      )}
    </div>
  );
}
