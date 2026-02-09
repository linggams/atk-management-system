import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET is not set in environment variables")
}

const handler = NextAuth({
  ...authOptions,
  secret: process.env.NEXTAUTH_SECRET,
})

export const { auth, signIn, signOut } = handler

// NextAuth v5: Export GET and POST handlers directly
// The handler object has handlers property with GET and POST methods
export const { GET, POST } = handler.handlers
