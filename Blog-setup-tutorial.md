# Blog v2 环境配置、依赖安装与 Git 使用教程

生成日期：2026-05-22  
适用目录：`D:\Blog`

## 1. 分工说明

这次 Blog 重构的分工如下：

- 你负责：环境配置、依赖安装、Git 初始化、提交、推送。
- Codex 负责：调整项目结构、编写代码、迁移内容、实现页面和组件。
- Codex 默认不执行 `git add`、`git commit`、`git push`，避免和你的 Git 使用习惯冲突。
- GPT 生图只在开发阶段使用，用户访问网站时不提供生图功能。

## 2. 安装基础环境

建议安装：

- Node.js：建议 `v22.12.0` 或更高版本。
- Git：保持当前已安装版本即可。
- 编辑器：VS Code 或你常用的编辑器。

安装完成后，打开 PowerShell 检查：

```powershell
node -v
npm -v
git --version