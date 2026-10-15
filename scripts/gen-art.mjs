#!/usr/bin/env node
// Renders the placeholder product illustrations in src/components/ProductArt.tsx
// to static files in public/art/*.svg. Run after editing ProductArt.tsx:  node scripts/gen-art.mjs
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { pathToFileURL } from "node:url";
import ts from "typescript";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const src = fs.readFileSync("src/components/ProductArt.tsx", "utf8");
const js = ts.transpileModule(src, { compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const tmp = path.join(fs.mkdtempSync(path.join(process.cwd(), ".art-")), "ProductArt.mjs");
fs.writeFileSync(tmp, js);
try {
  const { ART_KINDS, ProductArt } = await import(pathToFileURL(tmp).href);
  fs.mkdirSync("public/art", { recursive: true });
  for (const k of ART_KINDS) {
    const svg = renderToStaticMarkup(createElement(ProductArt, { kind: k, label: `${k} illustration` })).replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
    fs.writeFileSync(`public/art/${k}.svg`, svg + "\n");
  }
  console.log(`Wrote ${ART_KINDS.length} illustrations to public/art/`);
} finally {
  fs.rmSync(path.dirname(tmp), { recursive: true, force: true });
}
