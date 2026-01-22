---
trigger: always_on
---

# Web 開發風格指南（Vue / Nuxt 3）

## 📁 專案結構

### Nuxt 3 結構

```
my-app/
├── app.config.ts               # Nuxt App 設定
├── nuxt.config.ts              # Nuxt 核心設定
│
├── pages/                      # File-based Routing
│   ├── index.vue               # /
│   ├── login.vue               # /login
│   ├── register.vue            # /register
│   └── dashboard/
│       └── index.vue           # /dashboard
│
├── layouts/                    # Layout 元件
│   ├── default.vue             # 根 Layout
│   └── auth.vue                # 認證 Layout
│
├── components/                 # Vue 元件
│   ├── ui/                     # shadcn-vue 元件
│   ├── forms/                  # 表單元件
│   └── layouts/                # 版面元件
│
├── composables/                # Composables（Hooks）
│   └── useUser.ts
│
├── server/
│   ├── api/                    # API Routes
│   │   └── users.post.ts
│   └── utils/                  # Server-side 工具
│
├── lib/                        # 共用工具
│   ├── db.ts                   # 資料庫連線
│   ├── auth.ts                 # 認證邏輯
│   └── utils.ts                # 通用工具
│
├── types/                      # TypeScript 型別
│   └── index.ts
│
└── public/                     # 靜態資源
    └── images/
```

---

## 🎨 命名規範

### 檔案命名

* Vue 元件：`PascalCase.vue`（UserProfile.vue）
* Composables：`useXxx.ts`（useUser.ts）
* API 路由：`*.get.ts / *.post.ts`
* 樣式：`kebab-case.css`（user-profile.css）

### 變數命名

```ts
// ✅ 推薦
const userName = 'Jimmy'
const isLoggedIn = true
const fetchUserData = async () => {}
const UserProfileCard = defineComponent({})

// ❌ 避免
const user_name = 'Jimmy'
const is_logged_in = true
const x = async () => {}
```

---

## 🧩 Vue 元件風格

### Vue 元件範本（`<script setup>`）

```vue
<script setup lang="ts">
interface UserCardProps {
  name: string
  email: string
  avatarUrl?: string
}

defineProps<UserCardProps>()
</script>

<template>
  <div class="rounded-lg border p-4">
    <img
      v-if="avatarUrl"
      :src="avatarUrl"
      :alt="`${name} 的頭像`"
      class="h-12 w-12 rounded-full"
    />
    <h3 class="text-lg font-semibold">{{ name }}</h3>
    <p class="text-sm text-gray-600">{{ email }}</p>
  </div>
</template>
```

---

### Composable 範本

```ts
import { ref, watchEffect } from 'vue'

export function useUser(userId: string) {
  const user = ref<User | null>(null)
  const loading = ref(true)
  const error = ref<Error | null>(null)

  watchEffect(async () => {
    loading.value = true
    try {
      user.value = await fetchUser(userId)
    } catch (err) {
      error.value = err as Error
    } finally {
      loading.value = false
    }
  })

  return { user, loading, error }
}
```

---

## 🔌 API 開發風格

### Nuxt Server API 範本

```ts
import { z } from 'zod'

const CreateUserSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8),
})

type CreateUserDTO = z.infer<typeof CreateUserSchema>

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<CreateUserDTO>(event)
    const data = CreateUserSchema.parse(body)

    const user = await createUser(data)

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        message: '輸入驗證失敗',
      })
    }

    throw createError({
      statusCode: 500,
      message: '伺服器錯誤',
    })
  }
})
```

---

## 🗄️ 資料庫風格

### Drizzle ORM Schema

```ts
import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
```

---

## 🎯 TypeScript 最佳實踐

### 型別定義

```ts
interface User {
  id: number
  name: string
  email: string
}

type UserRole = 'admin' | 'user' | 'guest'
type ApiResponse<T> = { data: T } | { error: string }

function processData(data: unknown) {
  if (typeof data === 'string') {
    // data is string
  }
}
```

---

## 📦 套件版本建議（2025年12月）

```json
{
  "dependencies": {
    "nuxt": "^3.14.0",
    "vue": "^3.5.0",
    "fastify": "^5.2.0",
    "drizzle-orm": "^0.36.0",
    "zod": "^3.24.0",
    "@tanstack/vue-query": "^5.62.0"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "eslint": "^9.17.0",
    "prettier": "^3.4.2",
    "vitest": "^3.0.0"
  }
}
```
