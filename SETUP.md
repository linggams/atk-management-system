# Setup Instructions - ATK Management System Migration

## Prerequisites
- Node.js 18+ installed
- PostgreSQL database server running
- pnpm package manager

## Setup Steps

### 1. Environment Variables
Buat file `.env` di root project dengan isi (silakan sesuaikan `username`, `password`, dan nama database jika berbeda):

```env
# Database
# Default menggunakan database `atk`, silakan sesuaikan username/password jika perlu
DATABASE_URL="postgresql://postgres:password@localhost:5432/atk?schema=public"

# NextAuth
NEXTAUTH_SECRET="generate-random-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

**Untuk generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 2. Setup PostgreSQL Database

#### Option A: Create New Database
```sql
CREATE DATABASE atk;
```

#### Option B: Migrate from MySQL (database lama)
Jika Anda ingin migrate data dari MySQL lama ke PostgreSQL:
1. Export data dari MySQL
2. Import ke PostgreSQL (perlu konversi format)
3. Atau gunakan tool migration seperti `pgloader`

### 3. Run Prisma Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Create initial migration (jika database baru)
npx prisma migrate dev --name init

# Atau jika database sudah ada dengan data, gunakan:
npx prisma db push
```

### 3b. Seed Database (User Awal)

Setelah struktur database siap, jalankan seed untuk mengisi user awal (lihat `prisma/seed.ts`):

```bash
npx prisma db seed
```

### 4. Install Dependencies (jika belum)

```bash
pnpm install
```

### 5. Run Development Server

```bash
pnpm dev
```

Aplikasi akan berjalan di `http://localhost:3000`

> Catatan: Untuk menjalankan aplikasi build di Windows, Anda juga bisa menggunakan script `run-app.bat` yang akan melakukan `pnpm build` lalu `pnpm start`.

## Database Schema Notes

### Important Notes:
1. **id_jenis**: 
   - Di `jenis_barang` dan `stokbarang`: `id_jenis` adalah `Int` dengan foreign key relation
   - Jika melakukan migrasi dari database lama (VARCHAR), jalankan: `npx prisma db execute --file prisma/migrations/fix_jenis_barang_id.sql`

2. **Password Hashing**:
   - Database existing menggunakan MD5
   - Aplikasi mendukung MD5 (legacy) dan bcrypt
   - Disarankan untuk migrate password ke bcrypt secara bertahap

3. **Status Values**:
   - `0` = Pending
   - `1` = Approved/Completed
   - `2` = Rejected

## Next Steps

Setelah setup selesai, lanjutkan dengan:
1. ✅ Setup Prisma & Database - **DONE**
2. ✅ Setup NextAuth.js - **DONE**
3. ✅ Login Page - **DONE**
4. ✅ Protected Routes & Middleware - **DONE**
5. ✅ Layout Components (Sidebar, Header) - **DONE**
6. ✅ Modul Admin (Dashboard, Kategori, Stok, Permintaan, Pengajuan, Laporan) - **DONE**
7. ✅ Modul User (Dashboard, Stok, Permintaan, Cetak BPP) - **DONE**

## Troubleshooting

### Prisma Client Error
Jika ada error "Prisma Client not generated":
```bash
npx prisma generate
```

### Database Connection Error
- Pastikan PostgreSQL server running
- Check DATABASE_URL di `.env`
- Pastikan database sudah dibuat

### NextAuth Error
- Pastikan NEXTAUTH_SECRET sudah di-set
- Pastikan NEXTAUTH_URL sesuai dengan URL aplikasi
