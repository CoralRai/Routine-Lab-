import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from './components/Header';
import { ProductCatalogue } from './components/ProductCatalogue';
import { RoutineBuilder } from './components/RoutineBuilder';
import { RoutineRecommender } from './components/RoutineRecommender';
import type { RoutineTime } from './types';

export default function App() {
  const [activeTime, setActiveTime] = useState<RoutineTime>('AM');

  return (
    <>
      <Helmet>
        <title>Routine Lab — Build your skincare routine | Nykaa</title>
        <meta
          name="description"
          content="Build your personalised AM and PM skincare routine. Detect ingredient conflicts and find the right application order for your products."
        />
        <meta property="og:title" content="Routine Lab by Nykaa" />
        <meta
          property="og:description"
          content="Personalised skincare routine builder with ingredient conflict detection."
        />
      </Helmet>

      <div className="min-h-screen">
        <Header activeTime={activeTime} onToggleTime={setActiveTime} />

        <main className="mx-auto max-w-6xl px-4 py-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">

            {/* Left — product catalogue */}
            <section aria-label="Product catalogue">
              <div className="mb-4">
                <RoutineRecommender onApply={setActiveTime} />
              </div>

              <div className="mb-4">
                <h1 className="text-lg font-bold text-ink">
                  Build your {activeTime === 'AM' ? 'morning' : 'night'} routine
                </h1>
                <p className="mt-0.5 text-xs text-ink-soft">
                  Add products to your routine. Faded products aren't recommended for this time slot.
                </p>
              </div>
              <ProductCatalogue activeTime={activeTime} />
            </section>

            {/* Right — routine builder (sticky on desktop) */}
            <aside
              aria-label="Your routine"
              className="lg:sticky lg:top-24 lg:h-fit"
            >
              <div className="rounded-nykaa border border-line bg-white p-4 shadow-card">
                <RoutineBuilder time={activeTime} />
              </div>

              {/* Info callout */}
              <div className="mt-3 rounded-nykaa border border-nykaa-pink-mid bg-nykaa-pink-light p-3">
                <p className="text-[11px] font-semibold text-nykaa-pink">
                  Routine Lab · Demo Data
                </p>
                <p className="mt-0.5 text-[11px] text-ink-soft">
                  Products and ingredient data are illustrative. In production this
                  connects to Nykaa's live catalogue and ingredient database.
                </p>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </>
  );
}
