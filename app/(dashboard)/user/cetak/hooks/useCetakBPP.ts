"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { generatePDF, generateMultiPagePDF } from "@/lib/pdf-utils"
import type { Permintaan } from "../types"

export function useCetakBPP() {
  const { data: session } = useSession()
  const [permintaan, setPermintaan] = useState<Permintaan[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  )

  const fetchPermintaan = useCallback(async () => {
    if (!session?.user?.username) return
    setLoading(true)
    try {
      const response = await fetch(
        `/api/permintaan?unit=${session.user.username}&tgl_permintaan=${selectedDate}&status=1`
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
  }, [selectedDate, session?.user?.username])

  useEffect(() => {
    if (selectedDate && session?.user?.username) {
      fetchPermintaan()
    }
  }, [selectedDate, session?.user?.username, fetchPermintaan])

  const formatDate = useCallback((dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMMM yyyy", { locale: id })
    } catch {
      return dateString
    }
  }, [])

  const groupedPermintaan = permintaan.reduce((acc, item) => {
    const date = item.tglPermintaan.split("T")[0]
    if (!acc[date]) acc[date] = []
    acc[date].push(item)
    return acc
  }, {} as Record<string, Permintaan[]>)

  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  const handleDownloadPDF = useCallback(
    async (date: string, items: Permintaan[]) => {
      try {
        const elementId = `pdf-content-${date}`
        const filename = `BPP_${date}_${items[0]?.instansi || "unknown"}.pdf`
        await generatePDF(elementId, filename, {
          format: "a4",
          orientation: "portrait",
          margin: 10,
        })
        toast.success("PDF berhasil diunduh")
      } catch (error) {
        console.error("Error generating PDF:", error)
        toast.error("Gagal mengunduh PDF")
      }
    },
    []
  )

  const handleExportAllPDF = useCallback(async () => {
    const dates = Object.keys(groupedPermintaan)
    if (dates.length === 0) {
      toast.error("Tidak ada data untuk diekspor")
      return
    }
    try {
      const elements = dates.map((date) => ({
        id: `pdf-content-${date}`,
        title: `BPP ${date}`,
      }))
      const filename = `BPP_${selectedDate}_${session?.user?.username || "export"}.pdf`
      await generateMultiPagePDF(elements, filename, {
        format: "a4",
        orientation: "portrait",
        margin: 10,
      })
      toast.success("PDF berhasil diekspor")
    } catch (error) {
      console.error("Error exporting PDF:", error)
      toast.error("Gagal mengekspor PDF")
    }
  }, [groupedPermintaan, selectedDate, session?.user?.username])

  return {
    selectedDate,
    setSelectedDate,
    loading,
    groupedPermintaan,
    fetchPermintaan,
    formatDate,
    handlePrint,
    handleDownloadPDF,
    handleExportAllPDF,
    session,
  }
}
