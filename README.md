# coca-cola-cutter

基于 React + TypeScript + Vite 的图片切片工作区。

本应用支持上传一张图片，在源图上绘制矩形切片，管理切片坐标，添加辅助线，并预览每个切片区域。

## 当前功能

- 通过控制栏上传本地图片。
- 在源图上拖拽绘制切片。
- 添加垂直和水平辅助线。
- 选中并拖动切片或辅助线。
- 在切片列表中编辑切片的 `x`、`y`、`w`、`h` 值。
- 使用上传的图片作为源图预览每个切片。
- 使用键盘快捷键切换模式：
  - `v`：垂直辅助线模式
  - `h`：水平辅助线模式
  - `s`：选择模式
  - `Escape`：切片模式
  - `d`：删除选中项

## 技术栈

- React 18
- TypeScript
- Vite
- Tailwind CSS v4
- shadcn/ui 规范
- Vitest + Testing Library

## 项目记忆

面向代理的项目记忆位于：

- `doc/agent-memory-map.md`：文档、规范和技能的路由表。
- `doc/app-overview.md`：当前应用结构和实现说明。
- `openspec/specs/image-slicing/spec.md`：长期行为需求。
- `.agents/skills/image-slicing-development/SKILL.md`：图片切片 UI 变更的可复用工作流。

## 命令

```bash
npm run dev
npm run build
npm run lint
npm run test
```
