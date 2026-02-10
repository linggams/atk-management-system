import { DashboardLayout } from "@/components/layout/DashboardLayout"

export default function AdminDashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6 flex flex-1 flex-col items-center justify-center text-center text-muted-foreground">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Selamat datang di dashboard Admin
          </p>
        </div>
        <p className="mt-8 text-sm">
          Placeholder dashboard. Statistik dan ringkasan akan ditampilkan di sini nanti.
        </p>
      </div>
    </DashboardLayout>
  )
}
