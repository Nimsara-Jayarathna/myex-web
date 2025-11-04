export default function App() {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,rgba(56,189,248,0.18),rgba(2,6,23,0.95))]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_35%_at_20%_15%,rgba(129,140,248,0.25),transparent)]" />

      <div className="relative flex flex-col items-center gap-4 text-center">
        <span
          aria-hidden
          className="pointer-events-none absolute -top-10 h-48 w-48 animate-pulse rounded-full bg-sky-500/20 blur-3xl"
        />
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Start something brilliant.</h1>
        <p className="text-sm uppercase tracking-[0.35em] text-slate-500">React / Vite / Tailwind / TypeScript</p>
      </div>
    </main>
  )
}
