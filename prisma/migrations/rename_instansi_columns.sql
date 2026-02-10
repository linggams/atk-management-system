-- Rename columns instansi -> user to match Prisma schema
-- Safe/idempotent: only renames if instansi exists and "user" does not.
-- Run with:
--   pnpm prisma db execute --file prisma/migrations/rename_instansi_columns.sql

DO $$
BEGIN
  -- permintaan.instansi -> permintaan."user"
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'permintaan'
      AND column_name = 'instansi'
  ) AND NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'permintaan'
      AND column_name = 'user'
  ) THEN
    EXECUTE 'ALTER TABLE "permintaan" RENAME COLUMN "instansi" TO "user"';
  END IF;

  -- sementara.instansi -> sementara."user"
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'sementara'
      AND column_name = 'instansi'
  ) AND NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'sementara'
      AND column_name = 'user'
  ) THEN
    EXECUTE 'ALTER TABLE "sementara" RENAME COLUMN "instansi" TO "user"';
  END IF;
END $$;

