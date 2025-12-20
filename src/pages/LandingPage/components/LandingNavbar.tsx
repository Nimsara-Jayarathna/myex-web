interface LandingNavbarProps {
  onLogin: () => void
  onRegister: () => void
}

export const LandingNavbar = ({ onLogin, onRegister }: LandingNavbarProps) => {
  return (
    <nav className="relative z-50 mx-auto flex max-w-7xl items-center justify-between px-8 py-8">
      <div className="text-2xl font-black tracking-tighter text-[var(--page-fg)]">
        MyEx<span className="text-[#3498db]">.</span>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onLogin}
          className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-2)] px-6 py-2 text-sm font-bold text-[var(--page-fg)] backdrop-blur-md transition hover:border-[#3498db] hover:text-[#3498db]"
        >
          Log in
        </button>
        <button
          onClick={onRegister}
          className="hidden rounded-full bg-[#3498db] px-6 py-2 text-sm font-bold text-white shadow-[0_10px_20px_-5px_rgba(52,152,219,0.4)] transition hover:bg-[#2F89C9] sm:block"
        >
          Create account
        </button>
      </div>
    </nav>
  )
}
