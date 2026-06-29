import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PRODUCTS, CATEGORY_META } from '../data/products';
import { ProductCard } from './ProductCard';
import type { RoutineTime, StepCategory } from '../types';

interface ProductCatalogueProps {
  activeTime: RoutineTime;
}

const CATEGORIES = Object.keys(CATEGORY_META) as StepCategory[];

function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-nykaa border border-line bg-white">
      <div className="h-36 bg-gray-100" />
      <div className="space-y-2 p-3">
        <div className="h-2 w-16 rounded bg-gray-100" />
        <div className="h-3 w-full rounded bg-gray-100" />
        <div className="h-3 w-3/4 rounded bg-gray-100" />
        <div className="mt-3 h-7 rounded-nykaa bg-gray-100" />
      </div>
    </div>
  );
}

export function ProductCatalogue({ activeTime }: ProductCatalogueProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<StepCategory | 'all'>('all');
  const [loading] = useState(false); // would be true during API fetch

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchesSearch =
        search === '' ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase()) ||
        p.keyIngredients.some((i) => i.toLowerCase().includes(search.toLowerCase()));

      const matchesCategory =
        activeCategory === 'all' || p.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  return (
    <div className="flex flex-col gap-4">
      {/* Search */}
      <div className="relative">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by product, brand or ingredient"
          className="w-full rounded-nykaa border border-line bg-white py-2.5 px-3.5 text-sm text-ink placeholder:text-ink-muted focus:border-nykaa-pink focus:outline-none"
          aria-label="Search products"
        />
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        <button
          type="button"
          onClick={() => setActiveCategory('all')}
          className={`rounded-pill border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
            activeCategory === 'all'
              ? 'border-nykaa-pink bg-nykaa-pink text-white'
              : 'border-line bg-white text-ink-soft hover:border-nykaa-pink hover:text-nykaa-pink'
          }`}
          aria-pressed={activeCategory === 'all'}
        >
          All
        </button>
        {CATEGORIES.map((cat) => {
          const meta = CATEGORY_META[cat];
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`rounded-pill border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                activeCategory === cat
                  ? 'border-nykaa-pink bg-nykaa-pink text-white'
                  : 'border-line bg-white text-ink-soft hover:border-nykaa-pink hover:text-nykaa-pink'
              }`}
              aria-pressed={activeCategory === cat}
            >
              {meta.label}
            </button>
          );
        })}
      </div>

      {/* Result count */}
      <p className="text-[11px] text-ink-muted">
        {filtered.length} product{filtered.length !== 1 ? 's' : ''}
        {search && ` for "${search}"`}
      </p>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-sm font-semibold text-ink-soft">No products found</p>
          <p className="mt-1 text-xs text-ink-muted">Try a different search or category</p>
          <button
            type="button"
            onClick={() => { setSearch(''); setActiveCategory('all'); }}
            className="mt-3 text-xs font-semibold text-nykaa-pink hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-2 gap-3 sm:grid-cols-3"
        >
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} activeTime={activeTime} index={i} />
          ))}
        </motion.div>
      )}
    </div>
  );
}
