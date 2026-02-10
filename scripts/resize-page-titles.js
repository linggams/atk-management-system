/**
 * Resize page title text in heading (kiri atas) untuk semua halaman.
 *
 * Default: ganti kelas Tailwind `text-3xl` -> `text-2xl` di file TSX/JSX.
 *
 * Penggunaan (dry-run, hanya laporan):
 *   node scripts/resize-page-titles.js --root "C:\\next\\atk"
 *
 * Terapkan perubahan:
 *   node scripts/resize-page-titles.js --root "C:\\next\\atk" --write
 *
 * Opsional batasi folder:
 *   --include "app"              (hanya folder app)
 *   --include "app\\(dashboard)" (hanya halaman dashboard)
 */
const fs = require("fs")
const path = require("path")

function parseArgs(argv) {
  const args = { root: process.cwd(), write: false, include: ["app"] }
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i]
    if (a === "--write") args.write = true
    else if (a === "--root") args.root = argv[++i]
    else if (a === "--include") {
      args.include = String(argv[++i])
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    }
  }
  return args
}

function shouldSkipDir(name) {
  return (
    name === "node_modules" ||
    name === ".next" ||
    name === ".git" ||
    name === "dist" ||
    name === "build" ||
    name === "coverage"
  )
}

function walk(dir, out) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const ent of entries) {
    const full = path.join(dir, ent.name)
    if (ent.isDirectory()) {
      if (shouldSkipDir(ent.name)) continue
      walk(full, out)
    } else if (ent.isFile()) {
      const ext = path.extname(ent.name).toLowerCase()
      if (ext === ".tsx" || ext === ".jsx") out.push(full)
    }
  }
}

function transform(content) {
  let changed = false

  // 1) Ganti ukuran utama: text-3xl -> text-2xl
  if (content.includes("text-3xl")) {
    content = content.replace(/text-3xl/g, "text-2xl")
    changed = true
  }

  // 2) Opsional: kalau ada h1 sangat besar (text-4xl), kecilkan juga
  if (content.includes("text-4xl")) {
    content = content.replace(/text-4xl/g, "text-3xl")
    changed = true
  }

  return { changed, next: content }
}

function main() {
  const { root, write, include } = parseArgs(process.argv)
  const roots = include.map((sub) => path.resolve(root, sub))

  const files = []
  for (const r of roots) {
    if (fs.existsSync(r)) walk(r, files)
  }

  let changedFiles = 0

  for (const file of files) {
    const before = fs.readFileSync(file, "utf8")
    const { changed, next } = transform(before)
    if (!changed) continue
    changedFiles++
    if (write) {
      fs.writeFileSync(file, next, "utf8")
    }
  }

  console.log("[resize-page-titles] root=", root)
  console.log("[resize-page-titles] include=", include.join(","))
  console.log("[resize-page-titles] mode=", write ? "WRITE" : "DRY-RUN")
  console.log("[resize-page-titles] files_changed=", changedFiles)
}

main()

