-- Migrate IT users to admin (run before removing IT level from enum)
-- Historical: IT level was merged into admin
UPDATE "user" SET level = 'admin' WHERE level = 'it';
