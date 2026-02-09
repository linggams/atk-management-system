import { getToken } from "next-auth/jwt"
import { NextRequest } from "next/server"
import { auth } from "@/app/api/auth/[...nextauth]/route"

// For server components and server actions
export async function getServerSession() {
  const session = await auth()
  return session
}

// For API routes
export async function getSessionFromRequest(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (!token) {
    return null
  }

  // Normalize legacy levels: bendahara->admin, instansi->user
  let level = token.level as string
  if (level === "bendahara") level = "admin"
  if (level === "instansi") level = "user"

  return {
    user: {
      id: token.sub || "",
      username: token.username as string,
      level,
      jabatan: token.jabatan as string,
    },
  }
}
