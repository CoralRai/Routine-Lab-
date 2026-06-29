import { motion } from 'framer-motion';
import type { Product, RoutineTime } from '../types';
import { useRoutineStore } from '../store/useRoutineStore';

interface ProductCardProps {
  product: Product;
  activeTime: RoutineTime;
  index: number;
}

export function ProductCard({ product, activeTime, index }: ProductCardProps) {
  const addProduct = useRoutineStore((s) => s.addProduct);
  const amSteps = useRoutineStore((s) => s.amSteps);
  const pmSteps = useRoutineStore((s) => s.pmSteps);

  const steps = activeTime === 'AM' ? amSteps : pmSteps;
  const isAdded = steps.some((s) => s.product.id === product.id);
  const notForThisTime = !product.suitableFor.includes(activeTime);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className={`group relative flex flex-col overflow-hidden rounded-nykaa border bg-white transition-shadow duration-200 hover:shadow-card-hover ${
        notForThisTime ? 'opacity-50' : 'border-line shadow-card'
      }`}
    >
      {/* Demo badge */}
      <span className="absolute left-2 top-2 z-10 rounded-[3px] bg-gray-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-gray-500">
        Demo
      </span>

      {/* Product image */}
      <div className="relative h-36 overflow-hidden bg-gray-50">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="h-full w-full object-contain p-3 transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.onerror = null;
            img.src =
              'https://cdn.shopify.com/s/files/1/0410/9608/5665/files/Nia_05_10ml_1_1e27f2ef-09d0-4140-bf9e-05d62459489e.jpg?v=1756982138';
          }}
        />
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">
          {product.brand}
        </p>
        <p className="mt-0.5 line-clamp-2 text-xs font-medium leading-snug text-ink">
          {product.title}
        </p>

        {/* Ingredients */}
        <div className="mt-2 flex flex-wrap gap-1">
          {product.keyIngredients.slice(0, 2).map((ing) => (
            <span
              key={ing}
              className="rounded-[3px] bg-nykaa-pink-light px-1.5 py-0.5 text-[9px] font-medium text-nykaa-pink"
            >
              {ing}
            </span>
          ))}
        </div>

        {/* Price + rating */}
        <div className="mt-auto flex items-center justify-between pt-2.5">
          <span className="text-sm font-bold text-ink">₹{product.price}</span>
          <span className="text-[11px] font-semibold text-ink-soft">
            {product.rating} <span className="text-amber-400">★</span>
          </span>
        </div>

        {/* Add button */}
        <button
          type="button"
          onClick={() => !notForThisTime && addProduct(product, activeTime)}
          disabled={isAdded || notForThisTime}
          aria-label={
            notForThisTime
              ? `${product.title} is not suitable for ${activeTime} routine`
              : isAdded
              ? `${product.title} already in routine`
              : `Add ${product.title} to ${activeTime} routine`
          }
          className={`mt-2.5 w-full rounded-nykaa py-2 text-xs font-bold uppercase tracking-wide transition-colors ${
            isAdded
              ? 'cursor-default border border-nykaa-pink bg-white text-nykaa-pink'
              : notForThisTime
              ? 'cursor-not-allowed bg-gray-100 text-ink-muted'
              : 'bg-nykaa-pink text-white hover:bg-nykaa-pink-dark active:scale-98'
          }`}
        >
          {isAdded ? 'Added' : notForThisTime ? `${activeTime} only` : 'Add to Routine'}
        </button>
      </div>
    </motion.div>
  );
}
