import type { IngredientConflict, DetectedConflict, RoutineStep } from '../types';

// ── Ingredient conflict database ───────────────────────────────
// This is what makes Routine Lab genuinely useful and technically
// impressive. Pure data, no side effects — fully testable.
// Each entry is a known interaction between two skincare ingredients.
export const CONFLICTS: IngredientConflict[] = [
  {
    ingredients: ['vitamin c', 'niacinamide'],
    severity: 'warning',
    message: 'Vitamin C and Niacinamide can reduce each other\'s effectiveness when layered.',
    suggestion: 'Use Vitamin C in your AM routine and Niacinamide in PM, or wait 30 minutes between them.',
  },
  {
    ingredients: ['retinol', 'vitamin c'],
    severity: 'error',
    message: 'Retinol and Vitamin C together can cause irritation and skin sensitivity.',
    suggestion: 'Use Vitamin C in AM and Retinol in PM. Never layer them.',
  },
  {
    ingredients: ['retinol', 'aha'],
    severity: 'error',
    message: 'Retinol and AHAs (glycolic/lactic acid) over-exfoliate and cause serious irritation.',
    suggestion: 'Alternate nights — Retinol one night, AHA the next.',
  },
  {
    ingredients: ['retinol', 'bha'],
    severity: 'error',
    message: 'Retinol and BHA (salicylic acid) together cause over-exfoliation and barrier damage.',
    suggestion: 'Alternate nights — Retinol one night, BHA the next.',
  },
  {
    ingredients: ['aha', 'bha'],
    severity: 'warning',
    message: 'Layering AHA and BHA together can over-exfoliate, especially for sensitive skin.',
    suggestion: 'Use one at a time, or look for a product that combines both at lower concentrations.',
  },
  {
    ingredients: ['vitamin c', 'benzoyl peroxide'],
    severity: 'error',
    message: 'Benzoyl peroxide oxidises and deactivates Vitamin C, making it useless.',
    suggestion: 'Use Vitamin C in AM and Benzoyl Peroxide in PM.',
  },
  {
    ingredients: ['retinol', 'benzoyl peroxide'],
    severity: 'error',
    message: 'Benzoyl peroxide deactivates retinol through oxidation.',
    suggestion: 'Use them on alternate nights, or in different routines (AM/PM).',
  },
  {
    ingredients: ['copper peptides', 'vitamin c'],
    severity: 'warning',
    message: 'Copper peptides and Vitamin C can interfere with each other\'s stability.',
    suggestion: 'Separate by AM (Vitamin C) and PM (Copper Peptides).',
  },
  {
    ingredients: ['copper peptides', 'retinol'],
    severity: 'tip',
    message: 'Copper peptides and Retinol have opposing mechanisms — one repairs, one turns over.',
    suggestion: 'They can be used together, but alternate nights for maximum benefit.',
  },
];

// Normalise an ingredient string for comparison.
function normalise(s: string): string {
  return s.toLowerCase().trim();
}

// Check if two ingredient lists contain a known conflict pair.
// Returns all detected conflicts with the product names attached.
export function detectConflicts(steps: RoutineStep[]): DetectedConflict[] {
  const detected: DetectedConflict[] = [];

  for (let i = 0; i < steps.length; i++) {
    for (let j = i + 1; j < steps.length; j++) {
      const a = steps[i].product;
      const b = steps[j].product;

      const ingredientsA = a.keyIngredients.map(normalise);
      const ingredientsB = b.keyIngredients.map(normalise);

      for (const conflict of CONFLICTS) {
        const [x, y] = conflict.ingredients.map(normalise);
        const aHasX = ingredientsA.includes(x);
        const aHasY = ingredientsA.includes(y);
        const bHasX = ingredientsB.includes(x);
        const bHasY = ingredientsB.includes(y);

        // Conflict fires if product A has one ingredient and product B has the other.
        if ((aHasX && bHasY) || (aHasY && bHasX)) {
          // Avoid duplicate conflicts.
          const alreadyDetected = detected.some(
            (d) =>
              d.conflict === conflict &&
              d.productA === a.title &&
              d.productB === b.title
          );
          if (!alreadyDetected) {
            detected.push({ conflict, productA: a.title, productB: b.title });
          }
        }
      }
    }
  }

  // Sort by severity: errors first, then warnings, then tips.
  const order: Record<string, number> = { error: 0, warning: 1, tip: 2 };
  return detected.sort((a, b) => order[a.conflict.severity] - order[b.conflict.severity]);
}

// Canonical step order for each time slot.
// Products are sorted to this order when added to the routine.
export const STEP_ORDER: Record<string, number> = {
  cleanser: 1,
  toner: 2,
  serum: 3,
  'eye-cream': 4,
  moisturiser: 5,
  'face-oil': 6,
  sunscreen: 7,   // always last in AM
  mask: 7,        // PM equivalent of sunscreen slot
};

export function canonicalOrder(category: string): number {
  return STEP_ORDER[category] ?? 5;
}
