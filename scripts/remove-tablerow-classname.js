/**
 * Remove `className` prop from JSX <TableRow ...> tags in TS/TSX/JS/JSX files.
 *
 * Usage (dry-run):
 *   node scripts/remove-tablerow-classname.js --root "C:\next\atk"
 *
 * Apply changes:
 *   node scripts/remove-tablerow-classname.js --root "C:\next\atk" --write
 *
 * Optional:
 *   --include "app,components"   (comma-separated subfolders)
 */
const fs = require("fs")
const path = require("path")

function parseArgs(argv) {
  const args = { root: process.cwd(), write: false, include: ["app", "components"] }
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i]
    if (a === "--write") args.write = true
    else if (a === "--root") args.root = argv[++i]
    else if (a === "--include") args.include = String(argv[++i]).split(",").map((s) => s.trim()).filter(Boolean)
  }
  return args
}

function shouldSkipDir(dirName) {
  return (
    dirName === "node_modules" ||
    dirName === ".next" ||
    dirName === "dist" ||
    dirName === "build" ||
    dirName === ".git" ||
    dirName === "coverage"
  )
}

function walk(dir, outFiles) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const ent of entries) {
    const full = path.join(dir, ent.name)
    if (ent.isDirectory()) {
      if (shouldSkipDir(ent.name)) continue
      walk(full, outFiles)
    } else if (ent.isFile()) {
      const ext = path.extname(ent.name).toLowerCase()
      if (ext === ".tsx" || ext === ".ts" || ext === ".jsx" || ext === ".js") {
        outFiles.push(full)
      }
    }
  }
}

function transform(content) {
  // Remove className=... only on <TableRow ...> tags (including multiline props)
  // Handles className="...", className={'...'}, className={...}
  const re = /<TableRow\b([\s\S]*?)\sclassName\s*=\s*(\{[\s\S]*?\}|\"[\s\S]*?\"|\'[\s\S]*?\')([\s\S]*?)(\/?)>/g
  let changed = false
  const next = content.replace(re, (m, pre, _cls, post, selfClose) => {
    changed = true
    // Clean up extra whitespace around removed prop
    const combined = `${pre}${post}`.replace(/\s{2,}/g, " ")
    return `<TableRow${combined}${selfClose}>`
  })
  return { changed, next }
}

function main() {
  const { root, write, include } = parseArgs(process.argv)
  const roots = include.map((p) => path.resolve(root, p))

  const files = []
  for (const r of roots) {
    if (fs.existsSync(r)) walk(r, files)
  }

  let touched = 0
  let totalReplacements = 0

  for (const file of files) {
    const before = fs.readFileSync(file, "utf8")
    const { changed, next } = transform(before)
    if (!changed) continue

    // Count replacements roughly by comparing occurrences
    const beforeCount = (before.match(/<TableRow\b/g) || []).length
    const afterCount = (next.match(/<TableRow\b/g) || []).length
    totalReplacements += Math.max(0, Math.min(beforeCount, afterCount))

    touched++
    if (write) {
      fs.writeFileSync(file, next, "utf8")
    }
  }

  console.log(`[remove-tablerow-classname] root=${root}`)
  console.log(`[remove-tablerow-classname] include=${include.join(",")}`)
  console.log(`[remove-tablerow-classname] mode=${write ? "WRITE" : "DRY-RUN"}`)
  console.log(`[remove-tablerow-classname] files_changed=${touched}`)
  console.log(`[remove-tablerow-classname] done`)
}

main()

