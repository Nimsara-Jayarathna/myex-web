import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'

interface TabNavigationProps<T extends string> {
  tabs: { id: T; label: string; icon?: ReactNode }[]
  activeTab: T
  onChange: (id: T) => void
}

export const TabNavigation = <T extends string>({ tabs, activeTab, onChange }: TabNavigationProps<T>) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const tabRefs = useRef(new Map<T, HTMLButtonElement | null>())
  const [indicator, setIndicator] = useState({ left: 0, width: 0, ready: false })

  const updateIndicator = useMemo(() => {
    return () => {
      const container = containerRef.current
      const activeButton = tabRefs.current.get(activeTab)
      if (!container || !activeButton) {
        return
      }

      const nextLeft = activeButton.offsetLeft
      const nextWidth = activeButton.offsetWidth

      setIndicator(prev => {
        if (prev.left === nextLeft && prev.width === nextWidth && prev.ready) {
          return prev
        }
        return { left: nextLeft, width: nextWidth, ready: true }
      })
    }
  }, [activeTab])

  useLayoutEffect(() => {
    updateIndicator()
  }, [updateIndicator, tabs])

  useEffect(() => {
    updateIndicator()
    if (typeof ResizeObserver === 'undefined') {
      const handleResize = () => updateIndicator()
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }

    const observer = new ResizeObserver(() => updateIndicator())
    if (containerRef.current) {
      observer.observe(containerRef.current)
    }
    const activeButton = tabRefs.current.get(activeTab)
    if (activeButton) {
      observer.observe(activeButton)
    }

    return () => observer.disconnect()
  }, [activeTab, updateIndicator])

  return (
    <div
      ref={containerRef}
      className="relative inline-flex items-center gap-2 rounded-full border border-[var(--border-glass)] bg-[var(--surface-glass)] p-1 shadow-soft backdrop-blur-md"
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute left-0 top-1 bottom-1 rounded-full border border-white/30 bg-[linear-gradient(135deg,rgba(59,130,246,0.55),rgba(59,130,246,0.4)_60%,rgba(59,130,246,0.28))] shadow-[0_18px_45px_-30px_rgba(15,23,42,0.45)] backdrop-blur-xl transition-[transform,width,opacity] duration-500 ${indicator.ready ? 'opacity-100' : 'opacity-0'
          }`}
        style={{
          transform: `translateX(${indicator.left}px)`,
          width: `${indicator.width}px`,
          transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      />
      {tabs.map(tab => {
        const isActive = tab.id === activeTab
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            ref={node => {
              tabRefs.current.set(tab.id, node)
            }}
            className={`relative z-10 flex items-center gap-2 rounded-full px-6 py-3 text-base font-semibold transition-colors duration-300 ${isActive ? 'text-slate-900' : 'text-[var(--page-fg)] hover:text-[var(--primary-accent)]'
              }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}
