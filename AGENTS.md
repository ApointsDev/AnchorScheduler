# Project Instructions

This file provides context for AI assistants working on this project.

## Project Type: Node.js

### Commands
- Install: `npm install`
- Test: `npm test`
- Build: `npm run build`
- Start: `npm start`

### Framework: Vite

### Documentation
See README.md for project overview.

### Version Control
This project uses Git. See .gitignore for excluded files.


## Architecture

- 前端：Vite + React + TypeScript（`src/`），入口 `src/main.tsx`
- 后端：Express（`server/`），开发时用 Babel 编译到 `server/dist` 后以 Node ESM 运行
- 数据库：SQLite（`private/users.db`）
- 主题系统：当前激活主题为 `figma`（`src/styles/themes/figma.css`，作用于 `html[data-style-theme="figma"]`）；基础令牌在 `src/styles/tokens.css`

## Guidelines

- Follow existing code style and patterns
- Write tests for new functionality (`npm test`)
- Keep changes focused and atomic
- Document public APIs

## Design Tokens（必须遵守）

- 所有颜色、间距、圆角、字号、字重、阴影、动效时长、z-index 必须使用现有设计令牌
  （`src/styles/themes/figma.css` 与 `src/styles/tokens.css` 中定义的 `--color-*`、`--space-*`、`--radius-*`、`--font-size-*`、`--font-weight-*`、`--shadow-*`、`--duration-*`、`--z-*`）
- 禁止使用未定义的 CSS 变量（例如 `--font-mono` 不存在）。如需新令牌，先在主题文件中定义再使用
- 字体族：全局字体为 sans-serif（`body` 中定义）。除非必要，不要覆盖 `font-family`；
  等宽文本遵循既有惯例：`"SF Mono", "Consolas", "Monaco", monospace`
- 优先使用语义化令牌（`--color-text-primary/-secondary/-tertiary`、`--color-brand-primary` 等），
  而非硬编码颜色值；向后兼容别名（`--color-text-dark/medium/light`、`--color-primary` 等）可复用

## Backend Notes

- 后端端口由 `PORT` 环境变量控制（`server/index.ts`，默认 3000；生产经 nginx 反代到 9005，见 `AnchorScheduler.sh` 中的 `export PORT=9005`）
- `npm run server`：Babel 编译 `server/` → `server/dist`，再 `node server/dist/index.js`
- 修改 `server/routes/*.ts` 后需重新编译才生效：`npx babel server --out-dir server/dist --extensions .ts`
- 用 Node v22 运行（`/www/server/nodejs/v22.17.0/bin/node`）；系统默认 node v18 可能不兼容某些 CJS 依赖的命名导出

## Important Notes

<!-- Add project-specific notes here -->
