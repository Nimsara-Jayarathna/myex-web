import type { ReactNode } from 'react'

interface TabNavigationProps<T extends string> {
  tabs: { id: T; label: string; icon?: ReactNode }[]
  activeTab: T
  onChange: (id: T) => void
}

export const TabNavigation = <T extends string>({ tabs, activeTab, onChange }: TabNavigationProps<T>) => {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-glass)] bg-[var(--surface-glass)] p-1 shadow-soft backdrop-blur-md">
      {tabs.map(tab => {
        const isActive = tab.id === activeTab
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition ${
              isActive
                ? 'bg-accent text-white shadow-[0_16px_45px_-28px_rgba(52,152,219,0.7)]'
                : 'text-[var(--page-fg)] hover:bg-accent/10'
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
