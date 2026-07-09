import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");

const pkgPath = resolve(rootDir, "package.json");
const swPath = resolve(rootDir, ".vercel/output/static/sw.js");

const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
const version = pkg.version;

if (!version) {
  console.error(
    '[inject-sw-version] Campo "version" ausente em package.json. Abortando.'
  );
  process.exit(1);
}

if (!existsSync(swPath)) {
  console.error(
    `[inject-sw-version] Arquivo nao encontrado: ${swPath}. ` +
      "O build do Vite/Nitro deve rodar antes deste script."
  );
  process.exit(1);
}

const original = readFileSync(swPath, "utf-8");
const placeholder = "__APP_VERSION__";

if (!original.includes(placeholder)) {
  console.warn(
    `[inject-sw-version] Placeholder "${placeholder}" nao encontrado em ` +
      "sw.js. Nada foi alterado — verifique se public/sw.js ainda contem o placeholder."
  );
  process.exit(0);
}

const updated = original.split(placeholder).join(version);
writeFileSync(swPath, updated, "utf-8");

console.log(
  `[inject-sw-version] CACHE_NAME atualizado para versao "${version}" em ${swPath}`
);
