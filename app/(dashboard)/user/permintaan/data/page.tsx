"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { format } from "date-fns"
import { id } from "date-fns/locale"

interface Permintaan {
  idPermintaan: number
  unit: string
  instansi: string
  kodeBrg: string
  idJenis: number
  jumlah: number
  tglPermintaan: string
  status: number
  stokbarang: {
    namaBrg: string
    satuan: string
  }
}

export default function DataPermintaanPage() {
  const [permintaan, setPermintaan] = useState<Permintaan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPermintaan()
  }, [])

  const fetchPermintaan = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/permintaan")
      if (response.ok) {
        const data = await response.json()
        setPermintaan(data)
      }
    } catch {
      toast.error("Gagal memuat data permintaan")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return <Badge variant="outline">Pending</Badge>
      case 1:
        return <Badge variant="default">Disetujui</Badge>
      case 2:
        return <Badge variant="destructive">Ditolak</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMMM yyyy", { locale: id })
    } catch {
      return dateString
    }
  }

  // Group by date
  const groupedPermintaan = permintaan.reduce((acc, item) => {
    const date = item.tglPermintaan.split("T")[0]
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(item)
    return acc
  }, {} as Record<string, Permintaan[]>)

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
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <Card key={i} className="p-6">
                <div className="space-y-3">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-10 w-full" />
                  {[...Array(2)].map((_, j) => (
                    <Skeleton key={j} className="h-12 w-full" />
                  ))}
                </div>
              </Card>
            ))}
          </div>
        ) : permintaan.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Tidak ada data permintaan</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedPermintaan).map(([date, items]) => (
              <Card key={date} className="p-6">
                <h2 className="text-lg font-semibold mb-4 text-foreground">
                  {formatDate(date)}
                </h2>
                <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No</TableHead>
                      <TableHead>Nama Barang</TableHead>
                      <TableHead>Jumlah</TableHead>
                      <TableHead>Satuan</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item, index) => (
                      <TableRow key={item.idPermintaan}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.stokbarang.namaBrg}</TableCell>
                        <TableCell>{item.jumlah}</TableCell>
                        <TableCell>{item.stokbarang.satuan}</TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
