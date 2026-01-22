import path from 'node:path'
import { writeFileSafe, toKebabCase } from './_fs.js'

export type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete'

export type NitroRouteOptions = {
  route: string             // 例如 /api/users 或 /api/users/[id]
  method: HttpMethod        // get/post/...
  zodSchemaName?: string    // 例如 CreateUserSchema
  dtoTypeName?: string      // 例如 CreateUserDTO
}

/**
 * 生成 Nuxt Server API Route（server/api/*.ts）
 * @param projectRoot - 專案根目錄
 * @param options - 路由選項
 * @returns 生成檔案的絕對路徑
 */
export async function generateNitroApiRoute(
  projectRoot: string,
  options: NitroRouteOptions
): Promise<string> {
  const route = options.route.replace(/^\/+/, '')
  const method = options.method.toLowerCase() as HttpMethod

  const parts = route.split('/').filter(Boolean)
  if (parts[0] !== 'api') {
    throw new Error('route 必須以 /api 開頭（例如 /api/users）')
  }

  const fileBase = parts.slice(1).join('/') || 'index'
  const filePath = path.join(projectRoot, 'server', 'api', `${fileBase}.${method}.ts`)

  const schemaName = options.zodSchemaName ?? 'Schema'
  const dtoType = options.dtoTypeName ?? 'DTO'

  const content = `  import { z } from 'zod'

const ${schemaName} = z.object({
  // TODO: 定義輸入驗證
})

type ${dtoType} = z.infer<typeof ${schemaName}>

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<${dtoType}>(event)
    const data = ${schemaName}.parse(body)

    // TODO: 商業邏輯
    return { ok: true, data }
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({ statusCode: 400, message: '輸入驗證失敗' })
    }
    throw createError({ statusCode: 500, message: '伺服器錯誤' })
  }
})
`
  return writeFileSafe(filePath, content.trim() + '\n')
}
