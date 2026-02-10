"use client"

import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { useStok } from "./hooks/useStok"
import { StokLoadingSkeleton, StokTable } from "./components"

export default function UserStokPage() {
  const { jenisParam, stokBarang, loading, getJenisName, formatRupiah } = useStok()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Data Stok Barang</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Lihat data stok barang - {getJenisName(parseInt(jenisParam))}
          </p>
        </div>

        {loading ? (
          <StokLoadingSkeleton />
        ) : (
          <StokTable stokBarang={stokBarang} formatRupiah={formatRupiah} />
        )}
      </div>
    </DashboardLayout>
  )
}
