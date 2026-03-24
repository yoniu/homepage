# 重构蓝图（去 Hashnode GraphQL + 去 V1 样式）

> 目标：在不影响核心功能（首页流、详情、登录、后台、编辑）的前提下，移除不需要能力并提升可维护性。

## 1. 重构目标与边界

1. **统一到 V2 架构**：仅保留 `src/app/page.tsx` + `src/components/moments/v2/...` 主链路。
2. **移除 Hashnode GraphQL**：删除 `graphql-hooks`、`GraphQLClient`、`Articles` 模块及引用。
3. **移除 V1 路由/样式心智**：删除 `src/app/v1/*` 并清理遗留引用。
4. **接口层模块化**：把页面内散落的请求抽离到 `features/*/api.ts`。
5. **错误处理统一**：抽出 `normalizeApiError`，减少重复 `Array.isArray(message)`。

---

## 2. 目标目录结构（建议）

```txt
src/
  app/
    layout.tsx
    page.tsx
    moment/page.tsx
    admin/page.tsx
    editor/page.tsx
    # 删除 app/v1/*
  features/
    moment/
      api.ts
      hooks/
        useMomentFeed.ts
      components/
        Feed.tsx
        Detail.tsx
    editor/
      api.ts
      hooks/
        useEditorInit.ts
      components/
        ...
    auth/
      api.ts
      hooks/
        useAuth.ts
  shared/
    api/
      client.ts
      result.ts
      error.ts
    config/
    ui/
```

---

## 3. 分阶段实施方案

## Phase 1：减法先行（1~2 天）

- 删除 `src/app/v1/*`。
- Sidebar 移除 `graphql-hooks` Provider 与 `<Articles />` 渲染。
- 删除 `src/components/articles/index.tsx`（或先保留文件但停止引用）。
- 从 `package.json` 删除 `graphql-hooks` 依赖。
- 如有对外 `v1` 链接，增加 `/v1 -> /` redirect。

**验收标准**
- `pnpm dev` 可启动。
- `/`、`/moment`、`/admin`、`/editor` 页面正常。
- 控制台无 GraphQL 相关错误。

## Phase 2：接口层收敛（2~3 天）

### 新建 `features/moment/api.ts`
- `getPublicMoments(page, pageSize)`
- `getPublicMomentById(id)`
- `getOwnerMoment(id)`
- `createMoment()`
- `updateMoment(id, payload)`
- `deleteMoment(id)`

### 新建 `features/editor/api.ts`
- `uploadFile(formData, options)`
- `deleteFile(id)`
- `getMomentFiles(id)`
- `getLocationByIp(ip)`
- `searchLocation(keyword, city)`

### 新建 `features/auth/api.ts`
- `login(payload)`
- `logout()`
- `logged()`（可过渡期保留）

**验收标准**
- URL 只在 service 层出现。
- 页面组件不直接写后端路径。
- 所有请求仍使用统一 `axiosInstance`。

## Phase 3：逻辑抽 Hook（2~4 天）

- 新建 `useMomentFeed`，承载分页拉流、预加载、loading 状态。
- 新建 `useEditorInit`，承载登录守卫、id 检查、草稿创建、详情加载。
- 抽出 `normalizeApiError(messageApi, err)`。
- 页面仅保留视图渲染与事件绑定。

**验收标准**
- 关键页面文件体积明显下降。
- 重复逻辑减少，行为一致。

## Phase 4：布局与样式统一（1~2 天）

- 统一仅使用 V2 布局语义。
- 清理遗留 V1 class/样式片段。
- 统计脚本（如 51LA）改为 env 开关控制。

**验收标准**
- 全站视觉一致。
- 无 V1 路由入口。
- 统计脚本按开关生效。

---

## 4. 任务清单（可用于项目管理）

## Epic A：移除不需要能力
- [ ] A1 删除 `src/app/v1/*`。
- [ ] A2 Sidebar 删除 GraphQL Provider。
- [ ] A3 删除/下线 `Articles` 组件。
- [ ] A4 `package.json` 移除 `graphql-hooks`。
- [ ] A5 README 同步移除 Hashnode 说明。

## Epic B：接口层重构
- [ ] B1 新建 `features/moment/api.ts` 并迁移 moment 接口。
- [ ] B2 新建 `features/editor/api.ts` 并迁移 file/location 接口。
- [ ] B3 新建 `features/auth/api.ts` 并迁移登录接口。
- [ ] B4 引入 `shared/api/error.ts` 统一错误处理。

## Epic C：逻辑抽离
- [ ] C1 `useMomentFeed` 替换首页拉流逻辑。
- [ ] C2 `useEditorInit` 替换编辑页初始化逻辑。
- [ ] C3 删除页面中的重复 catch 分支。
- [ ] C4 增加关键 hooks/service 的 smoke 测试。

## Epic D：样式收敛
- [ ] D1 统一布局样式变量。
- [ ] D2 Sidebar/Menu 视觉规范统一。
- [ ] D3 清理死代码与无用样式文件。

## Epic E：回归与发布
- [ ] E1 回归：首页、详情、登录、后台、编辑、上传、定位。
- [ ] E2 验证 `/v1` 重定向策略。
- [ ] E3 更新 README 与开发文档。

---

## 5. 风险与回滚策略

### 主要风险
- 删除 `/v1` 可能导致旧收藏链接 404。
- 删除 GraphQL 时如果仍保留 `<Articles />` 渲染，会产生运行时错误。
- 接口迁移过程可能出现类型不一致。

### 回滚策略
- 每个 Phase 独立 commit。
- 每次只改一类（路由/依赖/服务/hook），确保可回滚。
- 关键里程碑打 tag（如 `refactor-phase1-done`）。

---

## 6. 建议提交顺序（示例）

1. `chore(remove-v1): drop /v1 route and add redirects`
2. `chore(remove-hashnode): remove graphql provider/articles`
3. `refactor(api): extract moment/editor/auth services`
4. `refactor(hooks): add useMomentFeed and useEditorInit`
5. `refactor(ui): simplify page components`
6. `docs: update README and migration notes`
