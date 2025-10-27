import { Hero } from "../src/components/hero";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-forest-900 via-forest-950 to-black">
      <div className="mx-auto flex max-w-6xl flex-col gap-24 px-6 py-24 sm:px-12">
        <Hero />
      </div>
    </main>
  );
}
