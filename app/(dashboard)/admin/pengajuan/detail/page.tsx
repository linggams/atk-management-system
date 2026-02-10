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

export default function DetailPengajuanPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const unit = searchParams.get("unit")
  const tgl = searchParams.get("tgl")

  const [pengajuan, setPengajuan] = useState<Pengajuan[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<number | null>(null)
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [approveAllDialogOpen, setApproveAllDialogOpen] = useState(false)
  const [pengajuanToProcess, setPengajuanToProcess] = useState<Pengajuan | null>(null)

  useEffect(() => {
    if (unit && tgl) {
      fetchPengajuan()
    }
  }, [unit, tgl])

  const fetchPengajuan = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `/api/pengajuan?unit=${unit}&tgl_pengajuan=${tgl}&status=0`
      )
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

  const handleApproveClick = (item: Pengajuan) => {
    setPengajuanToProcess(item)
    setApproveDialogOpen(true)
  }

  const handleApprove = async (id: number) => {
    setProcessing(id)
    try {
      const response = await fetch(`/api/pengajuan/${id}/approve`, {
        method: "POST",
      })

      if (response.ok) {
        toast.success("Pengajuan berhasil disetujui")
        fetchPengajuan()
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

  const handleRejectClick = (item: Pengajuan) => {
    setPengajuanToProcess(item)
    setRejectDialogOpen(true)
  }

  const handleReject = async (id: number) => {
    setProcessing(id)
    try {
      const response = await fetch(`/api/pengajuan/${id}/reject`, {
        method: "POST",
      })

      if (response.ok) {
        toast.success("Pengajuan berhasil ditolak")
        fetchPengajuan()
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
    setApproveAllDialogOpen(false)
    // Approve all
    for (const item of pengajuan) {
      await handleApprove(item.idPengajuan)
    }
  }

  const handleApproveConfirm = async () => {
    if (pengajuanToProcess) {
      setApproveDialogOpen(false)
      await handleApprove(pengajuanToProcess.idPengajuan)
      setPengajuanToProcess(null)
    }
  }

  const handleRejectConfirm = async () => {
    if (pengajuanToProcess) {
      setRejectDialogOpen(false)
      await handleReject(pengajuanToProcess.idPengajuan)
      setPengajuanToProcess(null)
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

  const totalAll = pengajuan.reduce((sum, item) => sum + item.total, 0)

  if (!unit || !tgl) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Parameter tidak valid</p>
          <Button asChild className="mt-4">
            <Link href="/admin/pengajuan/data">Kembali</Link>
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
                <Link href="/admin/pengajuan/data">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <h1 className="text-2xl font-bold text-foreground">
                Detail Pengajuan Barang
              </h1>
            </div>
            <p className="mt-2 text-sm text-muted-foreground ml-12">
              {unit} - {formatDate(tgl)}
            </p>
          </div>
          {pengajuan.length > 0 && (
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
        ) : pengajuan.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Tidak ada data pengajuan</p>
            <Button asChild className="mt-4">
              <Link href="/admin/pengajuan/data">Kembali</Link>
            </Button>
          </div>
        ) : (
          <>
            <Card>
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
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pengajuan.map((item, index) => (
                      <TableRow key={item.idPengajuan}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.stokbarang.namaBrg}</TableCell>
                        <TableCell>{item.jumlah}</TableCell>
                        <TableCell>{item.satuan}</TableCell>
                        <TableCell>{formatRupiah(item.hargabarang)}</TableCell>
                        <TableCell>{formatRupiah(item.total)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">Pending</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleApproveClick(item)}
                              disabled={processing !== null}
                            >
                              {processing === item.idPengajuan ? (
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
                              {processing === item.idPengajuan ? (
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
            <Card className="p-4">
              <div className="flex justify-between font-semibold text-lg text-foreground">
                <span>Total Pengajuan:</span>
                <span>{formatRupiah(totalAll)}</span>
              </div>
            </Card>
          </>
        )}

        <AlertDialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Setujui Pengajuan?</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin menyetujui pengajuan {pengajuanToProcess?.stokbarang.namaBrg}?
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
              <AlertDialogTitle>Tolak Pengajuan?</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin menolak pengajuan {pengajuanToProcess?.stokbarang.namaBrg}?
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
              <AlertDialogTitle>Setujui Semua Pengajuan?</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin menyetujui semua pengajuan ini?
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
