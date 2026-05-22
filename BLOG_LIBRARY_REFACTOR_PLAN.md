# Blog 图书馆化重构计划与需求

生成日期：2026-05-22  
当前目录：`D:\Blog`

## 1. 结论

推荐采用 **Astro + TypeScript + React Islands + Markdown/MDX Content Collections + Pagefind** 重建 Blog v2。

不建议继续深度魔改当前 Hexo/ParticleX 主题，也不建议从裸 Vite/React 完全从 0 造内容系统。更稳的路线是：保留现有 Hexo 站点作为内容来源，在 `D:\Blog\site-v2` 中新建 Astro 版本，完成迁移和验收后再切换部署。

核心理由：

- 当前站点是 Hexo 8.1.1 + ParticleX 主题，主页和文章页围绕“帖子流”设计；图书馆、书籍、章节目录、标签筛选属于新的信息架构，继续改 EJS 主题会很快变成长期维护负担。
- 现有内容已经按主题目录存放，适合迁移为“book/chapter”模型；但 front matter 中 tags 大多为空，categories 也不完全一致，需要重新整理元数据。
- Astro 对内容型站点友好，默认静态输出，适合继续部署到 GitHub Pages；React Islands 只在书架筛选、搜索、管理员角色等局部交互里使用，避免整站 SPA 化。
- 未来账号和 Agent 对话模块需要后端能力；v1 先把管理员做成静态/轻交互角色，后续可把 Astro 切到 SSR 适配器，或将 Agent 做成独立服务/API。

## 2. 当前站点观察

- 技术栈：`hexo@8.1.1`，主题为 `themes/particlex`，部署配置指向 `leikuman1.github.io` 的 GitHub Pages。
- 根目录 `D:\Blog` 当前不是 Git 仓库，`.deploy_git` 很可能只是 Hexo 生成后的发布仓库；正式重构前需要先把源码纳入版本控制。
- 内容在 `source/_posts` 下，约 32 篇 Markdown；已有 `Git`、`FastAPI`、`RAG`、`redis`、`面经` 等主题目录，可作为第一批书籍候选。
- `tags` 多数为空，少量如 `ORM`、`SQLAlchemy`、`FastAPI`、`DB`；需要制定统一标签表。
- 文章中存在本地图片引用，例如 `source/_posts/Git/img/git-merge-main.png`；迁移时要做资源路径检查，顺手发现 `Git基本操作.md` 引用了未列出的 `img/git-merge-fixBug.png`，需要补图或修正引用。

## 3. 产品需求

### 3.1 首页：图书馆

- 首页第一屏是一个“图书馆/书架”界面，而不是传统文章列表。
- 每本书代表一个知识点，例如 `Git`、`Java`、`FastAPI`、`RAG`、`Redis`。
- 书籍卡片需要包含：书名、副标题/简介、封面、标签、章节数、最近更新时间、阅读入口。
- 支持按标签筛选书籍；筛选状态写入 URL query，刷新或分享链接后仍能恢复。
- 右下角放置 Q 版虚拟管理员角色。v1 只实现静态展示、悬浮提示、入口占位；账号和对话 Agent 暂不实现。

### 3.2 书籍页

- 路由建议：`/books/[bookSlug]`。
- 展示真实书籍式结构：封面、简介、标签、目录、章节列表、最后更新时间。
- 目录按“部分/章节”组织，例如：
  - Git：基本操作、分支管理、团队协作、实战问题。
  - Java：基本语法、集合、并发编程、JVM、项目实践。
- 点击目录项跳转到对应章节页；章节缺失时允许显示“待补全”状态，但不能出现死链。

### 3.3 章节页

- 路由建议：`/books/[bookSlug]/[chapterSlug]`。
- 页面包含：面包屑、书籍目录侧栏、正文目录、上一篇/下一篇、标签、更新时间。
- Markdown/MDX 中的二级/三级标题自动生成页面内 TOC。
- 保留代码块高亮、图片预览、数学公式扩展空间。

### 3.4 标签与搜索

