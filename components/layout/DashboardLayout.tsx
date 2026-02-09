"use client"

import { useSession } from "next-auth/react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "./Sidebar"
import { Header } from "./Header"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session } = useSession()
  const userLevel = session?.user?.level as "admin" | "user"

  if (!userLevel || (userLevel !== "admin" && userLevel !== "user")) {
    return null
  }

  return (
    <SidebarProvider>
      <AppSidebar userLevel={userLevel} />
      <SidebarInset>
        <Header userLevel={userLevel} />
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-4 md:px-6">
              {children}
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
