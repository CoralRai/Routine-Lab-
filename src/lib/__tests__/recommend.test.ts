import { buildRecommendedRoutine, SKIN_TYPES, CONCERNS } from '../recommend';
import { detectConflicts } from '../conflicts';
import type { RoutineStep, Product } from '../../types';

const toSteps = (products: Product[]): RoutineStep[] =>
  products.map((product, i) => ({ id: `s-${i}`, order: i, product }));

describe('buildRecommendedRoutine', () => {
  it('never recommends a conflicting AM or PM routine', () => {
    for (const skin of SKIN_TYPES) {
      for (const concern of CONCERNS) {
        const { am, pm } = buildRecommendedRoutine(skin.id, concern.id);
        expect(detectConflicts(toSteps(am))).toHaveLength(0);
        expect(detectConflicts(toSteps(pm))).toHaveLength(0);
      }
    }
  });

  it('always includes a cleanser and sunscreen in the AM routine', () => {
    for (const skin of SKIN_TYPES) {
      const { am } = buildRecommendedRoutine(skin.id, 'none');
      expect(am.some((p) => p.category === 'cleanser')).toBe(true);
      expect(am.some((p) => p.category === 'sunscreen')).toBe(true);
    }
  });

  it('adds Vitamin C for dullness and Retinol for fine lines', () => {
    const dull = buildRecommendedRoutine('normal', 'dullness');
    expect([...dull.am, ...dull.pm].some((p) => p.keyIngredients.includes('vitamin c'))).toBe(true);

    const ageing = buildRecommendedRoutine('normal', 'fine-lines');
    expect(ageing.pm.some((p) => p.keyIngredients.includes('retinol'))).toBe(true);
  });
});
