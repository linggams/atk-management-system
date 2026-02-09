"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus } from "lucide-react"
import { useUsers } from "./hooks/useUsers"
import {
  UsersTable,
  UserFormDialog,
  DeleteUserDialog,
} from "./components"
import type { User } from "./types"

export default function UsersPage() {
  const { users, loading, saveUser, deleteUser } = useUsers()
  const [formOpen, setFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)

  const handleAddClick = () => {
    setEditingUser(null)
    setFormOpen(true)
  }

  const handleEditClick = (user: User) => {
    setEditingUser(user)
    setFormOpen(true)
  }

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user)
    setDeleteOpen(true)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <Skeleton className="h-9 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Card>
            <div className="space-y-3 p-4">
              <Skeleton className="h-10 w-full" />
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Data User</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Kelola data pengguna sistem
            </p>
          </div>
          <Button onClick={handleAddClick}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah User
          </Button>
        </div>

        <UserFormDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          editingUser={editingUser}
          onSubmit={saveUser}
        />

        <Card>
          <div className="rounded-md border">
            <UsersTable
              data={users}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          </div>
        </Card>

        <DeleteUserDialog
          user={userToDelete}
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          onConfirm={deleteUser}
        />
      </div>
    </DashboardLayout>
  )
}
