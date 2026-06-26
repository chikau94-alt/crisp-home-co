'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/admin',          label: 'Bookings'  },
  { href: '/admin/leads',    label: 'Leads'     },
  { href: '/admin/schedule', label: 'Schedule'  },
  { href: '/admin/cleaners', label: 'Cleaners'  },
]

export default function AdminNav() {
  const path = usePathname()

  return (
    <nav className="border-b border-cream-deep bg-white px-6 flex gap-1">
      {NAV.map(({ href, label }) => {
        const active = href === '/admin' ? path === '/admin' : path.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={[
              'px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px',
              active
                ? 'border-navy text-navy'
                : 'border-transparent text-ink-soft hover:text-ink hover:border-cream-deep',
            ].join(' ')}
          >
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
