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
import { SearchSelect } from "@/components/ui/search-select"
import { Button } from "@/components/ui/button"
import { Loader2, Eye, Printer, Download } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import Link from "next/link"
import { generatePDF } from "@/lib/pdf-utils"

interface Pengajuan {
  idPengajuan: number
  unit: string
  kodeBrg: string
  idJenis: number
  jumlah: number
  satuan: string
  hargabarang: number
  total: number
  tglPengajuan: string
  status: number
  stokbarang: {
    namaBrg: string
  }
}

export default function DataPengajuanPage() {
  const [pengajuan, setPengajuan] = useState<Pengajuan[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    fetchPengajuan()
  }, [statusFilter])

  const fetchPengajuan = async () => {
    setLoading(true)
    try {
      const url =
        statusFilter === "all"
          ? "/api/pengajuan"
          : `/api/pengajuan?status=${statusFilter}`
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setPengajuan(data)
      }
    } catch {
      toast.error("Gagal memuat data pengajuan")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMMM yyyy", { locale: id })
    } catch {
      return dateString
    }
  }

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value)
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

  const handleDownloadPDF = async (unit: string, tglPengajuan: string) => {
    try {
      const response = await fetch(
        `/api/pengajuan?unit=${unit}&tgl_pengajuan=${tglPengajuan.split("T")[0]}`
      )
      if (!response.ok) {
        throw new Error("Gagal memuat data pengajuan")
      }
      const data = await response.json()
      
      if (data.length === 0) {
        toast.error("Tidak ada data untuk dicetak")
        return
      }

      // Create a temporary element for PDF generation
      const elementId = `pdf-pengajuan-${unit}-${tglPengajuan.split("T")[0]}`
      const existingElement = document.getElementById(elementId)
      if (existingElement) {
        existingElement.remove()
      }

      const pdfElement = document.createElement("div")
      pdfElement.id = elementId
      pdfElement.className = "hidden"
      pdfElement.innerHTML = `
        <div style="padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="font-size: 18px; font-weight: bold;">PT DASAN PAN PACIFIC INDONESIA</h2>
            <p style="font-size: 12px;">Parakansalak, Bojonglongok, Kec. Parakansalak, Kabupaten Sukabumi, Jawa Barat 43355</p>
            <hr style="margin: 10px 0;">
            <h3 style="font-size: 16px; font-weight: bold; text-decoration: underline;">FORM PENGAJUAN BARANG</h3>
          </div>
          <div style="margin-bottom: 10px;">
            <p style="font-size: 12px;">Permintaan Pembelian Barang</p>
            <p style="font-size: 12px;">Pada Tanggal : <b>${formatDate(tglPengajuan)}</b></p>
          </div>
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #000; font-size: 11px;">
            <thead>
              <tr style="background-color: #f0f0f0;">
                <th style="border: 1px solid #000; padding: 5px; text-align: center;">No.</th>
                <th style="border: 1px solid #000; padding: 5px; text-align: center;">Kode Barang</th>
                <th style="border: 1px solid #000; padding: 5px; text-align: center;">Nama Barang</th>
                <th style="border: 1px solid #000; padding: 5px; text-align: center;">Satuan</th>
                <th style="border: 1px solid #000; padding: 5px; text-align: center;">Jumlah</th>
                <th style="border: 1px solid #000; padding: 5px; text-align: center;">Harga Barang</th>
                <th style="border: 1px solid #000; padding: 5px; text-align: center;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${data.map((item: Pengajuan, index: number) => `
                <tr>
                  <td style="border: 1px solid #000; padding: 5px; text-align: center;">${index + 1}</td>
                  <td style="border: 1px solid #000; padding: 5px; text-align: center;">${item.kodeBrg}</td>
                  <td style="border: 1px solid #000; padding: 5px; text-align: left;">${item.stokbarang.namaBrg}</td>
                  <td style="border: 1px solid #000; padding: 5px; text-align: center;">${item.satuan}</td>
                  <td style="border: 1px solid #000; padding: 5px; text-align: center;">${item.jumlah}</td>
                  <td style="border: 1px solid #000; padding: 5px; text-align: center;">${formatRupiah(item.hargabarang)}</td>
                  <td style="border: 1px solid #000; padding: 5px; text-align: center;">${formatRupiah(item.total)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #000; font-size: 11px; margin-top: 10px;">
            <tr>
              <td style="border: 1px solid #000; padding: 5px; text-align: center; font-weight: bold;">Sub Total</td>
              <td style="border: 1px solid #000; padding: 5px; text-align: center; font-weight: bold;">${data.reduce((sum: number, item: Pengajuan) => sum + item.jumlah, 0)}</td>
              <td style="border: 1px solid #000; padding: 5px; text-align: center; font-weight: bold;">${formatRupiah(data.reduce((sum: number, item: Pengajuan) => sum + item.hargabarang, 0))}</td>
              <td style="border: 1px solid #000; padding: 5px; text-align: center; font-weight: bold;">${formatRupiah(data.reduce((sum: number, item: Pengajuan) => sum + item.total, 0))}</td>
            </tr>
          </table>
        </div>
      `
      document.body.appendChild(pdfElement)

      const filename = `Pengajuan_${unit}_${tglPengajuan.split("T")[0]}.pdf`
      await generatePDF(elementId, filename, {
        format: "a4",
        orientation: "portrait",
        margin: 10,
      })

      document.body.removeChild(pdfElement)
      toast.success("PDF berhasil diunduh")
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast.error("Gagal mengunduh PDF")
    }
  }

  // Group by unit and date
  const groupedPengajuan = pengajuan.reduce((acc, item) => {
    const key = `${item.unit}-${item.tglPengajuan.split("T")[0]}`
    if (!acc[key]) {
      acc[key] = {
        unit: item.unit,
        tglPengajuan: item.tglPengajuan,
        items: [],
      }
    }
    acc[key].items.push(item)
    return acc
  }, {} as Record<string, { unit: string; tglPengajuan: string; items: Pengajuan[] }>)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Data Pengajuan Barang
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Lihat semua data pengajuan barang
            </p>
          </div>
          <SearchSelect
            value={statusFilter}
            onSelect={(item) => setStatusFilter(item.value)}
            placeholder="Filter Status"
            size="sm"
            items={[
              { id: "all", value: "all", label: "Semua Status" },
              { id: "0", value: "0", label: "Pending" },
              { id: "1", value: "1", label: "Disetujui" },
              { id: "2", value: "2", label: "Ditolak" },
            ]}
          />
        </div>

        {loading ? (
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <Card key={i} className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-9 w-28" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                  {[...Array(2)].map((_, j) => (
                    <Skeleton key={j} className="h-12 w-full" />
                  ))}
                </div>
              </Card>
            ))}
          </div>
        ) : Object.keys(groupedPengajuan).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Tidak ada data pengajuan</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.values(groupedPengajuan).map((group, index) => (
              <Card key={index} className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">{group.unit}</h2>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(group.tglPengajuan)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {group.items.some((item) => item.status === 0) && (
                      <Button asChild>
                        <Link
                          href={`/admin/pengajuan/detail?unit=${group.unit}&tgl=${group.tglPengajuan.split("T")[0]}`}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Detail & Approve
                        </Link>
                      </Button>
                    )}
                    <Button
                      onClick={() => handleDownloadPDF(group.unit, group.tglPengajuan)}
                      variant="default"
                      className="hidden print:hidden"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Cetak PDF
                    </Button>
                  </div>
                </div>
                <div className="text-center mb-4 pb-4 border-b">
                  <h2 className="text-lg font-bold text-foreground">PT DASAN PAN PACIFIC INDONESIA</h2>
                  <p className="text-sm text-muted-foreground">Parakansalak, Bojonglongok, Kec. Parakansalak, Kabupaten Sukabumi, Jawa Barat 43355</p>
                </div>
                <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No</TableHead>
                      <TableHead>Nama Barang</TableHead>
                      <TableHead>Jumlah</TableHead>
                      <TableHead>Satuan</TableHead>
                      <TableHead>Harga</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {group.items.map((item, idx) => (
                      <TableRow key={item.idPengajuan}>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell>{item.stokbarang.namaBrg}</TableCell>
                        <TableCell>{item.jumlah}</TableCell>
                        <TableCell>{item.satuan}</TableCell>
                        <TableCell>{formatRupiah(item.hargabarang)}</TableCell>
                        <TableCell>{formatRupiah(item.total)}</TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                </div>
                <div className="mt-4 p-4 bg-muted rounded-md">
                  <div className="flex justify-between font-semibold">
                    <span>Total Pengajuan:</span>
                    <span>
                      {formatRupiah(
                        group.items.reduce((sum, item) => sum + item.total, 0)
                      )}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