- 标签用于跨书查找，例如 `后端`、`数据库`、`并发`、`工程化`、`面试`、`AI`。
- v1 支持书籍级标签筛选和全文搜索；优先使用 Pagefind 生成静态搜索索引，不引入运行时数据库。
- 搜索结果同时展示书籍和章节，结果项包含标题、所属书籍、命中摘要、标签。

### 3.5 图片生成

- UI 需要的封面、背景、管理员角色、空状态插图等，统一通过 OpenAI Images API 的 GPT Image 系列生成。
- 不把 API key 放在前端；使用本地/CI 脚本生成图片并保存到 `public/images/generated`。
- 每张生成图保留 prompt、用途、尺寸、生成模型、生成日期，便于复现和替换。
- 模型名通过环境变量配置，例如 `OPENAI_IMAGE_MODEL=gpt-image-2`，避免在代码里硬编码。

## 4. 技术栈选择

| 方案 | 结论 | 优点 | 主要问题 |
| --- | --- | --- | --- |
| 继续魔改 Hexo + ParticleX | 不推荐 | 内容迁移成本最低，部署方式不变 | 主题模型是文章流；复杂书籍模型、交互筛选、未来账号/Agent 都会变成模板补丁 |
| 从裸 Vite/React 开始 | 不推荐 | UI 自由度最高 | 需要自己补内容解析、路由、MDX、TOC、搜索、构建部署，重复造轮子 |
| Next.js + MDX/Fumadocs | 备选 | 未来账号、API、Agent 一体化最顺 | 对纯静态知识库偏重；如果 v1 主要是内容展示，会引入更多服务端复杂度 |
| Astro + React Islands + Content Collections | 推荐 | 静态内容强、结构化内容模型清晰、交互按需加载、适合 GitHub Pages | 后续 Agent 若要同域运行，需要切 SSR 或接独立后端 |

推荐具体组合：

- Framework：Astro。
- Language：TypeScript。
- Content：Astro Content Collections + Markdown/MDX。
- Interactive UI：React Islands，只用于标签筛选、搜索、管理员角色、可能的书架动画。
- Styling：Tailwind CSS + CSS variables；复杂书架/书脊效果可用局部 CSS module。
- Icons：`lucide-react`。
- Search：Pagefind 静态全文搜索。
- Image pipeline：Node 脚本调用 OpenAI Images API，输出静态资源。
- Deploy：v1 继续静态部署到 GitHub Pages；Agent 阶段再评估 Vercel/Cloudflare Pages/自有后端。

## 5. 内容模型与目录建议

在 `site-v2` 中建议使用下面的结构：

```text
site-v2/
  src/
    content/
      books/
        git.yaml
        fastapi.yaml
        java.yaml
      chapters/
        git/
          git-basic.mdx
          git-team-workflow.mdx
        fastapi/
          first-fastapi.mdx
    components/
      library/
      book/
      admin/
    pages/
      index.astro
      books/[book].astro
      books/[book]/[chapter].astro
      tags/[tag].astro
  public/
    images/
      generated/
  scripts/
    generate-images.ts
    migrate-hexo-content.ts
```

书籍元数据建议：

```yaml
slug: git
title: Git
subtitle: 版本控制与团队协作
description: Git 基础命令、分支模型、冲突处理和团队实践。
tags: [工程化, 团队协作, 版本控制]
status: active
order: 10
coverImage: /images/generated/books/git-cover.webp
coverPrompt: 一本文艺但清晰的 Git 技术书封面，图书馆书架场景，暖色灯光
sections:
  - id: basics
    title: 基本操作
    order: 1
  - id: teamwork
    title: 应用 Git 管理团队
    order: 2
```

章节 front matter 建议：

```yaml
title: Git 基本操作
book: git
section: basics
order: 1
date: 2026-05-21
updated: 2026-05-21
tags: [commit, merge, branch]
summary: 解释 commit、checkout、merge 等 Git 基础操作。
```

迁移规则：

- `source/_posts/Git/*.md` 迁移到 `src/content/chapters/git/*.mdx`。
- 原 `categories[0]` 优先作为 `book` 候选；目录名作为兜底。
- 原 `tags` 迁移为章节标签；空标签文章先标记 `needsTags: true`，后续人工补齐。
- 图片从文章相对目录迁移到 `public/images/content/[book]/`，并自动修正链接。

