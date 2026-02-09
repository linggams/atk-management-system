-- Migrate user levels: bendahara -> admin, instansi -> user
-- First rename enum values, then update any existing data if needed

ALTER TYPE "UserLevel" RENAME VALUE 'bendahara' TO 'admin';
ALTER TYPE "UserLevel" RENAME VALUE 'instansi' TO 'user';
