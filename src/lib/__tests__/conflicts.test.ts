import { detectConflicts } from '../conflicts';
import type { RoutineStep, Product } from '../../types';

function makeStep(id: number, title: string, ingredients: string[]): RoutineStep {
  return {
    id: `step-${id}`,
    order: id,
    product: {
      id,
      title,
      brand: 'Test',
      description: '',
      price: 100,
      rating: 4.0,
      thumbnail: '',
      category: 'serum',
      keyIngredients: ingredients,
      suitableFor: ['AM', 'PM'],
      isDemo: true,
    } as Product,
  };
}

describe('detectConflicts', () => {
  it('returns empty for no steps', () => {
    expect(detectConflicts([])).toHaveLength(0);
  });

  it('returns empty for a single step', () => {
    expect(detectConflicts([makeStep(1, 'Serum A', ['vitamin c'])])).toHaveLength(0);
  });

  it('detects Vitamin C + Niacinamide conflict', () => {
    const steps = [
      makeStep(1, 'Vitamin C Serum', ['vitamin c']),
      makeStep(2, 'Niacinamide Serum', ['niacinamide']),
    ];
    const conflicts = detectConflicts(steps);
    expect(conflicts).toHaveLength(1);
    expect(conflicts[0].conflict.severity).toBe('warning');
  });

  it('detects Retinol + Vitamin C as an error', () => {
    const steps = [
      makeStep(1, 'Retinol Serum', ['retinol']),
      makeStep(2, 'Vitamin C Serum', ['vitamin c']),
    ];
    const conflicts = detectConflicts(steps);
    expect(conflicts.some((c) => c.conflict.severity === 'error')).toBe(true);
  });

  it('detects Retinol + AHA conflict', () => {
    const steps = [
      makeStep(1, 'Retinol', ['retinol']),
      makeStep(2, 'AHA Exfoliant', ['aha', 'glycolic acid']),
    ];
    const conflicts = detectConflicts(steps);
    expect(conflicts).toHaveLength(1);
    expect(conflicts[0].conflict.severity).toBe('error');
  });

  it('sorts errors before warnings before tips', () => {
    const steps = [
      makeStep(1, 'Vitamin C', ['vitamin c']),
      makeStep(2, 'Retinol', ['retinol']),
      makeStep(3, 'Niacinamide', ['niacinamide']),
    ];
    const conflicts = detectConflicts(steps);
    const severities = conflicts.map((c) => c.conflict.severity);
    const errorIdx = severities.indexOf('error');
    const warningIdx = severities.indexOf('warning');
    if (errorIdx !== -1 && warningIdx !== -1) {
      expect(errorIdx).toBeLessThan(warningIdx);
    }
  });

  it('does not duplicate conflicts for same pair', () => {
    const steps = [
      makeStep(1, 'AHA Serum', ['aha']),
      makeStep(2, 'BHA Toner', ['bha']),
    ];
    const conflicts = detectConflicts(steps);
    expect(conflicts).toHaveLength(1);
  });

  it('no conflict for safe combination', () => {
    const steps = [
      makeStep(1, 'Hyaluronic Serum', ['hyaluronic acid']),
      makeStep(2, 'Ceramide Cream', ['ceramides']),
    ];
    expect(detectConflicts(steps)).toHaveLength(0);
  });
});
