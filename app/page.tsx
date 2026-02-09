import { redirect } from "next/navigation"
import { getServerSession } from "@/lib/get-session"

export default async function HomePage() {
  const session = await getServerSession()

  if (!session) {
    redirect("/login")
  }

  // Redirect berdasarkan level user
  if (session.user.level === "admin") {
    redirect("/admin/dashboard")
  } else if (session.user.level === "user") {
    redirect("/user/dashboard")
  } else {
    redirect("/unauthorized")
  }

  return null
}
