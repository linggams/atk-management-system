"use client"

import { useSession } from "next-auth/react"
import { SidebarTrigger } from "@/components/ui/sidebar"

interface HeaderProps {
  userLevel: "admin" | "user"
}

export function Header({ userLevel }: HeaderProps) {
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <SidebarTrigger />
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex items-center gap-x-4 lg:gap-x-6 flex-1">
          <div className="hidden md:block">
            <h2 className="text-lg font-semibold text-foreground">
              {session?.user?.jabatan}
            </h2>
          </div>
        </div>
      </div>
    </header>
  )
}
