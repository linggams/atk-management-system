"use client"

import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { useDataPermintaan } from "./hooks/useDataPermintaan"
import { DataPermintaanTable, DataPermintaanSkeleton } from "./components"

export default function DataPermintaanPage() {
  const { loading, groupedPermintaan, formatDate } = useDataPermintaan()
  const hasData = Object.keys(groupedPermintaan).length > 0

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Data Permintaan Barang
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Lihat riwayat permintaan barang Anda
          </p>
        </div>

        {loading ? (
          <DataPermintaanSkeleton />
        ) : !hasData ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Tidak ada data permintaan</p>
          </div>
        ) : (
          <DataPermintaanTable
            groupedPermintaan={groupedPermintaan}
            formatDate={formatDate}
          />
        )}
      </div>
    </DashboardLayout>
  )
}
