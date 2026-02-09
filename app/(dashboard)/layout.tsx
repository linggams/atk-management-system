import { redirect } from "next/navigation"
import { getServerSession } from "@/lib/get-session"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()

  if (!session) {
    redirect("/login")
  }

  return <>{children}</>
}
