import path from 'node:path'
import { writeFileSafe, toCamelCase } from './_fs.js'

export type ComposableOption = {
  name: string
  description?: string
  returnShape?: string
}

/**
 * 生成 Composable（composables/useXxx.ts）
 * @param projectRoot - 專案根目錄
 * @param composableName - Composable 名稱（useUser / user 皆可）
 * @param options - 客製化選項
 * @returns 生成檔案的絕對路徑
 */
export async function generateComposable(
  projectRoot: string,
  composableName: string,
  options: ComposableOption = { name: '' }
): Promise<string> {
  const raw = composableName.startsWith('use') ? composableName : `use${composableName}`
  const fnName = toCamelCase(raw)
  const rel = path.join('composables', `${fnName}.ts`)
  const filePath = path.join(projectRoot, rel)

  const returnShape = options.returnShape ?? '{ data, loading, error }'

  const content = `  import { ref } from 'vue'

/**
 * ${options.description ?? 'Composable'}
 */
export function ${fnName}() {
  const data = ref<unknown>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  async function run<T>(task: () => Promise<T>) {
    loading.value = true
    error.value = null
    try {
      const result = await task()
      data.value = result
      return result
    } catch (err) {
      error.value = err as Error
      throw err
    } finally {
      loading.value = false
    }
  }

  return ${returnShape}
}
`
  return writeFileSafe(filePath, content.trim() + '\n')
}
