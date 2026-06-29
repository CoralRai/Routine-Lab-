import { create } from 'zustand';
import type { RoutineStep, RoutineTime, Product } from '../types';
import { canonicalOrder } from '../lib/conflicts';

interface RoutineState {
  amSteps: RoutineStep[];
  pmSteps: RoutineStep[];
  addProduct: (product: Product, time: RoutineTime) => void;
  removeStep: (id: string, time: RoutineTime) => void;
  reorderSteps: (steps: RoutineStep[], time: RoutineTime) => void;
  setRoutine: (products: Product[], time: RoutineTime) => void;
  clearRoutine: (time: RoutineTime) => void;
}

function makeId(): string {
  return `step-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// In-memory only — no persistence, so every page load starts with an
// empty AM and PM routine (a fresh session each refresh).
export const useRoutineStore = create<RoutineState>()(
    (set, get) => ({
      amSteps: [],
      pmSteps: [],

      addProduct: (product, time) => {
        const key = time === 'AM' ? 'amSteps' : 'pmSteps';
        const existing = get()[key];

        // Don't add the same product twice
        if (existing.some((s) => s.product.id === product.id)) return;

        const newStep: RoutineStep = {
          id: makeId(),
          product,
          order: canonicalOrder(product.category),
        };

        // Insert in canonical order
        const updated = [...existing, newStep].sort((a, b) => a.order - b.order);
        set({ [key]: updated });
      },

      removeStep: (id, time) => {
        const key = time === 'AM' ? 'amSteps' : 'pmSteps';
        set({ [key]: get()[key].filter((s) => s.id !== id) });
      },

      reorderSteps: (steps, time) => {
        const key = time === 'AM' ? 'amSteps' : 'pmSteps';
        set({ [key]: steps });
      },

      // Replace a whole slot — used by the skin-type recommender.
      setRoutine: (products, time) => {
        const key = time === 'AM' ? 'amSteps' : 'pmSteps';
        const steps: RoutineStep[] = products
          .map((product) => ({
            id: makeId(),
            product,
            order: canonicalOrder(product.category),
          }))
          .sort((a, b) => a.order - b.order);
        set({ [key]: steps });
      },

      clearRoutine: (time) => {
        const key = time === 'AM' ? 'amSteps' : 'pmSteps';
        set({ [key]: [] });
      },
    })
);
