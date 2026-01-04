'use client'

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'
import { useEffect } from 'react'

export function SessionProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Suppress NextAuth errors in console for public pages
    const originalError = console.error
    console.error = (...args: any[]) => {
      if (args[0]?.includes?.('next-auth') || args[0]?.includes?.('CLIENT_FETCH_ERROR')) {
        // Silently ignore NextAuth client fetch errors
        return
      }
      originalError(...args)
    }

    return () => {
      console.error = originalError
    }
  }, [])

  return (
    <NextAuthSessionProvider
      refetchInterval={0}
      refetchOnWindowFocus={false}
      basePath="/api/auth"
    >
      {children}
    </NextAuthSessionProvider>
  )
}

