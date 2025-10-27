"use client";

import Link from "next/link";

export function Hero() {
  return (
    <section className="flex flex-col gap-8 rounded-3xl border border-forest-700/50 bg-forest-900/40 p-10 shadow-lg shadow-black/40 backdrop-blur-sm sm:p-16">
      <p className="text-sm uppercase tracking-[0.35em] text-forest-300">Exporting Nature Without Borders</p>
      <h1 className="text-4xl font-semibold text-forest-50 sm:text-5xl lg:text-6xl">
        Heritage you can verify. Quality you can measure. Sourcing you can trust.
      </h1>
      <p className="max-w-2xl text-lg text-forest-200 sm:text-xl">
        Forestal MT is Honduras&apos; bridge between ancestral ethnobotanical wisdom and modern wellness markets. We cultivate
        total transparency from forest to customer, empowering conscious brands and practitioners worldwide.
      </p>
      <div className="flex flex-wrap gap-4">
        <Link
          href="/#catalog"
          className="rounded-full bg-forest-500 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-forest-950 transition hover:bg-forest-400"
        >
          Explore Catalog
        </Link>
        <Link
          href="/#story"
          className="rounded-full border border-forest-400 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-forest-100 transition hover:border-forest-200 hover:text-forest-50"
        >
          Discover Our Story
        </Link>
      </div>
    </section>
  );
}
