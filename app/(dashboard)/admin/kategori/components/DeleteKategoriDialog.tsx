"use client"

import { useState } from "react"
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
import { Loader2 } from "lucide-react"
import type { Kategori } from "../types"

interface DeleteKategoriDialogProps {
  item: Kategori | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (item: Kategori) => Promise<boolean>
}

export function DeleteKategoriDialog({
  item,
  open,
  onOpenChange,
  onConfirm,
}: DeleteKategoriDialogProps) {
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!item) return

    setDeleting(true)
    const success = await onConfirm(item)
    setDeleting(false)

    if (success) {
      onOpenChange(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Kategori?</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus kategori &quot;{item?.jenisBrg}&quot;?
            Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleting}
            variant="destructive"
          >
            {deleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menghapus...
              </>
            ) : (
              "Hapus"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
