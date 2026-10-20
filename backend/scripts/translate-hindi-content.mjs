import fs from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const files = [
  'frontend/src/data/scienceQuestions.js',
  'frontend/src/data/socialScienceQuestions.js',
  'frontend/src/data/questionPool.js',
  'frontend/src/data/rbseVerifiedData.js',
  ...await walk('frontend/public/content'),
]
const cache = new Map()

async function walk(relative) {
  const dir = path.join(root, relative)
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const result = []
  for (const entry of entries) {
    const child = path.join(relative, entry.name)
    if (entry.isDirectory()) result.push(...await walk(child))
    else if (entry.name.endsWith('.md')) result.push(child)
  }
  return result
}

async function translate(text) {
  if (!/[\u0900-\u097F]/.test(text)) return text
  if (cache.has(text)) return cache.get(text)
  const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=hi&tl=en&dt=t&q=' + encodeURIComponent(text)
  const response = await fetch(url)
  if (!response.ok && text.length > 1200) {
    const midpoint = text.lastIndexOf(' ', Math.floor(text.length / 2))
    const splitAt = midpoint > 0 ? midpoint : Math.floor(text.length / 2)
    const result = `${await translate(text.slice(0, splitAt))}${await translate(text.slice(splitAt))}`
    cache.set(text, result)
    return result
  }
  if (!response.ok) return text
  const data = await response.json()
  const result = (data[0] || []).map((part) => part[0] || '').join('') || text
  cache.set(text, result)
  await new Promise((resolve) => setTimeout(resolve, 80))
  return result
}

function quote(value, mark) {
  const escaped = value.replaceAll('\\', '\\\\').replaceAll(mark, `\\${mark}`).replaceAll('\r', '\\r').replaceAll('\n', '\\n')
  return `${mark}${escaped}${mark}`
}

for (const relative of files) {
  const filename = path.join(root, relative)
  let source = await fs.readFile(filename, 'utf8')
  const token = /(\"(?:\\.|[^\"\\])*\"|'(?:\\.|[^'\\])*')/g
  const matches = [...source.matchAll(token)].map((match) => match[0])
  const rawValues = [...new Set(matches.filter((raw) => /[\u0900-\u097F]/.test(raw.slice(1, -1))))]
  for (let index = 0; index < rawValues.length; index += 20) {
    await Promise.all(rawValues.slice(index, index + 20).map((raw) => translate(raw.slice(1, -1))))
    process.stdout.write(`\\r${relative}: ${Math.min(index + 20, rawValues.length)}/${rawValues.length}`)
  }
  for (const raw of rawValues) {
    const mark = raw[0]
    const translated = cache.get(raw.slice(1, -1)) || raw.slice(1, -1)
    source = source.replace(raw, quote(translated, mark))
  }
  if (relative.endsWith('.md')) {
    const lines = source.split(/(\r?\n)/)
    const lineIndexes = []
    for (let index = 0; index < lines.length; index += 2) {
      if (/[\u0900-\u097F]/.test(lines[index])) lineIndexes.push(index)
    }
    await Promise.all(lineIndexes.map(async (index) => { lines[index] = await translate(lines[index]) }))
    source = lines.join('')
  }
  await fs.writeFile(filename, source)
  console.log(`translated ${relative}`)
}

