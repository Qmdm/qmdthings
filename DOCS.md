# QMD的杂物间 — 项目文档

> 基于 [Quarto](https://quarto.org/) 构建的个人网站，部署于 [qmdthings.top](https://qmdthings.top)。

---

## 目录

1. [项目概览](#项目概览)
2. [目录结构](#目录结构)
3. [_quarto.yml 配置解析](#_quartoyml-配置解析)
4. [内容组织](#内容组织)
5. [主题与样式](#主题与样式)
6. [本地开发](#本地开发)
7. [构建与部署](#构建与部署)
8. [添加新内容](#添加新内容)
9. [参考链接](#参考链接)

---

## 项目概览

| 项目 | 说明 |
|------|------|
| **名称** | QMD的杂物间 |
| **类型** | Quarto Website (`project.type: website`) |
| **域名** | `qmdthings.top` |
| **托管** | GitHub Pages（通过 GitHub Actions 自动部署） |
| **主要内容** | 学习笔记 (Notes)、博客 (Blogs)、杂项 (Fun) |
| **主题** | Flatly（亮色） / Darkly（暗色），支持一键切换 |
| **搜索** | 全文搜索（基于 Algolia，位于侧边栏） |
| **RSS** | 首页 listing 提供全站 RSS feed |

---

## 目录结构

```
qmdthings/
├── _quarto.yml            # 🔧 网站核心配置（类型、导航、主题、搜索等）
├── _quartoignore          # Quarto 忽略规则（跳过 .obsidian/, .md 等）
├── .gitignore             # Git 忽略规则
├── CNAME                  # GitHub Pages 自定义域名：qmdthings.top
├── README.md              # 仓库说明
├── DOCS.md                # 📖 本文档
│
├── .github/workflows/
│   └── publish.yml        # CI/CD：推送到 master 自动渲染并部署到 gh-pages
│
├── index.qmd              # 🏠 首页 — 使用 listing 列出所有 QBlogs + QNotes
├── about/
│   └── qmd.qmd            # 👤 关于页面（Jolla 模板）
├── error/
│   └── 404.qmd            # 🚫 自定义 404 页面
│
├── QBlogs/                # ✍️ 博客文章（按分类分子目录）
│   └── Android/
│       └── 在你的Android上面部署ArchLinux.qmd
│
├── QNotes/                # 📝 学习笔记（按学科分子目录）
│   ├── Comp/              #   计算机
│   ├── Elec/              #   电子/电工
│   ├── Math/              #   数学/统计
│   └── Mech/              #   机械/力学
│
├── fun/                   # 🎉 趣味内容
│   ├── _metadata.yml      #    目录级元数据
│   └── 生活/
│       ├── Linux上面也有NFC!.qmd
│       └── helloblogs.qmd
│
├── setup/                 # 🔬 小实验/演示页面
│   ├── 关系环图.qmd
│   ├── 机械原理.qmd
│   ├── 电子电路.qmd
│   └── 集合.qmd
│
├── assets/                # 🎨 静态资源
│   ├── auto-collapse.js   #    自动折叠侧边栏脚本
│   ├── svg.js             #    SVG 相关脚本
│   ├── hero.js            #    首页 hero 动画
│   ├── hitokoto.html      #    一言插件
│   └── share-cards/       #    社交分享卡片图片
│
├── custom.scss            # 🎨 SCSS 自定义主题（字体、颜色、公式滚动等）
├── styles.css             # 🎨 补充 CSS（标题 banner、暗色 SVG 反色）
│
├── _site/                 # 🌐 渲染输出目录（quarto render 生成）
├── _freeze/               # ❄️  计算冻结缓存
└── .quarto/               # Quarto 内部文件
```

---

## _quarto.yml 配置解析

### 1. 项目配置 (project)

```yaml
project:
  type: website
  resources: [assets, posts, notes, fun, error, setup, README.md]
```

- **`type: website`** — 声明为 Quarto 网站项目。
- **`resources`** — 显式声明需要复制到 `_site/` 的资源目录/文件。Quarto 默认只复制被链接引用的文件，这里强制包含这些目录。

### 2. 执行配置 (execute)

```yaml
execute:
  freeze: auto
  message: false
  warning: false
```

- **`freeze: auto`** — 自动冻结计算结果。如果 `.qmd` 代码未改变，复用上次缓存（`_freeze/`），大幅加速重复渲染。
- **`message: false` / `warning: false`** — 在输出中隐藏代码执行的消息和警告。

### 3. 网站配置 (website)

```yaml
website:
  title: "QMD的杂物间"
  description: "琐事随笔"
  site-url: https://qmdthings.top
  site-path: /
```

- **`site-url`** — 全站 URL，用于生成 sitemap、RSS feed、Open Graph 元数据等。
- **`site-path`** — 网站路径，根路径为 `/`。

#### 社交元数据

```yaml
  open-graph:
    image: "../../assets/share-cards/default.jpg"
    image-width: 1200
    image-height: 630
    locale: zh_CN
  twitter-card:
    image: "../../assets/share-cards/default.jpg"
```

- 为每个页面自动生成 Open Graph 和 Twitter Card 元数据，使分享链接时显示卡片预览。

#### 阅读模式与搜索

```yaml
  reader-mode: true
  search:
    location: sidebar
```

- **`reader-mode: true`** — 启用阅读模式，用户可收起侧边栏和目录获得沉浸式阅读体验。
- **`search`** — 全文搜索置于侧边栏。

#### 页脚

```yaml
  page-footer:
    center: "毎日マリーゴールドを1つ"
    right:
      - text: "Powered by quarto."
        href: https://quarto.org/
```

#### 导航栏 (navbar)

```yaml
  navbar:
    title: "Navi"
    background: "#4E9AB0"
    left:
      - text: "Home"
        href: index.qmd
      - text: "About"
        href: about/qmd.qmd
      - sidebar:blogs
      - sidebar:notes
      - sidebar:fun
    right:
      - icon: rss
        href: index.xml
      - icon: github
        href: https://github.com
```

- 使用 **Hybrid Navigation**（混合导航）：顶部导航栏 + 每栏下拉侧边栏。
- `- sidebar:blogs` 语法表示该导航项展开对应 `id: blogs` 的侧边栏。

#### 侧边栏 (sidebar)

```yaml
  sidebar:
    - id: blogs
      title: "Blogs"
      contents:
        - auto: posts
    - id: notes
      title: "Notes"
      contents:
        - auto: notes
    - id: fun
      title: "Fun"
      contents:
        - auto: fun
```

- 使用 **自动生成 (auto)** 模式，Quarto 按目录结构自动生成侧边栏条目，按标题 / 文件名排序。

### 4. HTML 格式配置 (format)

```yaml
format:
  html:
    respect-user-color-scheme: true
    fig-format: svg
    theme:
      light: [flatly, custom.scss]
      dark: [darkly, custom.scss]
    css: styles.css
    toc: true
    code-fold: true
    code-line-numbers: true
    include-after-body:
      - text: |
          <script src="../../assets/auto-collapse.js" defer></script>
          <script src="../../assets/svg.js" defer></script>
```

- **`respect-user-color-scheme`** — 初始跟随系统亮/暗模式。
- **`theme`** — 亮色用 Flatly，暗色用 Darkly，二者叠加 `custom.scss`。
- **`toc: true`** — 每个页面右侧显示目录。
- **`code-fold: true`** — 代码块默认折叠。
- **`code-line-numbers: true`** — 代码块显示行号。
- **`include-after-body`** — 在 `</body>` 前注入自定义脚本。

---

## 内容组织

### 首页 (`index.qmd`)

首页使用 Quarto **Listing** 功能聚合所有内容：

```yaml
listing:
  contents: [QBlogs, QNotes]
  feed: true
  sort: "date desc"
  type: default
  categories: true
  sort-ui: true
  filter-ui: false
```

- 列出 `QBlogs/` 和 `QNotes/` 下所有文章
- 按日期降序排列
- 启用 RSS feed (`feed: true`)
- 显示分类，提供排序 UI

### 关于页面 (`about/qmd.qmd`)

使用 Quarto **About Pages** 的 `jolla` 模板：

```yaml
about:
  template: jolla
  links:
    - icon: envelope
      text: Email
      href: mailto:qmd@ctgu.edu.cn
```

### 404 页面 (`error/404.qmd`)

Quarto 网站项目根目录下的 `404.qmd` 会自动生成 `404.html`，GitHub Pages 能识别它作为自定义错误页。

---

## 主题与样式

### SCSS 自定义 (`custom.scss`)

| 方面 | 配置 |
|------|------|
| **正文字体** | Source Serif 4 → Noto Serif SC → LXGW WenKai Screen → Georgia |
| **等宽字体** | JetBrains Mono → LXGW WenKai Screen → monospace |
| **品牌色** | `$brand-deep: #2A5E70` / `$brand-main: #4E9AB0` / `$brand-light: #A8D4DC` |
| **代码块** | JetBrains Mono, 隐藏横向滚动条, 连字特性 |
| **公式** | MathJax/KaTeX display 公式支持横向滚动（长公式不会撑破布局） |

### CSS 补充 (`styles.css`)

- `.quarto-title-banner` — 标题横幅样式
- `body.quarto-dark img[src$=".svg"]` — 暗色模式下 SVG 图片自动反色

---

## 本地开发

### 前置要求

- [Quarto CLI](https://quarto.org/docs/get-started/) ≥ 1.4
- (可选) R / Python — 仅当 `.qmd` 包含可执行代码块时需要

### 常用命令

```bash
# 预览网站（热重载）
quarto preview

# 完整渲染（输出到 _site/）
quarto render

# 仅渲染特定文件
quarto render index.qmd

# 清理冻结缓存后重新渲染
quarto render --no-freeze
```

### 预览行为

- `quarto preview` 启动本地服务器（默认 `http://localhost:4444`）
- 修改 `.qmd` 或 `_quarto.yml` 会自动刷新
- 修改全局配置（如 `_quarto.yml`）后建议跑一次 `quarto render` 确保所有页面更新

---

## 构建与部署

### CI/CD 流程

`.github/workflows/publish.yml`：

```yaml
on:
  push:
    branches: master
```

1. Push 到 `master` 分支触发
2. `quarto-dev/quarto-actions/setup@v2` 安装 Quarto
3. `quarto-dev/quarto-actions/publish@v2` 渲染并发布到 `gh-pages` 分支
4. GitHub Pages 自动从 `gh-pages` 分支部署到 `qmdthings.top`

### 手动部署

```bash
quarto render                    # 渲染到 _site/
# 然后将 _site/ 内容推送到 gh-pages 分支或使用 quarto publish
quarto publish gh-pages          # 交互式发布到 GitHub Pages
```

---

## 添加新内容

### 添加博客文章

```bash
# 在 QBlogs/ 下按分类创建子目录和 .qmd 文件
mkdir -p QBlogs/NewCategory
```

文章 front matter 示例：

```yaml
---
title: "文章标题"
date: 2025-01-15
categories: [分类A, 分类B]
---
```

### 添加学习笔记

```bash
# 在 QNotes/<学科>/ 下创建 .qmd 文件
```

### 添加趣味内容

```bash
# 在 fun/ 下创建（目录会自动出现在侧边栏）
```

### 注意事项

- 文件名尽量避免 `_` 或 `.` 前缀（除非通过 `project.render` 明确包含）
- **中文文件名完全支持** — Quarto 对 Unicode 路径友好
- 在 `_metadata.yml` 中可设置目录级默认 front matter

---

## 参考链接

| 主题 | 官方文档 |
|------|----------|
| 创建网站 | <https://quarto.org/docs/websites/> |
| 网站导航 | <https://quarto.org/docs/websites/website-navigation.html> |
| 网站工具（搜索/暗色模式/社交元数据） | <https://quarto.org/docs/websites/website-tools.html> |
| 列表页 (Listing) | <https://quarto.org/docs/websites/listing-pages.html> |
| About 页面 | <https://quarto.org/docs/websites/about-pages.html> |
| 博客 | <https://quarto.org/docs/websites/website-blog.html> |
| HTML 主题 | <https://quarto.org/docs/output-formats/html-themes.html> |
| 发布到 GitHub Pages | <https://quarto.org/docs/publishing/github-pages.html> |
| 项目基础 | <https://quarto.org/docs/projects/quarto-projects.html> |
