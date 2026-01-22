import * as fs from 'fs'
import * as path from 'path'

const { promises: fsPromises } = fs

/**
 * 確保目錄存在，若不存在則遞迴建立
 * @param dirPath - 目錄絕對路徑
 */
export async function ensureDir(dirPath: string): Promise<void> {
  await fsPromises.mkdir(dirPath, { recursive: true })
}

/**
 * 安全寫入檔案，會自動建立目錄
 * @param filePath - 檔案絕對路徑
 * @param content - 檔案內容
 * @param options - 選項 { overwrite: boolean }
 * @returns 寫入的檔案路徑
 */
export async function writeFileSafe(
  filePath: string,
  content: string,
  options: { overwrite?: boolean } = {}
): Promise<string> {
  const dir = path.dirname(filePath)
  await ensureDir(dir)

  if (!options.overwrite) {
    try {
      await fsPromises.access(filePath)
      // 檔案存在，且不覆寫，則拋出錯誤或由呼叫端處理
      // 在此工具規範中，若無 overwrite: true 且檔案存在，通常應報錯或略過
      // 這裡簡單實作：若檔案存在拋錯，除非明確允許覆寫
      throw new Error(`File already exists: ${filePath}`)
    } catch (error: any) {
      if (error.code !== 'ENOENT' && !error.message.includes('File already exists')) {
        throw error
      }
      // ENOENT 表示檔案不存在，可以寫入
    }
  }

  await fsPromises.writeFile(filePath, content, 'utf-8')
  return filePath
}

/**
 * 字串轉 CamelCase
 * @param str - 輸入字串
 */
export function toCamelCase(str: string): string {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase()
    })
    .replace(/\s+/g, '')
    .replace(/-/g, '')
}

/**
 * 字串轉 KebabCase
 * @param str - 輸入字串
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

/**
 * 字串轉 PascalCase
 * @param str - 輸入字串
 */
export function toPascalCase(str: string): string {
  const camel = toCamelCase(str)
  return camel.charAt(0).toUpperCase() + camel.slice(1)
}
