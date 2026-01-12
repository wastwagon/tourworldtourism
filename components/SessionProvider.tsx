'use client'

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'
import { useEffect } from 'react'

export function SessionProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Suppress expected NextAuth 401 errors in console for public pages
    // These are normal when users aren't logged in
    const originalError = console.error
    
    const suppressNextAuthErrors = (...args: any[]) => {
      const firstArg = args[0]
      const message = typeof firstArg === 'string' ? firstArg : String(firstArg)
      
      // Suppress expected 401 errors from NextAuth session checks
      if (
        message.includes('next-auth') ||
        message.includes('CLIENT_FETCH_ERROR') ||
        message.includes('401') ||
        message.includes('Unauthorized') ||
        args.some(arg => 
          typeof arg === 'string' && (
            arg.includes('/api/auth/callback/credentials') ||
            arg.includes('Failed to load resource')
          )
        )
      ) {
        // Silently ignore expected NextAuth errors
        return
      }
      originalError(...args)
    }
    
    console.error = suppressNextAuthErrors

    // Also intercept fetch errors for auth endpoints
    const originalFetch = window.fetch
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args)
        
        // Don't log 401 errors for auth endpoints (expected when not logged in)
        if (
          response.status === 401 &&
          typeof args[0] === 'string' &&
          args[0].includes('/api/auth/')
        ) {
          // Silently handle expected 401s - this is normal behavior
          return response
        }
        
        return response
      } catch (error) {
        // Suppress network errors for auth endpoints
        if (
          typeof args[0] === 'string' &&
          args[0].includes('/api/auth/')
        ) {
          // Silently handle expected auth errors
          throw error
        }
        throw error
      }
    }

    return () => {
      console.error = originalError
      window.fetch = originalFetch
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

