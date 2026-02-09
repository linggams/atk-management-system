import { User, Stokbarang, Permintaan, Pengajuan, Pemasukan, Pengeluaran, JenisBarang } from "@prisma/client"

export type UserLevel = "user" | "admin"

export interface SessionUser {
  id: string
  username: string
  level: UserLevel
  jabatan: string
}

// Extended types with relations
export interface StokBarangWithJenis extends Stokbarang {
  jenisBarang: JenisBarang | null
}

export interface PermintaanWithDetails extends Permintaan {
  stokbarang: Stokbarang
  jenisBarang: JenisBarang
}

export interface PengajuanWithDetails extends Pengajuan {
  stokbarang: Stokbarang
  jenisBarang: JenisBarang
}

export interface PemasukanWithDetails extends Pemasukan {
  stokbarang: Stokbarang
}

export interface PengeluaranWithDetails extends Pengeluaran {
  stokbarang: Stokbarang
}

// Form types
export interface FormPermintaan {
  unit: string
  instansi: string
  kodeBrg: string
  idJenis: number
  jumlah: number
}

export interface FormPengajuan {
  unit: string
  kodeBrg: string
  idJenis: number
  jumlah: number
  satuan: string
  hargabarang: number
  total: number
}

// Status types
export type PermintaanStatus = 0 | 1 | 2 // 0: pending, 1: approved, 2: rejected
export type PengajuanStatus = 0 | 1 | 2 // 0: pending, 1: approved, 2: rejected
