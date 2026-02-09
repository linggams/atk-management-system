"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Loader2, Check, X, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

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
    sisa: number
  }
}

export default function DetailPermintaanPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const unit = searchParams.get("unit")
  const tgl = searchParams.get("tgl")

  const [permintaan, setPermintaan] = useState<Permintaan[]>([])
  const [loading, setLoading] = useState(true)
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [approveAllDialogOpen, setApproveAllDialogOpen] = useState(false)
  const [permintaanToProcess, setPermintaanToProcess] = useState<Permintaan | null>(null)
  const [processing, setProcessing] = useState<number | null>(null)

  useEffect(() => {
    if (unit && tgl) {
      fetchPermintaan()
    }
  }, [unit, tgl])

  const fetchPermintaan = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `/api/permintaan?unit=${unit}&tgl_permintaan=${tgl}&status=0`
      )
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

  const handleApproveClick = (item: Permintaan) => {
    setPermintaanToProcess(item)
    setApproveDialogOpen(true)
  }

  const handleApprove = async (id: number) => {
    setProcessing(id)
    try {
      const response = await fetch(`/api/permintaan/${id}/approve`, {
        method: "POST",
      })

      if (response.ok) {
        toast.success("Permintaan berhasil disetujui")
        fetchPermintaan()
      } else {
        const error = await response.json()
        toast.error(error.error || "Terjadi kesalahan")
      }
    } catch {
      toast.error("Terjadi kesalahan saat menyetujui")
    } finally {
      setProcessing(null)
    }
  }

  const handleRejectClick = (item: Permintaan) => {
    setPermintaanToProcess(item)
    setRejectDialogOpen(true)
  }

  const handleReject = async (id: number) => {
    setProcessing(id)
    try {
      const response = await fetch(`/api/permintaan/${id}/reject`, {
        method: "POST",
      })

      if (response.ok) {
        toast.success("Permintaan berhasil ditolak")
        fetchPermintaan()
      } else {
        const error = await response.json()
        toast.error(error.error || "Terjadi kesalahan")
      }
    } catch {
      toast.error("Terjadi kesalahan saat menolak")
    } finally {
      setProcessing(null)
    }
  }

  const handleApproveAllClick = () => {
    setApproveAllDialogOpen(true)
  }

  const handleApproveAll = async () => {
    // Check if all have sufficient stock
    for (const item of permintaan) {
      if (item.stokbarang.sisa < item.jumlah) {
        toast.error(
          `Stok ${item.stokbarang.namaBrg} tidak mencukupi. Stok tersedia: ${item.stokbarang.sisa}`
        )
        return
      }
    }

    setApproveAllDialogOpen(false)
    // Approve all
    for (const item of permintaan) {
      await handleApprove(item.idPermintaan)
    }
  }

  const handleApproveConfirm = async () => {
    if (permintaanToProcess) {
      setApproveDialogOpen(false)
      await handleApprove(permintaanToProcess.idPermintaan)
      setPermintaanToProcess(null)
    }
  }

  const handleRejectConfirm = async () => {
    if (permintaanToProcess) {
      setRejectDialogOpen(false)
      await handleReject(permintaanToProcess.idPermintaan)
      setPermintaanToProcess(null)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMMM yyyy", { locale: id })
    } catch {
      return dateString
    }
  }

  if (!unit || !tgl) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Parameter tidak valid</p>
          <Button asChild className="mt-4">
            <Link href="/admin/permintaan">Kembali</Link>
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/admin/permintaan">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <h1 className="text-3xl font-bold text-foreground">
                Detail Permintaan Barang
              </h1>
            </div>
            <p className="mt-2 text-sm text-muted-foreground ml-12">
              {unit} - {formatDate(tgl)}
            </p>
          </div>
          {permintaan.length > 0 && (
            <Button onClick={handleApproveAllClick} disabled={processing !== null}>
              {processing !== null ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Setujui Semua
                </>
              )}
            </Button>
          )}
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
        ) : permintaan.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Tidak ada data permintaan</p>
            <Button asChild className="mt-4">
              <Link href="/admin/permintaan">Kembali</Link>
            </Button>
          </div>
        ) : (
          <Card>
            <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Nama Barang</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Satuan</TableHead>
                  <TableHead>Stok Tersedia</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {permintaan.map((item, index) => (
                  <TableRow key={item.idPermintaan}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">
                      {item.stokbarang.namaBrg}
                    </TableCell>
                    <TableCell>{item.jumlah}</TableCell>
                    <TableCell>{item.stokbarang.satuan}</TableCell>
                    <TableCell
                      className={
                        item.stokbarang.sisa < item.jumlah
                          ? "text-destructive font-semibold"
                          : ""
                      }
                    >
                      {item.stokbarang.sisa}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">Pending</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApproveClick(item)}
                          disabled={
                            processing !== null ||
                            item.stokbarang.sisa < item.jumlah
                          }
                        >
                          {processing === item.idPermintaan ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRejectClick(item)}
                          disabled={processing !== null}
                        >
                          {processing === item.idPermintaan ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <X className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          </Card>
        )}

        <AlertDialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Setujui Permintaan?</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin menyetujui permintaan {permintaanToProcess?.stokbarang.namaBrg}?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={handleApproveConfirm}>Ya, Setujui</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Tolak Permintaan?</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin menolak permintaan {permintaanToProcess?.stokbarang.namaBrg}?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={handleRejectConfirm} variant="destructive">
                Ya, Tolak
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={approveAllDialogOpen} onOpenChange={setApproveAllDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Setujui Semua Permintaan?</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin menyetujui semua permintaan ini?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={handleApproveAll}>Ya, Setujui Semua</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  )
}
