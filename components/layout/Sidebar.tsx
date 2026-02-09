"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { useTheme } from "next-themes"
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  ClipboardList,
  FileCheck,
  BarChart3,
  LogOut,
  Tag,
  Sun,
  Moon,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

interface SidebarItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  children?: SidebarItem[]
}

interface SidebarProps {
  userLevel: "admin" | "user"
}

interface Kategori {
  idJenis: number
  jenisBrg: string
}

const getAdminBaseMenu = (kategori: Kategori[]): SidebarItem[] => [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Data User",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Kategori",
    href: "/admin/kategori",
    icon: Tag,
  },
  {
    title: "Data Stok Barang",
    href: "#",
    icon: Package,
    children: kategori.map((kat) => ({
      title: kat.jenisBrg,
      href: `/admin/stok?jenis=${kat.idJenis}`,
      icon: Package,
    })),
  },
  {
    title: "Permintaan Barang",
    href: "/admin/permintaan",
    icon: ClipboardList,
  },
  {
    title: "Data Permintaan Barang",
    href: "/admin/permintaan/data",
    icon: FileText,
  },
  {
    title: "Form Pengajuan Barang",
    href: "/admin/pengajuan",
    icon: FileCheck,
  },
  {
    title: "Data Pengajuan Barang",
    href: "/admin/pengajuan/data",
    icon: FileText,
  },
  {
    title: "Laporan",
    href: "/admin/laporan",
    icon: BarChart3,
  },
]

const getUserBaseMenu = (kategori: Kategori[]): SidebarItem[] => [
  {
    title: "Dashboard",
    href: "/user/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Data Stok Barang",
    href: "#",
    icon: Package,
    children: kategori.map((kat) => ({
      title: kat.jenisBrg,
      href: `/user/stok?jenis=${kat.idJenis}`,
      icon: Package,
    })),
  },
  {
    title: "Form Permintaan Barang",
    href: "/user/permintaan",
    icon: ClipboardList,
  },
  {
    title: "Data Permintaan Barang",
    href: "/user/permintaan/data",
    icon: FileText,
  },
  {
    title: "Cetak BPP",
    href: "/user/cetak",
    icon: FileCheck,
  },
]

function isActive(pathname: string, href: string) {
  const path = pathname.split("?")[0]
  if (href === "#") return false
  return path === href || path.startsWith(href + "/")
}

export function AppSidebar({ userLevel }: SidebarProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [kategori, setKategori] = useState<Kategori[]>([])

  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const response = await fetch("/api/jenis-barang")
        if (response.ok) {
          const data = await response.json()
          setKategori(data)
        }
      } catch (error) {
        console.error("Error fetching kategori:", error)
      }
    }

    if (userLevel === "admin" || userLevel === "user") {
      fetchKategori()
    }
  }, [userLevel])

  const menuItems =
    userLevel === "admin"
      ? getAdminBaseMenu(kategori)
      : getUserBaseMenu(kategori)

  const handleLogout = async () => {
    const callbackUrl = typeof window !== "undefined" ? `${window.location.origin}/login` : "/login"
    await signOut({ callbackUrl })
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex h-14 items-center px-2">
          <h1 className="text-xl font-bold text-sidebar-foreground">PT DASAN</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {menuItems.map((item, index) => (
          <SidebarGroup key={item.href + index}>
            {item.children ? (
              <>
                <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuSub>
                        {item.children.map((child) => {
                          const ChildIcon = child.icon
                          const active = isActive(pathname, child.href)
                          return (
                            <SidebarMenuSubItem key={child.href}>
                              <SidebarMenuSubButton asChild isActive={active}>
                                <Link href={child.href}>
                                  <ChildIcon className="size-4" />
                                  <span>{child.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          )
                        })}
                      </SidebarMenuSub>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
                <SidebarSeparator />
              </>
            ) : (
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive(pathname, item.href)}>
                    <Link href={item.href}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            )}
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <div className="flex items-center justify-between gap-2 p-2">
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-sidebar-foreground">
              {session?.user?.jabatan}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {session?.user?.username}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="size-8 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              title={resolvedTheme === "dark" ? "Light mode" : "Dark mode"}
            >
              {resolvedTheme === "dark" ? (
                <Sun className="size-4" />
              ) : (
                <Moon className="size-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="size-8 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              title="Logout"
            >
              <LogOut className="size-4" />
            </Button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
