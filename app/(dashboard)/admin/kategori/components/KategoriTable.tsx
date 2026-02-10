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
import { Trash2 } from "lucide-react"
import type { Kategori } from "../types"

interface KategoriTableProps {
  data: Kategori[]
  onDelete: (item: Kategori) => void
}

export function KategoriTable({ data, onDelete }: KategoriTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID Kategori</TableHead>
          <TableHead>Nama Kategori</TableHead>
          <TableHead>Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={3}>Tidak ada data kategori</TableCell>
          </TableRow>
        ) : (
          data.map((item) => (
            <TableRow key={item.idJenis}>
              <TableCell>{item.idJenis}</TableCell>
              <TableCell>{item.jenisBrg}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(item)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
