# Antigravity Vue Tools (PRD 產生器)

這是一個基於 **Nuxt 3** 與 **Vue 3** 的現代化全端 Web 應用開發工具集。專為快速構建高品質、效能優異的生產級應用而設計。

## 🎯 專案目標

使用 JavaScript / TypeScript 技術棧，提供一套標準化、自動化的開發流程，包含前端 UI 組件生成、後端 API 構建以及資料庫整合方案。

## 🛠️ 核心技術棧

### 前端 (Frontend)
- **Framework**: [Nuxt 3](https://nuxt.com)
- **UI Library**: [Vue 3](https://vuejs.org) (Composition API)
- **Styling**: [TailwindCSS](https://tailwindcss.com) + [shadcn-vue](https://www.shadcn-vue.com)
- **State Management**: [Pinia](https://pinia.vuejs.org)

### 後端 (Backend)
- **Runtime**: Node.js
- **Server**: [Fastify](https://fastify.dev) 或 Nuxt Nitro
- **Database**: PostgreSQL
- **ORM**: [Drizzle ORM](https://orm.drizzle.team)

### 開發工具 (Dev Tools)
- **Language**: TypeScript 5.7+
- **Linter**: ESLint + Prettier
- **Test**: Vitest

## 🚀 快速開始 (Getting Started)

### 前置需求
- Node.js (建議 v20 以上)
- npm 或 pnpm

### 安裝依賴

```bash
npm install
```

### 啟動開發伺服器

```bash
npm run dev
```

開發伺服器將啟動於 http://localhost:3000

## 📂 專案結構

- `.context/`: 專案上下文與規範文件
- `tools/`: 自動化生成工具 (Components, APIs, Database Schemas)
- `plans/`: 開發計畫文件
- `mission.md`: 專案核心任務說明

## 📝 授權

MIT License
