import { inflateRawSync, inflateSync } from 'node:zlib'
import { readFileSync } from 'node:fs'

// ---- Minimal ZIP / DOCX reader (no dependencies) ----

function parseCentralDirectory(zipBuf) {
  const eocd = zipBuf.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]))
  if (eocd < 0) throw new Error('not a zip (no EOCD)')
  const count = zipBuf.readUInt16LE(eocd + 10)
  const cdOffset = zipBuf.readUInt32LE(eocd + 16)
  const entries = new Map()
  let p = cdOffset
  for (let i = 0; i < count; i++) {
    if (zipBuf.readUInt32LE(p) !== 0x02014b50) break
    const method = zipBuf.readUInt16LE(p + 10)
    const compSize = zipBuf.readUInt32LE(p + 20)
    const uncompSize = zipBuf.readUInt32LE(p + 24)
    const nameLen = zipBuf.readUInt16LE(p + 28)
    const extraLen = zipBuf.readUInt16LE(p + 30)
    const commentLen = zipBuf.readUInt16LE(p + 32)
    const localOffset = zipBuf.readUInt32LE(p + 42)
    const name = zipBuf.toString('utf8', p + 46, p + 46 + nameLen)
    entries.set(name, { method, compSize, uncompSize, localOffset })
    p += 46 + nameLen + extraLen + commentLen
  }
  return entries
}

function readLocalEntry(zipBuf, entry) {
  const p = entry.localOffset
  if (zipBuf.readUInt32LE(p) !== 0x04034b50) throw new Error('bad local header')
  const nameLen = zipBuf.readUInt16LE(p + 26)
  const extraLen = zipBuf.readUInt16LE(p + 28)
  const dataStart = p + 30 + nameLen + extraLen
  const slice = zipBuf.subarray(dataStart, dataStart + entry.compSize)
  if (entry.method === 0) return Buffer.from(slice)
  if (entry.method === 8) return inflateRawSync(slice, { maxOutputLength: 256 * 1024 * 1024 })
  throw new Error(`unsupported zip method ${entry.method}`)
}

export function docxToText(file) {
  const zipBuf = readFileSync(file)
  const entries = parseCentralDirectory(zipBuf)
  const xmlEntry = entries.get('word/document.xml')
  if (!xmlEntry) throw new Error('no word/document.xml in docx')
  const xml = readLocalEntry(zipBuf, xmlEntry).toString('utf8')
  return xml
    .replace(/<w:tab[^>]*\/>/g, '\t')
    .replace(/<\/w:p>/g, '\n')
    .replace(/<w:br[^>]*\/>/g, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'")
    .trim()
}

// ---- Best-effort PDF text extractor (compressed & plain content streams) ----

function decodeStream(raw) {
  if (raw.length > 2 && (raw[0] === 0x78) && (raw[1] === 0x9c || raw[1] === 0xda || raw[1] === 0x01)) {
    try { return inflateSync(raw) } catch { try { return inflateRawSync(raw) } catch { return null } }
  }
  if (raw.length > 1 && (raw[0] & 0x0f) === 0x08) {
    try { return inflateRawSync(raw) } catch { return null }
  }
  return raw
}

function decodeContentString(s) {
  let out = ''
  for (let i = 0; i < s.length; i++) {
    const c = s[i]
    if (c === '\\') {
      const n = s[i + 1] ?? ''
      if (n >= '0' && n <= '7') {
        let oct = ''
        for (let k = 0; k < 3 && s[i + 1 + k] >= '0' && s[i + 1 + k] <= '7'; k++) oct += s[i + 1 + k]
        if (oct) { out += String.fromCharCode(parseInt(oct, 8)); i += oct.length + 0 } else { out += n; i++ }
      } else {
        out += ({ n: '\n', r: '\r', t: '\t', b: '\b', f: '\f', ')': ')', '(': '(', '\\': '\\' }[n] ?? n)
        i++
      }
    } else if (c === ')') return out
    else out += c
  }
  return out
}

function stringFromText(decodedBuf) {
  const s = decodedBuf.toString('latin1')
  const parts = []
  const re = /\(((?:\\.|[^\\()])*)\)/g
  let m
  while ((m = re.exec(s)) !== null && parts.length < 12000) {
    const after = s.slice(m.index + m[0].length).replace(/^\s+/, '')
    if (after.startsWith('Tj') || after.startsWith('TJ') || after.startsWith("'") || after.startsWith('"')) {
      parts.push(decodeContentString(m[1]))
    }
  }
  return parts.join(' ')
}

export function pdfToText(file) {
  const buf = readFileSync(file)
  const src = buf.toString('latin1')
  const out = []
  const streamRe = /stream\r?\n/g
  let m
  while ((m = streamRe.exec(src)) !== null) {
    const start = m.index + m[0].length
    const end = src.indexOf('endstream', start)
    if (end < 0) break
    const raw = buf.subarray(start, end)
    const dec = readStreamDecoded(raw)
    if (!dec) continue
    const text = stringFromText(dec)
    if (text.trim()) out.push(text)
    streamRe.lastIndex = end
  }
  return out.join('\n')
}

function readStreamDecoded(raw) {
  const dec = decodeStream(raw)
  return Buffer.isBuffer(dec) ? dec : null
}

export function docxOrPdfText(file, ext) {
  if (ext === 'docx') return docxToText(file)
  if (ext === 'pdf') return pdfToText(file)
  return null
}