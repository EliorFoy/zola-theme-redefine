// hexo-to-zola.mjs —— 将 Hexo 文章（front matter）转换为 Zola 格式
// 用法: node hexo-to-zola.mjs <hexo-source-dir> <zola-content-dir> [--posts-subdir _posts]
// - 解析 Hexo YAML front matter，输出 Zola TOML front matter
// - tags / categories（数组或字符串）→ [taxonomies]
// - excerpt / cover / banner / thumbnail / sticky / expires / password 等 → [extra]
// - 正文原样保留（<!-- more --> 摘要分隔符、Hexo 标签插件需手工改为组件，见 README）
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const srcDir = path.resolve(args[0]);
const outDir = path.resolve(args[1]);

function parseFrontMatter(text) {
  // 兼容 Hexo 的 --- YAML 与已转换文件的 +++ TOML，避免重复运行时二次包裹
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  const t = text.match(/^\+\+\+\r?\n([\s\S]*?)\r?\n\+\+\+\r?\n?([\s\S]*)$/);
  const match = m ?? t;
  if (!match) return { fm: {}, body: text };
  const lines = match[1].split(/\r?\n/);
  const fm = {};
  let curKey = null;
  let curList = null;
  for (const raw of lines) {
    const line = raw.replace(/\t/g, "    ");
    if (/^\s*\[[A-Za-z.]+\]\s*$/.test(line)) { curKey = null; curList = null; continue; }
    const kv = line.match(/^([A-Za-z0-9_-]+)\s*=\s*(.*)$/) ?? line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (kv && !line.startsWith(" ")) {
      curKey = kv[1];
      curList = null;
      const val = kv[2].trim();
      if (val === "") { fm[curKey] = null; continue; }
      fm[curKey] = parseScalar(val.replace(/^["']|["']$/g, ""));
      continue;
    }
    const listItem = line.match(/^\s*-\s*(.*)$/);
    if (listItem && curKey) {
      if (!curList) { curList = []; fm[curKey] = curList; }
      curList.push(parseScalar(listItem[1].trim().replace(/^["']|["']$/g, "")));
      continue;
    }
    const subKey = line.match(/^\s+([A-Za-z0-9_-]+)\s*[:=]\s*(.*)$/);
    if (subKey && curKey) {
      if (!fm[curKey] || typeof fm[curKey] !== "object") fm[curKey] = {};
      fm[curKey][subKey[1]] = parseScalar(subKey[2].trim().replace(/^["']|["']$/g, ""));
    }
  }
  return { fm, body: match[2] ?? "" };
}

function parseScalar(v) {
  if (v === "true") return true;
  if (v === "false") return false;
  if (/^\d+$/.test(v)) return Number(v);
  return v;
}

function tomlStr(v) {
  return `"${String(v).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function toToml(fm, relName) {
  const out = ["+++"];
  out.push(`title = ${tomlStr(fm.title ?? path.basename(relName).replace(/\.md$/i, ""))}`);
  if (fm.date) out.push(`date = ${tomlStr(String(fm.date))}`);
  if (fm.updated) out.push(`updated = ${tomlStr(String(fm.updated))}`);
  if (fm.description) out.push(`description = ${tomlStr(fm.description)}`);
  const tax = [];
  if (fm.tags) tax.push(["tags", fm.tags]);
  if (fm.categories) tax.push(["categories", fm.categories]);
  if (tax.length) {
    out.push("[taxonomies]");
    for (const [k, v] of tax) {
      const arr = Array.isArray(v) ? v : [v];
      out.push(`${k} = [${arr.map(tomlStr).join(", ")}]`);
    }
  }
  const extraKeys = ["excerpt", "cover", "banner", "thumbnail", "sticky", "expires",
    "password", "mathjax", "publish", "author", "copyright", "license", "comment",
    "keywords", "og_image", "og_description", "avatar"];
  const extra = extraKeys.filter((k) => fm[k] !== undefined && fm[k] !== null && fm[k] !== "");
  if (extra.length) {
    out.push("[extra]");
    for (const k of extra) {
      const v = fm[k];
      out.push(`${k} = ${typeof v === "boolean" ? v : typeof v === "number" ? v : tomlStr(v)}`);
    }
  }
  out.push("+++");
  return out.join("\n");
}

let converted = 0;
const sources = [];
{
  const p = srcDir;
  const st = fs.statSync(p);
  if (st.isFile() && p.toLowerCase().endsWith(".md")) {
    sources.push(p);
  } else if (st.isDirectory()) {
    for (const f of fs.readdirSync(p, { withFileTypes: true })) {
      if (f.isFile() && f.name.toLowerCase().endsWith(".md")) sources.push(path.join(p, f.name));
      if (f.isDirectory() && f.name === "_posts") {
        for (const x of fs.readdirSync(path.join(p, f.name))) {
          if (x.toLowerCase().endsWith(".md")) sources.push(path.join(p, f.name, x));
        }
      }
    }
  }
}
fs.mkdirSync(outDir, { recursive: true });
for (const file of sources) {
  const text = fs.readFileSync(file, "utf8");
  const { fm, body } = parseFrontMatter(text);
  if (!fm.date) {
    // Hexo 页面可以没有 date，Zola 的 sorted section 需要：回退到文件修改时间
    fm.date = fs.statSync(file).mtime.toISOString().slice(0, 19).replace("T", " ");
  }
  const out = `${toToml(fm, path.basename(file))}\n${body}`;
  const dest = path.join(outDir, path.basename(file));
  fs.writeFileSync(dest, out);
  converted++;
  console.log(`✓ ${path.basename(file)} -> ${dest}`);
}
console.log(`\n${converted} file(s) converted.`);
