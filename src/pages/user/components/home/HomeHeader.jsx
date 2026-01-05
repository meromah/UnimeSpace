import React from 'react'
import { TabFilters } from '../../../../utils/tabFilters'
const tabFilters = new TabFilters().all()
const HomeHeader = ({onTabChange, tab, ref=null }) => {
  return (
    <div ref={ref} className="sticky top-0 left-0 right-0 grid grid-cols-2 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-sm border-b border-b-neutral-200 dark:border-b-neutral-700 z-50">
        {tabFilters.map(({ value, label }) => (
          <div
            className="flex items-center group cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all duration-200 ease-in-out "
            onClick={() => onTabChange(value)}
            key={value}
          >
            <button
              className={`
                py-5 mx-auto font-semibold transition-all duration-150
                ${
                  tab === value
                    ? "border-b-4 text-neutral-950 dark:text-neutral-100 border-primary-blue dark:border-primary-blue"
                    : "text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-100"
                }
                focus:outline-none cursor-pointer
              `}
              aria-label={`Filter by ${label}`}
              aria-pressed={tab === value}
            >
              <span>{label}</span>
            </button>
          </div>
        ))}
      </div>
  )
}

export default HomeHeader