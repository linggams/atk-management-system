-- Migration: Convert jenis_barang.id_jenis from VARCHAR to INTEGER
-- This enables proper foreign key relation with stokbarang and other tables
-- Run with: npx prisma db execute --file prisma/migrations/fix_jenis_barang_id.sql

-- Step 1: Convert id_jenis column type from VARCHAR to INTEGER
ALTER TABLE "jenis_barang" 
  ALTER COLUMN "id_jenis" TYPE INTEGER USING ("id_jenis"::integer);

-- Step 2: Add foreign key from stokbarang to jenis_barang
ALTER TABLE "stokbarang" 
  ADD CONSTRAINT "stokbarang_id_jenis_fkey" 
  FOREIGN KEY ("id_jenis") REFERENCES "jenis_barang"("id_jenis") 
  ON DELETE RESTRICT ON UPDATE CASCADE;
