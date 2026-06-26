import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const esmPath = join(__dirname, "..", "node_modules", "docx", "dist", "index.mjs");

let content = readFileSync(esmPath, "utf8");

const oldLine = 'var _super = (..._args) => (super(..._args), _defineProperty(this, "imageData", void 0), this);';
const newLine = 'var _super = function() { return (super(...arguments), _defineProperty(this, "imageData", void 0), this); };';

if (!content.includes(oldLine)) {
  console.error("[patch-docx] Pattern not found – docx may have been updated, skipping patch");
  process.exit(1);
}

content = content.replace(oldLine, newLine);
writeFileSync(esmPath, content, "utf8");
console.log("[patch-docx] Patched docx ESM super() arrow function → regular function");
