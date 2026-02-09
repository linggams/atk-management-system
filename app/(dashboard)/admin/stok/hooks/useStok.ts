"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { generatePDF } from "@/lib/pdf-utils"
import type { StokBarang, JenisBarang, StokFormData } from "../types"

export function useStok() {
  const searchParams = useSearchParams()
  const jenisParam = searchParams.get("jenis") || "1"

  const [stokBarang, setStokBarang] = useState<StokBarang[]>([])
  const [jenisBarang, setJenisBarang] = useState<JenisBarang[]>([])
  const [loading, setLoading] = useState(true)

  const fetchJenisBarang = useCallback(async () => {
    try {
      const response = await fetch("/api/jenis-barang")
      if (response.ok) {
        const data = await response.json()
        setJenisBarang(data)
      } else {
        toast.error("Gagal memuat data jenis barang")
      }
    } catch {
      toast.error("Gagal memuat data jenis barang")
    }
  }, [])

  const fetchStokBarang = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/stok?id_jenis=${jenisParam}`)
      if (response.ok) {
        const data = await response.json()
        setStokBarang(data)
      } else {
        toast.error("Gagal memuat data stok barang")
      }
    } catch {
      toast.error("Gagal memuat data stok barang")
    } finally {
      setLoading(false)
    }
  }, [jenisParam])

  useEffect(() => {
    fetchJenisBarang()
    fetchStokBarang()
  }, [fetchJenisBarang, fetchStokBarang])

  const fetchNextKode = async (idJenis: number) => {
    try {
      const res = await fetch(`/api/stok/next-kode?id_jenis=${idJenis}`)
      if (res.ok) {
        const { nextKode } = await res.json()
        return nextKode
      }
    } catch {
      toast.error("Gagal generate kode barang")
    }
    return ""
  }

  const saveStok = async (
    formData: StokFormData,
    editingStok: StokBarang | null
  ): Promise<boolean> => {
    const url = editingStok
      ? `/api/stok/${editingStok.idKodeBrg}`
      : "/api/stok"
    const method = editingStok ? "PUT" : "POST"

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })

    if (response.ok) {
      toast.success(
        editingStok
          ? "Stok barang berhasil diupdate"
          : "Stok barang berhasil ditambahkan"
      )
      await fetchStokBarang()
      return true
    }

    const error = await response.json()
    toast.error(error.error || "Terjadi kesalahan")
    return false
  }

  const deleteStok = async (stok: StokBarang): Promise<boolean> => {
    const response = await fetch(`/api/stok/${stok.idKodeBrg}`, {
      method: "DELETE",
    })

    if (response.ok) {
      toast.success("Stok barang berhasil dihapus")
      await fetchStokBarang()
      return true
    }

    const error = await response.json()
    toast.error(error.error || "Terjadi kesalahan")
    return false
  }

  const getJenisName = (idJenis: number) => {
    const jenis = jenisBarang.find((j) => j.idJenis === idJenis)
    return jenis?.jenisBrg || "-"
  }

  const downloadPDF = async () => {
    try {
      const elementId = "pdf-stok-content"
      const jenisName = getJenisName(parseInt(jenisParam))
      const filename = `Laporan_Stok_${jenisName}_${new Date().toISOString().split("T")[0]}.pdf`
      await generatePDF(elementId, filename, {
        format: "a4",
        orientation: "landscape",
        margin: 10,
      })
      toast.success("PDF berhasil diunduh")
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast.error("Gagal mengunduh PDF")
    }
  }

  return {
    stokBarang,
    jenisBarang,
    loading,
    jenisParam,
    fetchNextKode,
    saveStok,
    deleteStok,
    getJenisName,
    downloadPDF,
  }
}
