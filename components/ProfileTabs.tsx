'use client'

import { usePathname, useRouter } from 'next/navigation'
import { DollarSign, BarChart3, Trophy, ShoppingBag } from 'lucide-react'

const TABS = [
  { href: '/my-profile', label: 'Shows', icon: DollarSign },
  { href: '/my-profile/merch', label: 'Merch', icon: ShoppingBag },
  { href: '/my-profile/badges', label: 'Badges', icon: Trophy },
  { href: '/my-profile/recap', label: 'Recap', icon: BarChart3 },
] as const

export function ProfileTabs() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div className="border-b border-border bg-card">
      <div className="max-w-4xl mx-auto px-4">
        <nav className="flex gap-1 -mb-px overflow-x-auto scrollbar-hide">
          {TABS.map(({ href, label, icon: Icon }) => {
            const isActive = href === '/my-profile'
              ? pathname === '/my-profile'
              : pathname.startsWith(href)

            return (
              <button
                key={href}
                onClick={() => router.push(href)}
                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
