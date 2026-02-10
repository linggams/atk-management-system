"use client"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Pencil, Trash2 } from "lucide-react"
import { formatRupiah } from "../utils"
import type { StokBarang } from "../types"

interface StokTableProps {
  data: StokBarang[]
  onEdit: (stok: StokBarang) => void
  onDelete: (stok: StokBarang) => void
}

export function StokTable({ data, onEdit, onDelete }: StokTableProps) {
  return (
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
          {/* Kolom aksi tetap tampil di UI, disembunyikan saat export PDF */}
          <TableHead className="text-right pdf-hidden">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={9} className="text-center py-8">
              Tidak ada data stok barang
            </TableCell>
          </TableRow>
        ) : (
          data.map((stok, index) => (
            <TableRow key={stok.idKodeBrg}>
              <TableCell>{index + 1}</TableCell>
              <TableCell className="font-medium">{stok.kodeBrg}</TableCell>
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
              {/* Tombol aksi disembunyikan saat export PDF dengan class pdf-hidden */}
              <TableCell className="text-right pdf-hidden">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(stok)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(stok)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
