/**
 * DEMO MODE — React context.
 *
 * Provides `isDemo` flag and a `demoFetch` wrapper to every component.
 * The DemoProvider detects demo mode from the environment variable
 * NEXT_PUBLIC_DEMO_MODE=true.
 */

'use client'

import { createContext, useContext, useCallback, useRef } from 'react'
import { demoFetch as handleDemoFetch } from './demo-fetch'

interface DemoContextValue {
  /** True when the app is running in demo mode */
  isDemo: boolean
  /**
   * Drop-in replacement for `fetch()`.
   * In demo mode it intercepts /api/* calls; otherwise it delegates to real fetch.
   */
  apiFetch: typeof fetch
}

const DemoContext = createContext<DemoContextValue>({
  isDemo: false,
  apiFetch: fetch,
})

export function useDemoMode() {
  return useContext(DemoContext)
}

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

  // Keep a stable reference to the real fetch so we never recurse
  const realFetch = useRef(globalThis.fetch)

  const apiFetch: typeof fetch = useCallback(
    async (input: RequestInfo | URL, init?: RequestInit) => {
      if (!isDemo) {
        return realFetch.current(input, init)
      }

      // Try the demo interceptor first
      const demoResponse = await handleDemoFetch(input, init)
      if (demoResponse) return demoResponse

      // Fall through to real fetch for unhandled routes (e.g., image-proxy)
      return realFetch.current(input, init)
    },
    [isDemo],
  )

  return (
    <DemoContext.Provider value={{ isDemo, apiFetch }}>
      {children}
    </DemoContext.Provider>
  )
}
