# Blog v2 环境配置、依赖安装与 Git 使用教程

生成日期：2026-05-22  
适用目录：`D:\Blog`

## 1. 分工说明

- 你负责：环境配置、依赖安装、Git 初始化、提交、推送、手动生成 UI 图片。
- Codex 负责：调整项目结构、编写代码、迁移内容、实现页面和组件。
- Codex 默认不执行 `git add`、`git commit`、`git push`，避免和你的 Git 使用习惯冲突。
- 网站不提供用户生图功能，也不在工程里安装 OpenAI 生图相关依赖。

## 2. 基础环境检查

建议环境：

- Node.js：`v22.12.0` 或更高。
- npm：随 Node 安装即可。
- Git：保持当前版本即可。

检查命令：

```powershell
node -v
npm -v
git --version
```

当前已检查到：

```text
node v22.13.1
npm 10.9.2
```

## 3. Git 初始化与身份

当前 `D:\Blog` 已经初始化为 Git 仓库，并存在初始提交：

```text
1eba7a5 chore: snapshot current hexo blog
```

Codex 运行时和你本机用户 SID 不同，读取 Git 状态时可能出现：

```text
fatal: detected dubious ownership in repository at 'D:/Blog'
```

这不是仓库坏了，而是 Git 的安全保护。你可以在自己的 PowerShell 执行：

```powershell
git config --global --add safe.directory D:/Blog
```

如果不想改全局配置，也可以保持现在的分工：你负责提交和推送，Codex 只写代码。

## 4. Astro 项目状态

新项目目录：

```text
D:\Blog\site-v2
```

当前已安装：

- Astro
- React
- MDX
- Tailwind CSS
- lucide-react

当前未安装，也不需要安装：

- `openai`
- `dotenv`
- `sharp`
- `tsx`
- 任何运行时或开发期生图脚本依赖

## 5. 本项目的图片处理规则

图片由你手动使用 GPT 或其他工具生成，然后放入项目静态目录。

推荐目录：

```text
site-v2/public/images/generated/books/
site-v2/public/images/generated/admin/
site-v2/public/images/generated/library/
site-v2/public/images/content/
```

代码只读取静态图片路径，例如：

```yaml
coverImage: /images/generated/books/git-cover.png
```

如果暂时没有图片，页面会使用 CSS 书封占位样式，不影响构建。

## 6. 启动开发服务

进入 Astro 项目：

```powershell
cd D:\Blog\site-v2
```

启动开发服务：

```powershell
npm run dev
```

生产构建：

```powershell
npm run build
```

## 7. 推荐提交流程

查看状态：

```powershell
cd D:\Blog
git status
```

提交：

```powershell
git add .
git commit -m "feat: build astro library blog"
git push
```

## 8. 后续 Codex 负责的内容

- 建立书籍和章节内容模型。
- 实现图书馆首页。
- 实现书籍详情页。
- 实现章节阅读页。
- 实现标签筛选和站内搜索。
- 迁移现有 Hexo Markdown 内容。
- 接入你手动生成的静态图片。
