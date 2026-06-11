---
name: image-slicing-development
description: 修改 coca-cola-cutter 图片切片主流程时使用，包括 App 状态、CanvasModule 坐标交互、切片列表、预览、辅助线和快捷键。
---

# image-slicing-development

用于维护图片切片主流程的稳定开发步骤。当前实现细节以 `doc/app-overview.md` 为准，长期行为约束以 `openspec/specs/image-slicing/spec.md` 为准。

## 触发范围

- `src/App.tsx`
- `src/types.ts`
- `src/components/canvas/CanvasModule.tsx`
- `src/components/controls/ControlBar.tsx`
- `src/components/editor/SliceList.tsx`
- `src/components/preview/PreviewGallery.tsx`
- `src/components/layout/MainLayout.tsx`
- `src/hooks/useKeyboardShortcuts.ts`
- 与切片、辅助线、选择、预览或上传主流程相关的测试

## Steps

1. 先读 `doc/agent-memory-map.md`，再读 `doc/app-overview.md` 和 `openspec/specs/image-slicing/spec.md`。
2. 确认改动属于当前主流程还是未接入原型模块；不要把 `image-monitor` 或 `info-monitor` 当成已接入页面。
3. 若新增数据字段或模式，先更新 `src/types.ts`，再同步 `App.tsx` 状态处理、组件 props、预览提示和测试。
4. 画布坐标改动必须保持源图像像素语义，并检查容器 `getBoundingClientRect()` 与滚动偏移的换算。
5. 切片绘制改动要覆盖反向拖拽、最小拖拽阈值、整数取整和无图片状态。
6. 辅助线或选择模式改动要同步快捷键、模式提示、选中态、拖拽行为和删除逻辑。
7. 预览改动要确认 `backgroundImage`、`backgroundPosition`、切片 `w/h` 和大切片显示策略一致。
8. 行为变化后更新 `openspec/specs/image-slicing/spec.md`；当前结构或限制变化后更新 `doc/app-overview.md`。
9. 至少运行相关测试；高风险 UI 交互改动优先运行 `npm run test` 和 `npm run build`。

## Self-check

- 没有绕过 `App.tsx` 创建第二套主流程状态。
- 切片、辅助线和选中项的 ID 仍由创建方生成并保持稳定。
- 输入框聚焦时，全局快捷键不会误触发。
- 上传新图片仍会清空旧切片、辅助线和选中项。
- 文档只记录当前状态，spec 只记录长期约束，skill 不包含一次性实现细节。