## 6. 实施阶段

### Phase 0：保护现状

- 在 `D:\Blog` 初始化源码仓库，或从 GitHub 重新 clone 一个源码仓库，确保 Hexo 源文件被版本控制。
- 保留当前 Hexo 站点不动，不直接覆盖 `source`、`themes`、`public`。
- 新建 `site-v2` 作为 Astro 重构目录。

### Phase 1：搭建内容骨架

- 初始化 Astro + TypeScript。
- 定义 `books` 与 `chapters` 两类 Content Collections。
- 实现书籍列表、书籍详情、章节详情三类基础路由。
- 手工迁移 `Git` 和 `FastAPI` 作为样板书，验证内容模型。

### Phase 2：图书馆 UI

- 实现首页书架、书籍卡片、标签筛选、最近更新区域。
- 实现右下角管理员角色占位组件：静态角色图、气泡文案、未来对话入口禁用态。
- 做桌面与移动端响应式布局；移动端可降级为纵向书籍列表。

### Phase 3：搜索与目录体验

- 接入 Pagefind，构建后生成搜索索引。
- 章节页实现正文 TOC、书籍目录侧栏、上一篇/下一篇。
- 标签页 `/tags/[tag]` 展示关联书籍和章节。

### Phase 4：图片生成流程

- 编写 `scripts/generate-images.ts`，读取书籍 metadata 中的 prompt，调用 OpenAI Images API 生成封面和管理员素材。
- 图片输出为 WebP/PNG，保存在 `public/images/generated`。
- 生成记录写入 `public/images/generated/manifest.json` 或 `src/data/generated-images.json`。

### Phase 5：全量迁移与上线

- 批量迁移现有 Markdown，修正 front matter、标签、图片路径和内部链接。
- 运行构建、搜索索引、链接检查和浏览器截图验收。
- 将部署从 Hexo `public` 切换为 Astro `site-v2/dist`。

## 7. 验收标准

- 首页能以图书馆形式展示所有书籍，标签筛选可用并能通过 URL 恢复。
- 每本书都有清晰目录；点击目录能进入对应章节；不存在死链。
- 章节页具备面包屑、正文 TOC、书籍目录、上一篇/下一篇。
- 搜索能命中书籍标题、章节标题和正文内容。
- 所有本地图片引用有效；生成图片有 prompt 记录。
- 移动端、平板、桌面端布局不重叠，文字不溢出。
- `npm run check`、`npm run build`、搜索索引生成全部通过。
- GitHub Pages 或目标部署平台能打开生产构建产物。

## 8. 暂缓范围

- 用户账号系统暂缓。
- 与管理员角色真实对话的 Agent 模块暂缓。
- 运行时图片生成暂缓；v1 只做离线生成并静态托管。
- 评论系统、文章加密、复杂数据看板暂缓。

## 9. 后续 Agent 模块预留

v1 只做管理员 UI 占位，但组件和路由需要预留扩展点：

- 组件名建议：`LibraryAdminWidget`。
- 未来入口建议：`/admin-agent` 或右下角抽屉面板。
- 未来能力：登录用户可与管理员对话，询问站内知识、推荐书籍、总结章节。
- 未来技术选择：
  - 如果继续 Astro：使用 SSR adapter + API routes，接认证和数据库。
  - 如果 Agent 成为核心功能：可迁移到 Next.js App Router，或保留 Astro 静态站点并单独部署 Agent 服务。

## 10. 参考资料

- Astro Content Collections：https://docs.astro.build/en/guides/content-collections/
- Astro Islands：https://docs.astro.build/en/concepts/islands/
- Astro Endpoints：https://docs.astro.build/en/guides/endpoints/
- Astro GitHub Pages 部署：https://docs.astro.build/en/guides/deploy/github/
- Next.js MDX：https://nextjs.org/docs/app/guides/mdx
- Next.js Route Handlers：https://nextjs.org/docs/app/api-reference/file-conventions/route
- Hexo Front Matter：https://hexo.io/docs/front-matter
- Hexo Variables：https://hexo.io/docs/variables
- Pagefind Docs：https://pagefind.app/docs/
- OpenAI Image Generation：https://platform.openai.com/docs/guides/image-generation
