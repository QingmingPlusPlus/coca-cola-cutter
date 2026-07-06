---
slug: slice-coords-preview-clear
status: approved
intent: clear
pending-action: write .omo/plans/slice-coords-preview-clear.md (approved 2026-06-23)
approach: 五组件——C1 SliceList 双行坐标 + App 换算；C2 PreviewGallery 行布局 + 缩放缩略图；C3 Clear 按钮 + handleClearAll + window.confirm；C5 Export 用 shadcn Dialog 选 xywh(默认)/x1y1x2y2；C4 测试 + spec/doc 同步。Slice 存储 xywh 不变，x1y1x2y2 派生。Clear 带 window.confirm。新增 src/components/ui/dialog.tsx。
---

# Draft: slice-coords-preview-clear

## Components (topology ledger)
<!-- Lock the SHAPE before depth. One row per top-level component that can succeed or fail independently. -->
<!-- id | outcome (one line) | status: active|deferred | evidence path -->
| C1-dual-coords | SliceList 同时显示 xywh（上）和 x1y1x2y2（下）八值，编辑任一同步另一 | active | src/components/editor/SliceList.tsx; src/App.tsx:91-95; src/types.ts:1-8 |
| C2-preview-rows | PreviewGallery 改为一行一切片：缩略图 + 名称，缩略图按比例缩放展示切片全部 | active | src/components/preview/PreviewGallery.tsx:82-170 |
| C3-clear-button | Save 旁新增 Clear 按钮，清空当前所有数据 + localStorage 存储数据 | active | src/components/editor/SliceList.tsx:34-54; src/App.tsx:15,33-47,129-146 |
| C4-tests-spec-doc | 更新/新增测试、image-slicing spec、app-overview doc、memory-map | active | src/test/*; openspec/specs/image-slicing/spec.md; doc/app-overview.md |
| C5-export-format-choice | Export 点击后弹 shadcn Dialog 选择 xywh(默认)/x1y1x2y2 再导出 | active | src/App.tsx:112-127; src/components/editor/SliceList.tsx:41-47; components.json; src/components/ui/button.tsx; src/lib/utils.ts |

## Open assumptions (announced defaults)
<!-- Record any default you adopt instead of asking, so the user can veto it at the gate. -->
<!-- assumption | adopted default | rationale | reversible? -->
| 数据模型保持 xywh 为规范存储 | Slice 类型不新增 x1/y1/x2/y2 字段，仍只存 x/y/w/h；x1y1x2y2 为派生显示 | canvas、export、save 均消费 xywh；新增冗余字段会导致双源失同步 | 完全可逆 |
| xywh 编辑语义 | 编辑 x/y 时 w/h 不变（x2=x+w、y2=y+h 随之更新）；编辑 w/h 时 x/y 不变 | 与现有 handleUpdateSlice 行为一致 | 可逆 |
| x1y1x2y2 编辑语义 | 编辑 x1→x=x1 且 w=(x+w_old)-x1；编辑 x2→w=x2-x；y1/y2 同理 | x1y1x2y2 是两个角点，编辑一角保持另一角不动 | 可逆 |
| 负值不夹紧 | x1>x2 时 w 为负，不强制 Math.max(0,…) | 与现有输入框允许负值行为一致 | 可逆 |
| 预览缩略图尺寸 | 固定上限 64px，scale = 64 / max(w,h)，容器 = w*scale × h*scale | 一行布局下行高受缩略图约束，64px 紧凑且清晰 | 可逆 |
| 预览保留重命名 | 行布局仍保留名称 + 铅笔重命名控件 | 用户只要求改布局，未要求删除现有重命名能力 | 可逆 |
| 预览保留底部模式提示面板 | MODE_INFO 面板保留 | 用户未提及移除 | 可逆 |
| SliceList/PreviewGallery 高度仍各占右栏 h-1/2 | 不调整 50/50 分栏 | 用户未要求改分栏 | 可逆 |
| Export/Save 格式 | Save 仍只含 id/name/x/y/w/h（不改）；Export 新增可选格式选择（xywh 默认 / x1y1x2y2），见 C5 | 用户明确要求导出可选格式；Save 未要求改 | 可逆（Save 不动） |
| Clear 按钮范围 | 清空 imageMeta、slices、guideLines、selectedItem、mode→slice、saveStatus，并 localStorage.removeItem | "所有数据以及存储的数据"明确含全部当前态 + 持久化 | 可逆（按钮行为） |
| 测试策略 | tests-after：实现后补/改测试，agent 执行 npm run test + npm run build 验证 | 现有仓库为 tests-after，无 TDD 痕迹 | 可逆 |
| x1y1x2y2 导出数据形 | { imageName, slices: [{ name, x1, y1, x2, y2 }] }，x1=x,y1=y,x2=x+w,y2=y+h；不含辅助线/选中项/模式 | 与 xywh 导出对称，角点命名直观 | 可逆 |
| 导出文件名 | 仍 <base>-slices.json，不随格式变化 | 用户未要求改文件名 | 可逆 |
| 导出对话框实现 | 新增 shadcn Dialog 组件 src/components/ui/dialog.tsx（radix-ui Dialog），SliceList 用 useState 管理 open + format(默认 xywh)，确认后回调 onExport(format) | 项目已配置 shadcn(new-york)、radix-ui 依赖已装、@/ 别名生效、有 cn 工具；模态符合"确认"语义、带遮罩/ESC/焦点陷阱/a11y | 可逆（UI） |
| 导出按钮无图时仍 disabled | 沿用现有 disabled={!imageMeta} | 现有行为 | 可逆 |

## Findings (cited - path:lines)
- Slice 类型仅 id/name/x/y/w/h：src/types.ts:1-8。x1y1x2y2 需派生（x1=x,y1=y,x2=x+w,y2=y+h）。
- handleUpdateSlice(id, field:"x"|"y"|"w"|"h", value)：src/App.tsx:91-95，直接 `{...s,[field]:value}`。需扩展 field 联合以支持 x1/y1/x2/y2 并做换算。
- SliceList 每行 grid-cols-[auto_1fr_auto]：src/components/editor/SliceList.tsx:57-77。InputGroup 复用于 4 字段；需新增第二行 4 字段。
- Save 按钮位于 src/components/editor/SliceList.tsx:34-40，Export JSON:41-47，+Add Slice:48-53。Clear 按钮插入 Save 旁。
- PreviewGallery 当前 flex-wrap 列布局，容器用 slice.w/h 实际像素 + maxWidth/maxHeight 150px，大切片被裁切（TODO 注释 src/components/preview/PreviewGallery.tsx:95-108）。需改为行布局 + 等比缩放。
- WORKSPACE_STORAGE_KEY="coca-cola-cutter-workspace"：src/App.tsx:15。save 在 :129-146，restore 在 :32-48。Clear 需 removeItem + 重置全部 state。
- 现有测试：src/test/PreviewGallery.test.tsx（名称显示 + 重命名，断言 getByText/getByLabelText，行布局后应仍兼容）、src/test/CanvasModule.test.tsx（canvas 交互，mock slices 用 xywh，不受影响）。无 SliceList.test / App.test。
- spec 约束：openspec/specs/image-slicing/spec.md —— "Slices are named editable rectangles"(:38-59)、"Preview uses the same source image"(:113-122)、"Workspace state can be temporarily saved"(:136-154)、"New persistence or export behavior requires an explicit spec update"(:156-163)。新增 Clear 需补 spec requirement。
- 测试环境 jsdom + setup 仅 import jest-dom：vitest.config.ts:1-9, src/test/setup.ts:1。
- Export 流程 src/App.tsx:112-127：payload { imageName, slices:[{name,x,y,w,h}] }，下载 <base>-slices.json。SliceList Export 按钮 :41-47，disabled={!imageMeta}。
- shadcn 已配置：components.json style=new-york, cssVariables, aliases @/* → src/*；tsconfig baseUrl+.paths @/* → ./src/*（tsconfig.json + tsconfig.app.json 均确认）。
- 现有 UI 原语仅 src/components/ui/button.tsx（用 radix Slot + cva + cn@@/lib/utils）；无 Dialog 组件，需新增 src/components/ui/dialog.tsx。src/lib/utils.ts 存在（cn）。radix-ui 已在 dependencies。

## Decisions (with rationale)
1. Slice 存储保持 xywh 规范，x1y1x2y2 派生显示 —— 单一数据源，避免 canvas/export/save 多处同步。
2. handleUpdateSlice 扩展 8 字段联合，内部做 xywh↔角点换算 —— 集中换算逻辑，SliceList 只负责显示与传字段名。
3. 预览缩略图用 background-size 缩放法（scale=64/max(w,h)），容器=w*scale×h*scale，内层=imageW*scale×imageH*scale，position=-x*scale/-y*scale —— 保证任意尺寸切片完整可见。
4. Clear 逻辑放 App.tsx 新增 handleClearAll，传入 SliceList 的 onClear —— 与现有 handle* 同模式。
5. 导出格式选择用 shadcn Dialog（新增 src/components/ui/dialog.tsx，radix-ui Dialog 基底，cn 样式），SliceList 本地 useState(open, format=xywh)，确认回调 onExport(format)；App.handleExportJson 按 format 构造 xywh 或 x1y1x2y2 payload —— 复用项目既有 shadcn 体系，模态符合"确认"语义。

## Scope IN
- src/types.ts：Slice 不变（仅确认）；新增导出格式联合类型 `ExportFormat = 'xywh' | 'x1y1x2y2'` 及编辑字段联合 `SliceEditField`。
- src/components/ui/dialog.tsx：新增 shadcn Dialog 组件（radix-ui Dialog + cn），含 Dialog/DialogTrigger/DialogContent/DialogHeader/DialogTitle/DialogFooter/DialogClose 等。
- src/App.tsx：扩展 handleUpdateSlice 字段联合 + 换算；新增 handleClearAll；handleExportJson 接受 format 参数按格式构造 payload；传 onClear / onExport(format) 给 SliceList。
- src/components/editor/SliceList.tsx：每行双行输入（xywh 上 / x1y1x2y2 下）；新增 Clear 按钮；Export 改为打开 Dialog 选择格式后回调。
- src/components/preview/PreviewGallery.tsx：改行布局 + 缩略图等比缩放。
- src/test/：新增 SliceList.test.tsx（双坐标 + 同步 + Clear + Export Dialog 选择）、App.test.tsx（Clear 清空 state + localStorage；Export 两格式 payload）；更新 PreviewGallery.test.tsx。
- openspec/specs/image-slicing/spec.md：新增 Clear requirement；更新 Slice 编辑（双坐标显示/同步）、Preview（行布局/完整缩略图）、Export（可选 xywh/x1y1x2y2 格式）requirements。
- doc/app-overview.md：同步切片编辑、预览、清空、导出格式说明。

## Scope OUT (Must NOT have)
- 不修改 CanvasModule 坐标交互逻辑（仍消费 xywh）。
- 不修改 useKeyboardShortcuts。
- 不修改 Save 的字段格式（仍 id/name/x/y/w/h）。
- 不新增 x1/y1/x2/y2 到 Slice 类型持久字段。
- 导出 x1y1x2y2 格式仅是输出形状，不改变 Slice 存储。
- 不引入撤销/重做。
- 不接入 image-monitor / info-monitor。
- 不改 MainLayout 分栏比例。
- 不改导出文件名（仍 <base>-slices.json）。

## Open questions
- Q1（owner-decision，已解决）：Clear 按钮点击后需要 window.confirm 二次确认。用户选择"加 window.confirm 二次确认 (推荐)"。
- Q2（owner-decision，已解决）：导出格式选择 UI 用 shadcn Dialog 模态框。用户选择"shadcn Dialog 模态框 (推荐)"，默认格式 xywh。

## Approval gate
status: awaiting-approval
pending-action: write .omo/plans/slice-coords-preview-clear.md
approach: 五组件——C1 SliceList 双行坐标 + App 换算；C2 PreviewGallery 行布局 + 缩放缩略图；C3 Clear 按钮 + handleClearAll + window.confirm；C5 Export 用 shadcn Dialog 选 xywh(默认)/x1y1x2y2；C4 测试 + spec/doc 同步。Slice 存储 xywh 不变，x1y1x2y2 派生。Clear 带 window.confirm。新增 src/components/ui/dialog.tsx。
<!-- When exploration is exhausted and unknowns are answered, set status: awaiting-approval. -->
<!-- That durable record is the loop guard: on a later turn read it and resume at the gate instead of re-running exploration. -->
