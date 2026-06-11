# Agent Memory Routing Map

开发、评审、排障或文档/spec/skill 改动前，先按目标路径或模块读取本表。多行匹配时选择最具体路径，并合并读取相关记忆。

| 路径/模块 | 先读 doc | 先读 spec | 触发 skill | 改后同步 | 状态 |
| --- | --- | --- | --- | --- | --- |
| `AGENTS.md`、`doc/agent-guide.md`、`doc/agent-memory-map.md`、`.agents/skills` | `doc/agent-guide.md`、`doc/agent-memory-map.md` | `openspec/specs/agent-governance/spec.md` | `cross-memory-routing` | 更新治理 spec、路由表或对应 skill | active |
| `README.md`、`doc/PROJECT.md`、`doc/app-overview.md` | `doc/PROJECT.md`、`doc/app-overview.md` | `openspec/specs/image-slicing/spec.md` | `<none>` | 同步项目概括、应用模块说明或相关 spec | active |
| `src/App.tsx`、`src/types.ts`、`src/components/layout/MainLayout.tsx` | `doc/app-overview.md` | `openspec/specs/image-slicing/spec.md` | `image-slicing-development` | 同步状态模型、组件分工和行为 spec | active |
| `src/components/canvas/CanvasModule.tsx`、`src/hooks/useKeyboardShortcuts.ts` | `doc/app-overview.md` | `openspec/specs/image-slicing/spec.md` | `image-slicing-development` | 同步画布交互、快捷键、选择/拖拽行为和测试说明 | active |
| `src/components/controls/ControlBar.tsx`、`src/components/editor/SliceList.tsx`、`src/components/preview/PreviewGallery.tsx` | `doc/app-overview.md` | `openspec/specs/image-slicing/spec.md` | `image-slicing-development` | 同步上传、切片编辑、预览和模式提示 | active |
| `src/components/image-monitor`、`src/components/info-monitor` | `doc/app-overview.md` | `<none>` | `<none>` | 若接入主流程，补充 image-slicing spec 和路由 | candidate |

## Fallback

- 没有匹配项时，先用 `rg` 在 `doc/`、`spec/`、`openspec/specs/`、`.agents/skills/` 中搜索目标路径、页面名、接口名和业务名。
- 若仍无结果，按三层治理创建最小记忆：约束未来行为进 spec，描述当前项目进 doc，指导重复操作进 skill。
- 本次改动新增长期入口、模块文档、spec 或 skill 时，必须补充本表。
