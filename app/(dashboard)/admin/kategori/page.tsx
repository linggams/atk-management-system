"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useKategori } from "./hooks/useKategori"
import {
  KategoriTable,
  AddKategoriDialog,
  DeleteKategoriDialog,
} from "./components"
import type { Kategori } from "./types"

export default function KategoriPage() {
  const { kategori, loading, addKategori, deleteKategori } = useKategori()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [kategoriToDelete, setKategoriToDelete] = useState<Kategori | null>(null)

  const handleDeleteClick = (item: Kategori) => {
    setKategoriToDelete(item)
    setDeleteDialogOpen(true)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-9 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Card>
            <div className="space-y-3 p-4">
              <Skeleton className="h-10 w-full" />
              {[...Array(5)].map((_, i) => (
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Data Kategori</h1>
            <p className="text-muted-foreground mt-1">
              Kelola kategori barang
            </p>
          </div>
          <AddKategoriDialog onSubmit={addKategori} />
        </div>

        <Card>
          <div className="rounded-md border">
            <KategoriTable data={kategori} onDelete={handleDeleteClick} />
          </div>
        </Card>

        <DeleteKategoriDialog
          item={kategoriToDelete}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={deleteKategori}
        />
      </div>
    </DashboardLayout>
  )
}
