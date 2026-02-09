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
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2 } from "lucide-react"
import type { User } from "../types"

interface UsersTableProps {
  data: User[]
  onEdit: (user: User) => void
  onDelete: (user: User) => void
}

function getLevelLabel(level: string) {
  switch (level) {
    case "admin":
      return "Admin"
    case "user":
      return "User"
    default:
      return level
  }
}

export function UsersTable({ data, onEdit, onDelete }: UsersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No</TableHead>
          <TableHead>Username</TableHead>
          <TableHead>Level</TableHead>
          <TableHead>Jabatan</TableHead>
          <TableHead className="text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8">
              Tidak ada data user
            </TableCell>
          </TableRow>
        ) : (
          data.map((user, index) => (
            <TableRow key={user.idUser}>
              <TableCell>{index + 1}</TableCell>
              <TableCell className="font-medium">{user.username}</TableCell>
              <TableCell>
                <Badge variant={user.level === "admin" ? "default" : "secondary"}>
                  {getLevelLabel(user.level)}
                </Badge>
              </TableCell>
              <TableCell>{user.jabatan}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(user)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(user)}
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
