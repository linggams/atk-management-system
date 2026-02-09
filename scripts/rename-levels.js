#!/usr/bin/env node
/**
 * Rename bendahara → admin, instansi → user (user level only)
 * Preserves: instansi field (department name in Permintaan/Sementara)
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const files = [];
function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      if (!['node_modules', '.next', '.git'].includes(f)) walk(p);
    } else if (/\.(ts|tsx|prisma|md)$/.test(f)) {
      files.push(p);
    }
  }
}
walk(ROOT);

// Replacements - order matters
const reps = [
  // Folders first - will do separately
  // Level checks and URLs
  [/([ "'])bendahara([ "'])/g, '$1admin$2'],
  [/([ "'])instansi([ "'])/g, '$1user$2'],
  [/\/bendahara\//g, '/admin/'],
  [/\/instansi\//g, '/user/'],
  [/\.startsWith\("\/bendahara"\)/g, '.startsWith("/admin")'],
  [/\.startsWith\("\/instansi"\)/g, '.startsWith("/user")'],
  [/getBendaharaBaseMenu/g, 'getAdminBaseMenu'],
  [/getInstansiBaseMenu/g, 'getUserBaseMenu'],
  [/isBendaharaRoute/g, 'isAdminRoute'],
  [/isInstansiRoute/g, 'isUserRoute'],
  [/UserLevel = "instansi" \| "bendahara"/g, 'UserLevel = "user" | "admin"'],
  [/z\.enum\(\["instansi", "bendahara"\]\)/g, 'z.enum(["user", "admin"])'],
  [/z\.enum\(\["instansi", "bendahara"\]\)\.optional\(\)/g, 'z.enum(["user", "admin"]).optional()'],
  [/"instansi" \| "bendahara"/g, '"user" | "admin"'],
  [/"bendahara" \| "instansi"/g, '"admin" | "user"'],
  [/only for bendahara/g, 'only for admin'],
  [/to bendahara/g, 'to admin'],
  [/for instansi/g, 'for user'],
  [/If instansi/g, 'If user'],
  [/If bendahara/g, 'If admin'],
  [/level: 'bendahara'/g, "level: 'admin'"],
  [/level: 'instansi'/g, "level: 'user'"],
  // Prisma enum
  [/enum UserLevel \{\s*instansi\s*bendahara\s*\}/gs, 'enum UserLevel {\n  user\n  admin\n}'],
  [/enum UserLevel \{\s*bendahara\s*instansi\s*\}/gs, 'enum UserLevel {\n  admin\n  user\n}'],
];

// Fix Prisma enum - simple line replacement
const schemaPath = path.join(ROOT, 'prisma', 'schema.prisma');
if (fs.existsSync(schemaPath)) {
  let schema = fs.readFileSync(schemaPath, 'utf8');
  schema = schema.replace(/\benum UserLevel \{[^}]*\}/s, 'enum UserLevel {\n  user\n  admin\n}');
  fs.writeFileSync(schemaPath, schema);
  console.log('Updated: prisma/schema.prisma');
}

// RESTORE instansi where it's a field name (not user level)
// These patterns match field/property "instansi" - we must NOT change them
// instansi: string, instansi: item.xxx, validatedData.instansi, etc.
// The reps above use ([ "'])instansi([ "']) - so "instansi" or 'instansi' 
// But instansi: won't match that - good. validatedData.instansi - the part after . won't be replaced by ([ "'])instansi

// Actually the regex ([ "'])instansi([ "']) will replace "instansi" and 'instansi' 
// So session.user.level === "instansi" becomes session.user.level === "user" ✓
// But instansi: z.string() - the "instansi" here is a key, no space before. The pattern needs instansi at word boundary.
// ([ "'])instansi([ "']) matches space/quote + instansi + space/quote. So "instansi" in instansi: would need to be "instansi": - that's different, it's a JSON key. In JS/TS we have instansi: - the instansi here has no quotes. So we're good - we're only replacing quoted "instansi" and 'instansi'.

// Wait - in z.object({ instansi: z.string() }) the "instansi" is an object key - not in quotes. So it won't match ([ "'])instansi([ "']). Good!

// Run replacements
for (const file of files) {
  let c = fs.readFileSync(file, 'utf8');
  const orig = c;
  for (const [p, r] of reps) {
    c = c.replace(p, r);
  }
  if (c !== orig) {
    fs.writeFileSync(file, c);
    console.log('Updated:', path.relative(ROOT, file));
  }
}

// Rename folders
const dash = path.join(ROOT, 'app', '(dashboard)');
if (fs.existsSync(path.join(dash, 'bendahara'))) {
  fs.renameSync(path.join(dash, 'bendahara'), path.join(dash, 'admin'));
  console.log('Renamed: bendahara -> admin');
}
if (fs.existsSync(path.join(dash, 'instansi'))) {
  fs.renameSync(path.join(dash, 'instansi'), path.join(dash, 'user'));
  console.log('Renamed: instansi -> user');
}

console.log('Done!');
