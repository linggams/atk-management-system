"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
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
import { toast } from "sonner"

interface StokBarang {
  idKodeBrg: number
  kodeBrg: string
  idJenis: number
  namaBrg: string
  hargabarang: string
  satuan: string
  stok: number
  keluar: number
  sisa: number
  keterangan: string
}

interface JenisBarang {
  idJenis: number
  jenisBrg: string
}

export default function UserStokPage() {
  const searchParams = useSearchParams()
  const jenisParam = searchParams.get("jenis") || "1"

  const [stokBarang, setStokBarang] = useState<StokBarang[]>([])
  const [jenisBarang, setJenisBarang] = useState<JenisBarang[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchJenisBarang()
    fetchStokBarang()
  }, [jenisParam])

  const fetchJenisBarang = async () => {
    try {
      const response = await fetch("/api/jenis-barang")
      if (response.ok) {
        const data = await response.json()
        setJenisBarang(data)
      }
    } catch (error) {
      toast.error("Gagal memuat data jenis barang")
    }
  }

  const fetchStokBarang = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/stok?id_jenis=${jenisParam}`)
      if (response.ok) {
        const data = await response.json()
        setStokBarang(data)
      }
    } catch (error) {
      toast.error("Gagal memuat data stok barang")
    } finally {
      setLoading(false)
    }
  }

  const getJenisName = (idJenis: number) => {
    const jenis = jenisBarang.find((j) => j.idJenis === idJenis)
    return jenis?.jenisBrg || "-"
  }

  const formatRupiah = (value: string) => {
    const num = parseFloat(value)
    if (isNaN(num)) return value
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Data Stok Barang
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Lihat data stok barang - {getJenisName(parseInt(jenisParam))}
          </p>
        </div>

        {loading ? (
          <Card>
            <div className="space-y-3 p-4">
              <Skeleton className="h-10 w-full" />
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </Card>
        ) : (
          <Card>
            <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Kode Barang</TableHead>
                  <TableHead>Nama Barang</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Satuan</TableHead>
                  <TableHead>Stok</TableHead>
                  <TableHead>Keluar</TableHead>
                  <TableHead>Sisa</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stokBarang.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      Tidak ada data stok barang
                    </TableCell>
                  </TableRow>
                ) : (
                  stokBarang.map((stok, index) => (
                    <TableRow key={stok.idKodeBrg}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">
                        {stok.kodeBrg}
                      </TableCell>
                      <TableCell>{stok.namaBrg}</TableCell>
                      <TableCell>{formatRupiah(stok.hargabarang)}</TableCell>
                      <TableCell>{stok.satuan}</TableCell>
                      <TableCell>{stok.stok}</TableCell>
                      <TableCell>{stok.keluar}</TableCell>
                      <TableCell
                        className={
                          stok.sisa < 0
                            ? "text-destructive font-semibold"
                            : stok.sisa === 0
                            ? "text-amber-600 dark:text-amber-500 font-semibold"
                            : ""
                        }
                      >
                        {stok.sisa}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
