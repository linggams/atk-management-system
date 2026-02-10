"use client"

import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { StokBarang } from "../types"

interface StokTableProps {
  stokBarang: StokBarang[]
  formatRupiah: (value: string) => string
}

export function StokTable({ stokBarang, formatRupiah }: StokTableProps) {
  return (
    <Card>
      <CardContent>
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
                  <TableCell colSpan={8}>Tidak ada data stok barang</TableCell>
                </TableRow>
              ) : (
                stokBarang.map((stok, index) => (
                  <TableRow key={stok.idKodeBrg}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{stok.kodeBrg}</TableCell>
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
      </CardContent>
    </Card>
  )
}

