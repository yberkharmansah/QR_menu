const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const sourceDir = path.join(root, "exports");
const targetDir = path.join(root, "public", "exports");

if (!fs.existsSync(sourceDir)) {
  console.warn("sync:exports skipped - source folder not found:", sourceDir);
  process.exit(0);
}

fs.mkdirSync(path.dirname(targetDir), { recursive: true });
fs.rmSync(targetDir, { recursive: true, force: true });
fs.cpSync(sourceDir, targetDir, { recursive: true });

console.log("sync:exports completed:", path.relative(root, sourceDir), "->", path.relative(root, targetDir));
