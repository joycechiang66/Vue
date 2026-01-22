# Web 全端開發任務（Vue / Nuxt）

## 🎯 專案目標

使用 JavaScript / TypeScript 技術棧，快速開發現代化 Vue 全端 Web 應用程式。

---

## 🛠️ 核心技術棧

* **前端**：Vue 3 + Nuxt 3（File-based Routing / SSR）
* **後端**：Node.js + Fastify（或 Nuxt Nitro Server）
* **資料庫**：PostgreSQL + Drizzle ORM
* **樣式**：TailwindCSS + shadcn-vue
* **部署**：Vercel（前端）+ Railway（後端）

---

## ✅ 開發需求

### 階段 1：基礎建設

* [ ] 專案初始化（Nuxt 3 + TypeScript）
* [ ] ESLint + Prettier 配置
* [ ] TailwindCSS + shadcn-vue 設置
* [ ] Git 版本控制設定

---

### 階段 2：功能開發

* [ ] 使用者認證系統（JWT）
* [ ] CRUD Server API 端點（Nitro / Fastify）
* [ ] 資料庫 Schema 設計
* [ ] Vue 元件與頁面開發
* [ ] Composables（useXxx）邏輯抽離

---

### 階段 3：優化與部署

* [ ] 性能優化（Lighthouse > 90）
* [ ] SEO 優化（Nuxt Meta / SSR）
* [ ] Docker 容器化
* [ ] CI/CD 自動部署

---

## 🎨 設計原則

1. **效能優先**：Core Web Vitals 達標
2. **型別安全**：全面使用 TypeScript
3. **使用者體驗**：響應式設計、無障礙設計
4. **可維護性**：清晰的目錄結構、Composables 分層、完整註解

---

## 📏 品質標準

* TypeScript 禁止使用 `any`
* ESLint 無警告
* 所有 Server API 具備錯誤處理
* 敏感資料僅使用環境變數（.env）

---

## 🚀 期望成果

一個可部署的、生產級 Vue / Nuxt Web 應用程式，包含：

* 完整前後端原始碼
* 資料庫 Migration
* Docker 設定
* 部署與操作文件
