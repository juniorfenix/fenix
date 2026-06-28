/**
 * Gera os ícones PNG do PWA Fênix sem dependências externas.
 * Usa o módulo `zlib` nativo do Node para compressão PNG.
 *
 * Uso: node --env-file=.env --experimental-strip-types scripts/generate-pwa-icons.ts
 */

import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

// ── Paleta Fênix ──────────────────────────────────────────────────────────────
const BG: [number, number, number, number] = [26, 22, 20, 255];    // #1a1614
const AMBER: [number, number, number, number] = [217, 119, 6, 255]; // #d97706

// ── Encoder PNG puro ──────────────────────────────────────────────────────────

function crc32(data: Uint8Array): number {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[i] = c;
  }
  let crc = 0xffffffff;
  for (const b of data) crc = (crc >>> 8) ^ table[(crc ^ b) & 0xff];
  return (crc ^ 0xffffffff) >>> 0;
}

function makeChunk(type: string, data: Uint8Array): Uint8Array {
  const typeBytes = new TextEncoder().encode(type);
  const out = new Uint8Array(12 + data.length);
  const dv = new DataView(out.buffer);
  dv.setUint32(0, data.length, false);
  out.set(typeBytes, 4);
  out.set(data, 8);
  const crcBuf = new Uint8Array(4 + data.length);
  crcBuf.set(typeBytes, 0);
  crcBuf.set(data, 4);
  dv.setUint32(8 + data.length, crc32(crcBuf), false);
  return out;
}

function encodePNG(w: number, h: number, rgba: Uint8Array): Buffer {
  const sig = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = new Uint8Array(13);
  const dv = new DataView(ihdr.buffer);
  dv.setUint32(0, w, false);
  dv.setUint32(4, h, false);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA

  // Raw scanlines: 1 filter byte + row data per row
  const row = 1 + w * 4;
  const raw = new Uint8Array(h * row);
  for (let y = 0; y < h; y++) {
    raw[y * row] = 0; // filter: None
    raw.set(rgba.subarray(y * w * 4, (y + 1) * w * 4), y * row + 1);
  }

  const idat = deflateSync(raw, { level: 9 });

  const parts = [sig, makeChunk("IHDR", ihdr), makeChunk("IDAT", idat), makeChunk("IEND", new Uint8Array(0))];
  const total = parts.reduce((n, p) => n + p.length, 0);
  const out = new Uint8Array(total);
  let pos = 0;
  for (const p of parts) { out.set(p, pos); pos += p.length; }
  return Buffer.from(out);
}

// ── Renderizador do ícone ─────────────────────────────────────────────────────

function renderIcon(size: number): Uint8Array {
  const pixels = new Uint8Array(size * size * 4);
  const s = size / 512;

  // Background
  for (let i = 0; i < size * size; i++) {
    pixels[i * 4] = BG[0]; pixels[i * 4 + 1] = BG[1];
    pixels[i * 4 + 2] = BG[2]; pixels[i * 4 + 3] = BG[3];
  }

  function fill(x1f: number, y1f: number, x2f: number, y2f: number) {
    const x1 = Math.round(x1f * s), y1 = Math.round(y1f * s);
    const x2 = Math.round(x2f * s), y2 = Math.round(y2f * s);
    for (let y = y1; y <= y2; y++) {
      for (let x = x1; x <= x2; x++) {
        if (x < 0 || x >= size || y < 0 || y >= size) continue;
        const i = (y * size + x) * 4;
        pixels[i] = AMBER[0]; pixels[i + 1] = AMBER[1];
        pixels[i + 2] = AMBER[2]; pixels[i + 3] = AMBER[3];
      }
    }
  }

  // "F" lettermark — coordenadas de referência em 512×512
  // Dentro da safe zone do ícone maskable (>10% de margem em todas as bordas)
  fill(152, 104, 360, 160); // barra superior
  fill(152, 256, 310, 312); // barra do meio
  fill(152, 104, 208, 408); // haste vertical
  return pixels;
}

// ── Geração ───────────────────────────────────────────────────────────────────

function generate(size: number, filename: string) {
  const pixels = renderIcon(size);
  const png = encodePNG(size, size, pixels);
  writeFileSync(filename, png);
  console.log(`  ✓ ${filename}  (${size}×${size})`);
}

const dir = resolve(process.cwd(), "public/icons");
mkdirSync(dir, { recursive: true });

console.log("⬇  Gerando ícones PWA…");
generate(192, resolve(dir, "icon-192.png"));
generate(512, resolve(dir, "icon-512.png"));
generate(180, resolve(dir, "apple-touch-icon.png"));
console.log("✅ Ícones gerados com sucesso.");
