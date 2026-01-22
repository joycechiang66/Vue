import path from 'node:path'
import { writeFileSafe, toCamelCase, toKebabCase, toPascalCase, ensureDir } from './_fs.js'
import { promises as fs } from 'node:fs'

export type ColumnDef =
  | { name: string; kind: 'serialPk' }
  | { name: string; kind: 'varchar'; length: number; notNull?: boolean; unique?: boolean }
  | { name: string; kind: 'text'; notNull?: boolean }
  | { name: string; kind: 'timestamp'; defaultNow?: boolean }

export type SchemaOptions = {
  tableName: string
  fileName?: string // 預設使用 tableName
  columns: ColumnDef[]
  withTimestamps?: boolean
}

/**
 * 生成 Drizzle schema 檔案（lib/db/schema/*.ts）
 * @param projectRoot - 專案根目錄
 * @param options - schema 選項
 * @returns 生成檔案的絕對路徑
 */
export async function generateDrizzleSchema(
  projectRoot: string,
  options: SchemaOptions
): Promise<string> {
  const file = (options.fileName ?? options.tableName).trim()
  const rel = path.join('lib', 'db', 'schema', `${toKebabCase(file)}.ts`)
  const filePath = path.join(projectRoot, rel)

  const imports = new Set<string>(['pgTable'])
  const colLines: string[] = []

  for (const c of options.columns) {
    if (c.kind === 'serialPk') {
      imports.add('serial')
      colLines.push(`  ${c.name}: serial('${toKebabCase(c.name)}').primaryKey(),`)
    } else if (c.kind === 'varchar') {
      imports.add('varchar')
      const mods: string[] = []
      mods.push(`varchar('${toKebabCase(c.name)}', { length: ${c.length} })`)
      if (c.notNull) mods.push('notNull()')
      if (c.unique) mods.push('unique()')
      colLines.push(`  ${c.name}: ${mods.join('.')},`)
    } else if (c.kind === 'text') {
      imports.add('text')
      const mods: string[] = []
      mods.push(`text('${toKebabCase(c.name)}')`)
      if (c.notNull) mods.push('notNull()')
      colLines.push(`  ${c.name}: ${mods.join('.')},`)
    } else if (c.kind === 'timestamp') {
      imports.add('timestamp')
      const mods: string[] = []
      mods.push(`timestamp('${toKebabCase(c.name)}')`)
      if (c.defaultNow) mods.push('defaultNow()')
      colLines.push(`  ${c.name}: ${mods.join('.')},`)
    }
  }

  if (options.withTimestamps) {
    imports.add('timestamp')
    if (!colLines.some((l) => l.includes('createdAt'))) {
      colLines.push(`  createdAt: timestamp('created_at').defaultNow(),`)
    }
    if (!colLines.some((l) => l.includes('updatedAt'))) {
      colLines.push(`  updatedAt: timestamp('updated_at').defaultNow(),`)
    }
  }

  const tableConst = toCamelCase(options.tableName)
  const typeName = toPascalCase(options.tableName)

  const content = `  import { ${Array.from(imports).sort().join(', ')} } from 'drizzle-orm/pg-core'

/**
 * ${options.tableName} 資料表
 */
export const ${tableConst} = pgTable('${options.tableName}', {
${colLines.join('\n')}
})

export type ${typeName} = typeof ${tableConst}.$inferSelect
export type New${typeName} = typeof ${tableConst}.$inferInsert
`
  return writeFileSafe(filePath, content.trim() + '\n')
}

/**
 * 生成 Migration stub（drizzle/migrations）
 * @param projectRoot - 專案根目錄
 * @param name - migration 名稱（英文或中文皆可）
 * @returns 生成檔案的絕對路徑
 */
export async function generateMigrationStub(
  projectRoot: string,
  name: string
): Promise<string> {
  const ts = new Date()
  const stamp = `${ts.getFullYear()}${String(ts.getMonth() + 1).padStart(2, '0')}${String(ts.getDate()).padStart(2, '0')}${String(ts.getHours()).padStart(2, '0')}${String(ts.getMinutes()).padStart(2, '0')}${String(ts.getSeconds()).padStart(2, '0')}`
  const safeName = toKebabCase(name || 'migration')
  const relDir = path.join('drizzle', 'migrations')
  const outDir = path.join(projectRoot, relDir)
  await ensureDir(outDir)

  const filePath = path.join(outDir, `${stamp}_${safeName}.sql`)
  const content = `-- ${name}
-- TODO: 寫入 SQL migration
`
  return writeFileSafe(filePath, content.trim() + '\n')
}
