import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"
import { devLog } from "./dev-log"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          devLog("NextAuth authorize:", credentials?.email)

          if (!credentials?.email || !credentials?.password) {
            return null
          }

          // Ensure Prisma client is available
          if (!prisma) {
            console.error("❌ Prisma client not initialized")
            throw new Error("Database connection error")
          }

          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email as string
            }
          })

          if (!user) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          )

          if (!isPasswordValid) {
            return null
          }

          devLog("Authentication successful for:", user.email)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          console.error("❌ NextAuth authorize error:", error)
          console.error("Error details:", {
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            name: error instanceof Error ? error.name : undefined,
          })
          // Don't expose internal errors to client
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      try {
        if (user) {
          token.role = (user as any).role
          token.id = user.id
        }
        return token
      } catch (error) {
        console.error("❌ JWT callback error:", error)
        return token
      }
    },
    async session({ session, token }) {
      try {
        // Ensure session exists
        if (!session) {
          return {
            user: null,
            expires: new Date().toISOString(),
          } as any
        }
        
        // Safely add token data to session
        if (session.user) {
          if (token?.id) {
            (session.user as any).id = String(token.id)
          }
          if (token?.role) {
            (session.user as any).role = String(token.role)
          }
        }
        
        return session
      } catch (error) {
        console.error("❌ Session callback error:", error)
        // Return a minimal session to prevent 500
        return {
          user: null,
          expires: new Date().toISOString(),
        } as any
      }
    }
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  trustHost: true, // Trust the host header (required for Coolify/proxy setups)
  debug: process.env.NODE_ENV === "development",
})

// Helper function for requiring admin (compatible with existing code)
export async function requireAdmin() {
  const session = await auth()
  if (!session || (session.user as any)?.role !== 'admin') {
    return null
  }
  return session
}
