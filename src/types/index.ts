// ── Domain types for Routine Lab ──────────────────────────────

// The two routine slots — morning and night.
export type RoutineTime = 'AM' | 'PM';

// Skincare step categories in application order.
// The order here IS the canonical order — components read it to sort.
export type StepCategory =
  | 'cleanser'
  | 'toner'
  | 'serum'
  | 'moisturiser'
  | 'eye-cream'
  | 'sunscreen'   // AM only
  | 'face-oil'
  | 'mask';       // PM only

// A product fetched from DummyJSON, augmented with our skincare metadata.
export interface Product {
  id: number;
  title: string;
  brand: string;
  description: string;
  price: number;
  rating: number;
  thumbnail: string;
  // Our additions — not from DummyJSON
  category: StepCategory;
  keyIngredients: string[]; // e.g. ['niacinamide', 'zinc']
  suitableFor: RoutineTime[]; // which routine(s) it belongs in
  isDemo: true;
}

// A step in the user's built routine.
export interface RoutineStep {
  id: string;       // unique per slot, e.g. 'step-42'
  product: Product;
  order: number;    // display order, 1-indexed
}

// Severity of an ingredient conflict.
export type ConflictSeverity = 'error' | 'warning' | 'tip';

// A conflict between two ingredients.
export interface IngredientConflict {
  ingredients: [string, string]; // the two conflicting ingredients
  severity: ConflictSeverity;
  message: string;               // plain-English explanation
  suggestion: string;            // what to do about it
}

// A detected conflict in the user's current routine.
export interface DetectedConflict {
  conflict: IngredientConflict;
  productA: string; // product title
  productB: string;
}
