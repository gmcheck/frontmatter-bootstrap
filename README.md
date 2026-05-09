# Frontmatter Bootstrap

一个极简、稳定的 Obsidian metadata 基础设施插件。

## 功能

### 自动插入 Frontmatter 模板

创建新的空 Markdown 笔记时，自动插入统一的 YAML frontmatter：

```yaml
---
type: note
domain:
status: active
created: 2026-05-09
updated: 2026-05-09
source: personal
tags:
---
```

**触发条件**（全部满足才触发）：
- 文件是 `.md` 扩展名
- 文件内容完全为空
- 文件没有已有 frontmatter

### 自动更新日期

文件保存时，自动更新 `updated` 字段为当前日期。

- 只更新 `updated`，不会动 `created`
- 只操作 frontmatter，不修改正文
- 如果文件没有 `updated` 字段，不会添加
- 内置 500ms 防抖，避免频繁写入

### Metadata 健康检查

手动执行检查，发现笔记中的 metadata 问题：

- 缺少必填字段（type、status、created、updated）
- 枚举值不合法
- 日期格式错误（非 YYYY-MM-DD）
- 可能的拼写错误（`statu` → `status`）

检查结果生成报告文件，不会修改任何笔记。

## 安装

### 社区插件市场

1. 打开 Obsidian 设置 → 第三方插件
2. 关闭"安全模式"
3. 点击"浏览"社区插件
4. 搜索 "Frontmatter Bootstrap"
5. 安装并启用

### 手动安装

1. 下载最新版本的 `main.js`、`manifest.json`
2. 创建文件夹 `.obsidian/plugins/frontmatter-bootstrap/`
3. 将文件复制到该文件夹
4. 重启 Obsidian
5. 在设置中启用插件

## 使用

### 基本使用

安装启用后，创建新的 Markdown 文件，frontmatter 会自动插入。

### 健康检查

1. 打开命令面板（`Ctrl/Cmd + P`）
2. 输入 `Metadata Health Check`
3. 选择检查范围：
   - **Current Note** — 当前笔记
   - **Current Folder** — 当前文件夹（含子文件夹）
   - **Entire Vault** — 整个仓库

### 自定义设置

在 **Obsidian 设置 → 第三方插件 → Frontmatter Bootstrap** 中：

**默认值**
- Default type — 笔记类型默认值（note / project）
- Default status — 状态默认值（active / done / archived）
- Default source — 来源默认值（personal / external）

**功能开关**
- Enable created field — 插入 `created` 字段
- Enable updated field — 插入 `updated` 字段
- Auto-update modified date — 保存时自动更新 `updated`

**自定义 domain**
- Domain vocabulary — 逗号分隔，定义合法 domain 值

**自定义模板**
- Custom YAML template — 完全自定义 frontmatter 内容
- 支持 `{{date}}` 变量，替换为当天日期（YYYY-MM-DD）

示例：
```
type: project
status: active
created: {{date}}
priority: high
```

> 设置自定义模板后，默认值设置将不再生效。

## 字段说明

| 字段 | 类型 | 说明 | 允许值 |
|------|------|------|--------|
| `type` | Select | 笔记类型 | note / project |
| `domain` | Text | 领域分类 | Domain vocabulary 中定义 |
| `status` | Select | 状态 | active / done / archived |
| `created` | Date | 创建日期 | YYYY-MM-DD |
| `updated` | Date | 更新日期 | YYYY-MM-DD |
| `source` | Select | 来源 | personal / external |
| `tags` | Tags | 标签 | 自由文本 |

预设 domain：music, bigdata, aigc, ecommerce, programming, finance, system

## 与 Dataview 配合

```dataview
TABLE type, status, created
WHERE type = "project" AND status = "active"
SORT created DESC
```

```dataview
LIST
WHERE domain = "programming" AND status != "archived"
```

## 安全原则

- ✅ 只处理新建的空文件
- ✅ 不覆盖已有 frontmatter
- ✅ 不扫描历史文件
- ✅ 不分析正文内容
- ✅ 不使用 AI 或联网
- ✅ 完全本地运行
- ✅ 所有行为可预测、可配置

## 兼容性

- Obsidian Properties
- Dataview
- Bases
- 标准 YAML frontmatter
- 桌面端 + 移动端

## 开发

```bash
# 安装依赖
npm install

# 开发模式（监听文件变化）
npm run dev

# 生产构建
npm run build

# 部署插件，会自动在当前目录创建 zips/ 文件夹，然后将构建后的文件复制到该文件夹中生成 zip 文件
npm run deploy
```

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request。
