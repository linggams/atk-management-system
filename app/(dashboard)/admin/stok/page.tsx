"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Download, Printer } from "lucide-react"
import { useStok } from "./hooks/useStok"
import { StokTable, StokFormDialog, DeleteStokDialog } from "./components"
import type { StokBarang } from "./types"

export default function StokPage() {
  const {
    stokBarang,
    jenisBarang,
    loading,
    jenisParam,
    fetchNextKode,
    saveStok,
    deleteStok,
    getJenisName,
    downloadPDF,
  } = useStok()

  const [formOpen, setFormOpen] = useState(false)
  const [editingStok, setEditingStok] = useState<StokBarang | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [stokToDelete, setStokToDelete] = useState<StokBarang | null>(null)

  const handleAddClick = () => {
    setEditingStok(null)
    setFormOpen(true)
  }

  const handleEditClick = (stok: StokBarang) => {
    setEditingStok(stok)
    setFormOpen(true)
  }

  const handleDeleteClick = (stok: StokBarang) => {
    setStokToDelete(stok)
    setDeleteOpen(true)
  }

  useEffect(() => {
    const style = document.createElement("style")
    style.textContent = `
      @media print {
        body * { visibility: hidden; }
        #pdf-stok-content, #pdf-stok-content * { visibility: visible; }
        #pdf-stok-content { position: absolute; left: 0; top: 0; width: 100%; }
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <Skeleton className="h-9 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Card>
            <div className="space-y-3 p-4">
              <Skeleton className="h-10 w-full" />
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Data Stok Barang
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Kelola data stok barang - {getJenisName(parseInt(jenisParam))}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={downloadPDF}
              variant="default"
              className="hidden print:hidden"
              disabled={stokBarang.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              Cetak PDF
            </Button>
            <Button
              onClick={() => window.print()}
              variant="outline"
              className="hidden print:hidden"
              disabled={stokBarang.length === 0}
            >
              <Printer className="mr-2 h-4 w-4" />
              Cetak
            </Button>
            <Button
              variant="outline"
              onClick={downloadPDF}
              disabled={stokBarang.length === 0}
            >
              Export
            </Button>
            <Button onClick={handleAddClick}>Tambah Stok Barang</Button>
          </div>
        </div>

        <StokFormDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          editingStok={editingStok}
          jenisBarang={jenisBarang}
          defaultJenis={parseInt(jenisParam)}
          onSubmit={saveStok}
          onFetchNextKode={fetchNextKode}
        />

        <Card id="pdf-stok-content" className="print:border-none print:shadow-none">
          <div className="p-4 print:p-0">
            <div className="text-center mb-4 print:mb-2">
              <h2 className="text-xl font-bold">PT DASAN PAN PACIFIC INDONESIA</h2>
              <p className="text-sm">
                Parakansalak, Bojonglongok, Kec. Parakansalak, Kabupaten Sukabumi, Jawa Barat 43355
              </p>
              <hr className="my-2" />
              <h3 className="text-lg font-bold">
                LAPORAN DATA STOK BARANG {getJenisName(parseInt(jenisParam)).toUpperCase()}
              </h3>
            </div>
            <StokTable
              data={stokBarang}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          </div>
        </Card>

        <DeleteStokDialog
          stok={stokToDelete}
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          onConfirm={deleteStok}
        />
      </div>
    </DashboardLayout>
  )
}
