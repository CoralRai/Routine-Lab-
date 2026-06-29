import { PRODUCTS } from '../data/products';
import { detectConflicts } from './conflicts';
import type { Product } from '../types';

// ── Skin-type / concern driven routine recommender ─────────────
// Pure logic: given a skin type and a main concern, it assembles a
// sensible AM and PM routine from the catalogue, then runs the same
// conflict engine the UI uses to guarantee it never recommends a
// conflicting combination.

export type SkinType = 'oily' | 'dry' | 'combination' | 'sensitive' | 'normal';
export type Concern = 'none' | 'acne' | 'dullness' | 'fine-lines' | 'sensitivity';

export const SKIN_TYPES: { id: SkinType; label: string }[] = [
  { id: 'oily', label: 'Oily' },
  { id: 'dry', label: 'Dry' },
  { id: 'combination', label: 'Combination' },
  { id: 'sensitive', label: 'Sensitive' },
  { id: 'normal', label: 'Normal' },
];

export const CONCERNS: { id: Concern; label: string }[] = [
  { id: 'none', label: 'Just the basics' },
  { id: 'acne', label: 'Acne & breakouts' },
  { id: 'dullness', label: 'Dullness & dark spots' },
  { id: 'fine-lines', label: 'Fine lines & ageing' },
  { id: 'sensitivity', label: 'Redness & barrier' },
];

// Base routine per skin type (product ids). PM cleansers are kept gentle
// so layering a treatment never clashes with an exfoliating cleanser.
const BASE: Record<SkinType, { am: number[]; pm: number[]; note: string }> = {
  oily: {
    am: [3, 11, 16],
    pm: [1, 11],
    note: 'Oil-control with a salicylic cleanser by day and a lightweight gel moisturiser.',
  },
  dry: {
    am: [2, 4, 11, 14],
    pm: [2, 4, 12, 17],
    note: 'Layered hydration — a milky toner, ceramide moisturiser and a nourishing night oil.',
  },
  combination: {
    am: [1, 4, 11, 14],
    pm: [1, 4, 12],
    note: 'Gentle cleansing with balanced hydration where you need it.',
  },
  sensitive: {
    am: [1, 4, 12, 14],
    pm: [1, 4, 12],
    note: 'Soothing, barrier-first care with minimal actives.',
  },
  normal: {
    am: [1, 11, 14],
    pm: [1, 4, 12],
    note: 'A simple, well-rounded daily routine.',
  },
};

// Treatment add-ons per concern.
const TREATMENT: Record<Concern, { am: number[]; pm: number[]; note: string }> = {
  none: { am: [], pm: [], note: '' },
  acne: {
    am: [5],
    pm: [20, 5],
    note: 'Salicylic acid (BHA) and niacinamide to clear and calm breakouts.',
  },
  dullness: {
    am: [6],
    pm: [10],
    note: 'Vitamin C by day for glow, tranexamic acid at night to fade dark spots.',
  },
  'fine-lines': {
    am: [],
    pm: [7, 19],
    note: 'Retinol and an eye cream at night for renewal.',
  },
  sensitivity: {
    am: [],
    pm: [],
    note: 'Actives kept minimal to protect a reactive barrier.',
  },
};

const byId = (id: number): Product | undefined => PRODUCTS.find((p) => p.id === id);

// Essentials are never dropped when resolving a conflict.
const isEssential = (p: Product) =>
  p.category === 'cleanser' || p.category === 'moisturiser' || p.category === 'sunscreen';

// Greedily remove products until a slot has no conflicts. Prefers to drop
// non-essential treatments over cleansers / moisturisers / sunscreen.
function deConflict(products: Product[]): Product[] {
  let list = [...products];
  // Bounded loop — at most one removal per product.
  for (let guard = 0; guard < products.length; guard++) {
    const steps = list.map((p, i) => ({ id: String(i), order: i, product: p }));
    const conflicts = detectConflicts(steps);
    if (conflicts.length === 0) break;

    const c = conflicts[0];
    const a = list.find((p) => p.title === c.productA)!;
    const b = list.find((p) => p.title === c.productB)!;
    // Drop the non-essential one; if both/neither essential, drop the later.
    const victim = isEssential(a) && !isEssential(b) ? b : !isEssential(a) && isEssential(b) ? a : b;
    list = list.filter((p) => p !== victim);
  }
  return list;
}

export interface Recommendation {
  am: Product[];
  pm: Product[];
  note: string;
}

export function buildRecommendedRoutine(skin: SkinType, concern: Concern): Recommendation {
  const uniqueIds = (ids: number[]) => Array.from(new Set(ids));

  const amProducts = deConflict(
    uniqueIds([...BASE[skin].am, ...TREATMENT[concern].am])
      .map(byId)
      .filter((p): p is Product => Boolean(p))
  );
  const pmProducts = deConflict(
    uniqueIds([...BASE[skin].pm, ...TREATMENT[concern].pm])
      .map(byId)
      .filter((p): p is Product => Boolean(p))
  );

  const note = [BASE[skin].note, TREATMENT[concern].note].filter(Boolean).join(' ');
  return { am: amProducts, pm: pmProducts, note };
}
