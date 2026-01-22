import path from 'node:path'
import { writeFileSafe, toPascalCase } from './_fs.js'

export type PropDefinition = {
  name: string
  type: string
  optional?: boolean
  defaultValue?: string
}

/**
 * 生成 Vue 元件檔案（components）
 * @param projectRoot - 專案根目錄
 * @param componentName - 元件名稱（PascalCase）
 * @param props - Props 定義
 * @param subdir - 子目錄（例如 ui/forms/layouts）
 * @returns 生成檔案的絕對路徑
 */
export async function generateVueComponent(
  projectRoot: string,
  componentName: string,
  props: PropDefinition[] = [],
  subdir = ''
): Promise<string> {
  const name = toPascalCase(componentName)
  const rel = path.join('components', subdir, `${name}.vue`)
  const filePath = path.join(projectRoot, rel)

  const propsInterface = props.length
    ? `interface ${name}Props {\n${props
        .map((p) => `  ${p.name}${p.optional ? '?' : ''}: ${p.type}`)
        .join('\n')}\n}`
    : `interface ${name}Props {}`

  const definePropsBlock = `defineProps<${name}Props>()`

  const content = `  <script setup lang="ts">
${propsInterface}

${definePropsBlock}
</script>

<template>
  <div class="rounded-lg border p-4">
    <!-- ${name} -->
    <slot />
  </div>
</template>
`
  return writeFileSafe(filePath, content.trim() + '\n')
}

/**
 * 生成 Nuxt Page 檔案（pages）
 * @param projectRoot - 專案根目錄
 * @param routePath - 路由路徑（例如 /dashboard、/users/[id]）
 * @param pageTitle - 頁面標題
 * @returns 生成檔案的絕對路徑
 */
export async function generateNuxtPage(
  projectRoot: string,
  routePath: string,
  pageTitle: string
): Promise<string> {
  const normalized = routePath.replace(/^\/+/, '').replace(/\/+$/, '')
  const rel = normalized ? path.join('pages', normalized + '.vue') : path.join('pages', 'index.vue')
  const filePath = path.join(projectRoot, rel)

  const content = `  <script setup lang="ts">
useHead({
  title: ${JSON.stringify(pageTitle)},
})
</script>

<template>
  <main class="mx-auto max-w-5xl p-6">
    <h1 class="text-2xl font-semibold">${pageTitle}</h1>
    <p class="mt-2 text-sm text-gray-600">Nuxt 3 Page</p>
  </main>
</template>
`
  return writeFileSafe(filePath, content.trim() + '\n')
}

/**
 * 生成 Nuxt Layout 檔案（layouts）
 * @param projectRoot - 專案根目錄
 * @param layoutName - layout 名稱（default / auth / etc）
 * @returns 生成檔案的絕對路徑
 */
export async function generateNuxtLayout(
  projectRoot: string,
  layoutName: string
): Promise<string> {
  const safe = layoutName.trim() || 'default'
  const rel = path.join('layouts', `${safe}.vue`)
  const filePath = path.join(projectRoot, rel)

  const content = `  <template>
  <div class="min-h-dvh">
    <header class="border-b">
      <div class="mx-auto flex max-w-5xl items-center justify-between p-4">
        <div class="text-sm font-semibold">Antigravity</div>
        <nav class="text-sm text-gray-600">
          <NuxtLink to="/" class="hover:underline">Home</NuxtLink>
        </nav>
      </div>
    </header>

    <div class="mx-auto max-w-5xl p-6">
      <slot />
    </div>
  </div>
</template>
`
  return writeFileSafe(filePath, content.trim() + '\n')
}
