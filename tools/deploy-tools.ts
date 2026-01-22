import path from 'node:path'
import { writeFileSafe } from './_fs.js'

export type DockerOptions = {
  nodeVersion?: string
  packageManager?: 'npm' | 'pnpm' | 'yarn'
  appPort?: number
}

/**
 * 生成 Dockerfile（Nuxt 3）
 * @param projectRoot - 專案根目錄
 * @param options - Docker 選項
 * @returns 生成檔案的絕對路徑
 */
export async function generateDockerfile(
  projectRoot: string,
  options: DockerOptions = {}
): Promise<string> {
  const nodeVersion = options.nodeVersion ?? '20'
  const pm = options.packageManager ?? 'npm'
  const appPort = options.appPort ?? 3000

  const installCmd =
    pm === 'pnpm'
      ? 'corepack enable && pnpm i --frozen-lockfile'
      : pm === 'yarn'
        ? 'corepack enable && yarn install --frozen-lockfile'
        : 'npm ci'

  const runCmd =
    pm === 'pnpm' ? 'pnpm run build' : pm === 'yarn' ? 'yarn build' : 'npm run build'

  const startCmd =
    pm === 'pnpm' ? 'pnpm run start' : pm === 'yarn' ? 'yarn start' : 'npm run start'

  const filePath = path.join(projectRoot, 'Dockerfile')

  const content = `  FROM node:${nodeVersion}-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN ${installCmd}

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN ${runCmd}

FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/.output ./.output
COPY --from=build /app/package.json ./package.json

EXPOSE ${appPort}
CMD ["node", ".output/server/index.mjs"]
`
  return writeFileSafe(filePath, content.trim() + '\n', { overwrite: true })
}

/**
 * 生成 docker-compose.yml
 * @param projectRoot - 專案根目錄
 * @param appPort - 對外 port
 * @returns 生成檔案的絕對路徑
 */
export async function generateDockerCompose(
  projectRoot: string,
  appPort = 3000
): Promise<string> {
  const filePath = path.join(projectRoot, 'docker-compose.yml')
  const content = `  services:
  web:
    build: .
    ports:
      - "${appPort}:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
`
  return writeFileSafe(filePath, content.trim() + '\n', { overwrite: true })
}

/**
 * 生成 GitHub Actions workflow（CI）
 * @param projectRoot - 專案根目錄
 * @returns 生成檔案的絕對路徑
 */
export async function generateGithubWorkflow(
  projectRoot: string
): Promise<string> {
  const filePath = path.join(projectRoot, '.github', 'workflows', 'ci.yml')
  const content = `  name: ci

on:
  push:
    branches: [ "main" ]
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run typecheck --if-present
      - run: npm run lint --if-present
      - run: npm run test --if-present
      - run: npm run build
`
  return writeFileSafe(filePath, content.trim() + '\n', { overwrite: true })
}
