"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { generatePDF } from "@/lib/pdf-utils"
import { formatDate, formatRupiah } from "../utils"
import type { LaporanFilters, LaporanSummary } from "../types"

export function useLaporan() {
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("permintaan")
  const [filters, setFilters] = useState<LaporanFilters>({
    startDate: "",
    endDate: "",
    unit: "",
    status: "all",
  })
  const [data, setData] = useState<Record<string, unknown>[]>([])
  const [summary, setSummary] = useState<LaporanSummary>({})

  useEffect(() => {
    const today = new Date()
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
    setFilters((prev) => ({
      ...prev,
      startDate: firstDay.toISOString().split("T")[0],
      endDate: today.toISOString().split("T")[0],
    }))
  }, [])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.startDate) params.append("start_date", filters.startDate)
      if (filters.endDate) params.append("end_date", filters.endDate)
      if (filters.unit) params.append("unit", filters.unit)
      if (filters.status !== "all") params.append("status", filters.status)

      const response = await fetch(`/api/laporan/${activeTab}?${params.toString()}`)
      if (response.ok) {
        const result = await response.json()
        setData(result.data || [])
        setSummary(result.summary || {})
      } else {
        toast.error("Gagal memuat data laporan")
      }
    } catch {
      toast.error("Terjadi kesalahan saat memuat data")
    } finally {
      setLoading(false)
    }
  }, [activeTab, filters])

  useEffect(() => {
    if (filters.startDate || filters.endDate) {
      fetchData()
    }
  }, [activeTab, filters, fetchData])

  const getHeaders = (tab: string) => {
    switch (tab) {
      case "permintaan":
        return ["Tanggal", "Unit", "Nama Barang", "Jumlah", "Satuan", "Status"]
      case "pengajuan":
        return ["Tanggal", "Unit", "Nama Barang", "Jumlah", "Satuan", "Harga", "Total", "Status"]
      case "pemasukan":
      case "pengeluaran":
        return ["Tanggal", "Unit", "Nama Barang", "Jumlah", "Satuan"]
      case "stok":
        return ["Kode Barang", "Nama Barang", "Stok", "Keluar", "Sisa", "Satuan"]
      default:
        return []
    }
  }

  const getRowData = (item: Record<string, unknown>, tab: string): string[] => {
    switch (tab) {
      case "permintaan":
        return [
          formatDate(String(item.tglPermintaan ?? "")),
          String(item.unit ?? ""),
          String((item.stokbarang as { namaBrg?: string })?.namaBrg ?? ""),
          String(item.jumlah ?? ""),
          String((item.stokbarang as { satuan?: string })?.satuan ?? ""),
          (item.status === 0 ? "Pending" : item.status === 1 ? "Disetujui" : "Ditolak") as string,
        ]
      case "pengajuan":
        return [
          formatDate(String(item.tglPengajuan ?? "")),
          String(item.unit ?? ""),
          String((item.stokbarang as { namaBrg?: string })?.namaBrg ?? ""),
          String(item.jumlah ?? ""),
          String(item.satuan ?? ""),
          formatRupiah(Number(item.hargabarang ?? 0)),
          formatRupiah(Number(item.total ?? 0)),
          (item.status === 0 ? "Pending" : item.status === 1 ? "Disetujui" : "Ditolak") as string,
        ]
      case "pemasukan":
        return [
          formatDate(String(item.tglMasuk ?? "")),
          String(item.unit ?? ""),
          String((item.stokbarang as { namaBrg?: string })?.namaBrg ?? ""),
          String(item.jumlah ?? ""),
          String((item.stokbarang as { satuan?: string })?.satuan ?? ""),
        ]
      case "pengeluaran":
        return [
          formatDate(String(item.tglKeluar ?? "")),
          String(item.unit ?? ""),
          String((item.stokbarang as { namaBrg?: string })?.namaBrg ?? ""),
          String(item.jumlah ?? ""),
          String((item.stokbarang as { satuan?: string })?.satuan ?? ""),
        ]
      case "stok":
        return [
          String(item.kodeBrg ?? ""),
          String(item.namaBrg ?? ""),
          String(item.stok ?? ""),
          String(item.keluar ?? ""),
          String(item.sisa ?? ""),
          String(item.satuan ?? ""),
        ]
      default:
        return []
    }
  }

  const handleExport = useCallback(async () => {
    try {
      const elementId = `pdf-laporan-${activeTab}-${Date.now()}`
      const existingElement = document.getElementById(elementId)
      if (existingElement) existingElement.remove()

      const headers = getHeaders(activeTab)
      const kopHtml = `
        <div style="text-align: center; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #000;">
          <h2 style="font-size: 18px; font-weight: bold; margin: 0;">PT DASAN PAN PACIFIC INDONESIA</h2>
          <p style="font-size: 12px; margin: 4px 0 0 0;">Parakansalak, Bojonglongok, Kec. Parakansalak, Kabupaten Sukabumi, Jawa Barat 43355</p>
          <p style="font-size: 14px; font-weight: bold; margin: 12px 0 0 0;">Laporan ${activeTab}</p>
        </div>
      `
      const tableRows = data.map((item) => getRowData(item, activeTab))
      const thCells = headers
        .map((h) => `<th style="border: 1px solid #000; padding: 6px; text-align: left; background-color: #f0f0f0;">${h}</th>`)
        .join("")
      const trRows = tableRows
        .map(
          (row) =>
            `<tr>${row.map((cell) => `<td style="border: 1px solid #000; padding: 6px;">${cell}</td>`).join("")}</tr>`
        )
        .join("")
      const tableHtml = `
        <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
          <thead><tr>${thCells}</tr></thead>
          <tbody>${trRows}</tbody>
        </table>
      `
      const pdfElement = document.createElement("div")
      pdfElement.id = elementId
      pdfElement.style.cssText = "position: fixed; left: -9999px; top: 0; background: white;"
      pdfElement.innerHTML = `<div style="padding: 20px; font-family: Arial, sans-serif; min-width: 800px;">${kopHtml}${tableHtml}</div>`
      document.body.appendChild(pdfElement)

      const filename = `laporan-${activeTab}-${new Date().toISOString().split("T")[0]}.pdf`
      await generatePDF(elementId, filename, { format: "a4", orientation: "landscape", margin: 10 })
      document.body.removeChild(pdfElement)
      toast.success("PDF berhasil diunduh")
    } catch {
      toast.error("Gagal mengunduh PDF")
    }
  }, [activeTab, data])

  return {
    loading,
    activeTab,
    setActiveTab,
    filters,
    setFilters,
    data,
    summary,
    fetchData,
    handleExport,
    getHeaders,
    getRowData,
  }
}
