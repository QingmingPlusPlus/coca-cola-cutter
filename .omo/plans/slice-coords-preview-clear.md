# slice-coords-preview-clear - Work Plan

## TL;DR (For humans)
<!-- Fill this LAST, after the detailed plan below is written, so it summarizes the REAL plan. -->
<!-- Plain English for a non-engineer: NO file paths, NO todo numbers, NO wave/agent/tool names. -->

**What you'll get:** 切片列表里每个切片同时显示两套坐标——上面的「x y 宽 高」和下面的「左上角右下角(x1 y1 x2 y2)」，改任意一个另一套自动跟着变；预览区改成一行一个切片、缩略图按比例缩小到能完整看到整个切片；保存按钮旁加一个清空按钮（会弹确认框），点确认后清掉当前图片、所有切片、辅助线和已保存的工作区；导出按钮点一下会弹一个小窗口让你选导出格式——「xywh」或「x1y1x2y2」（默认 xywh）。

**Why this approach:** 切片的数据只存「x y 宽 高」一套，下排的角点坐标是算出来显示的——这样画布、保存、导出都只用一套数据，不会出现两份对不上的情况；清空和导出格式选择都是不可逆/影响输出结果的操作，所以清空加了二次确认、导出加了格式选择弹窗，避免误操作。

**What it will NOT do:** 不改画布上的拖拽画切片和选择逻辑；不改变保存功能的格式（仍存 x y 宽 高）；不会把角点坐标存成切片的固定字段；不改变导出文件名；不接撤销/重做；不接入那两个还没连进主流程的图片/信息模块。

**Effort:** Medium
**Risk:** Low - 改的都是右栏的切片列表和预览，以及一个新弹窗组件；画布交互和数据存储不动
**Decisions to sanity-check:** (1) 改下排的 x1 时「宽」会按「保持右下角不动」来变（x1 左移则宽变大）——符合角点编辑直觉；(2) 清空会连已保存的工作区一起清掉；(3) 缩略图固定缩到最长边 64 像素

Your next move: 批准后用 `$start-work` 开始执行，或先跑一轮高精度评审再开工。Full execution detail follows below.

---

> TL;DR (machine): Medium effort, Low risk — 5 components (dual-coord SliceList, row-preview, Clear+confirm, export format Dialog, tests/spec/doc) on React+TS image-slicer, single-source xywh storage.

## Scope
### Must have
- **C1 双坐标显示**：`SliceList` 每个切片行渲染两行输入——上排 `X Y W H`，下排 `X1 Y1 X2 Y2`，8 值同时显示；编辑任一字段另一行的对应派生值即时同步更新。`Slice` 类型仍只存 `x/y/w/h`，`x1y1x2y2` 为派生显示。
- **C1 换算语义**：`handleUpdateSlice` 字段联合扩展为 8 字段，内部换算——编辑 `x/y/w/h` 直接改该字段（移动/缩放矩形：编辑 x 保持 w，故 x2=x+w 随之移动）；编辑 `x1`→`x=x1, w=(旧x+旧w)-x1`（保持对角 x2 不动）；编辑 `x2`→`w=x2-x`（保持 x 不动）；编辑 `y1`→`y=y1, h=(旧y+旧h)-y1`；编辑 `y2`→`h=y2-y`。负值不夹紧。**语义锁定（Metis gap 修复）**：顶行 X/Y/W/H 是规范存储字段，编辑=移动/缩放矩形；底行 x1y1x2y2 是角点编辑，编辑一角=保持对角不动。X 与 x1 显示同值但编辑语义不同，这是有意的角点编辑模型（类 Photoshop），不是 bug。换算必须在 `setSlices` 的 map 回调内读取旧 `s.x`/`s.w` 等再产出新对象（闭包内 s 即旧值）。
- **C2 PreviewGallery 行布局**：改为一行一切片（纵向滚动列表），每行 `[缩略图][名称+重命名控件]`。
- **C2 完整缩略图**：`scale = 64 / max(w,h)`，**并做容错**（Metis gap 修复）：`const maxDim = Math.max(slice.w, slice.h); const scale = maxDim > 0 ? Math.min(1, 64 / maxDim) : 1;`（maxDim ≤ 0 时 scale=1，避免 Infinity/NaN/负 scale；scale 上限 1 不放大小切片）。容器 `= max(1, round(w*scale)) × max(1, round(h*scale))`（负/零维度用 max(1,…) 兜底为 1px，避免 0/负 CSS 尺寸）；内层背景图 `= imageW*scale × imageH×scale`，`backgroundPosition = -round(x*scale) / -round(y*scale)`，`backgroundSize = imageW×scale × imageH×scale`。任意尺寸切片完整可见，不裁切。负 w/h 切片显示为 1px 容器（退化态，不崩）。
- **C3 Clear 按钮**：`Save` 按钮旁新增 `Clear` 按钮（红色危险样式），**位置锁定**：按钮区顺序为 `Save → Clear → Export JSON → + Add Slice`（Clear 紧邻 Save 之后）。点击 → `window.confirm("Clear all slices, guides, the current image, and the saved workspace? This cannot be undone.")` 二次确认 → 清空 `imageMeta`/`slices`/`guideLines`/`selectedItem`、`mode→slice`、`saveStatus→null`（锁定为 null，与 handleUpload 一致 App.tsx:68），并 `localStorage.removeItem(WORKSPACE_STORAGE_KEY)`。确认框取消则不清空。**不调用 `URL.revokeObjectURL(imageMeta.url)`**——imageMeta.url 是 FileReader 产生的 data URL（App.tsx:53,72），非 object URL，revoke 会抛错，显式排除。
- **C5 Export 格式选择**：新增 `src/components/ui/dialog.tsx`（shadcn Dialog，radix-ui Dialog 基底 + `cn`）。`SliceList` 本地 `useState(open)` + `useState(format:'xywh')`，点击 Export 打开 Dialog，含两个单选（xywh 默认选中 / x1y1x2y2）+ 确认/取消。确认回调 `onExport(format)`。
- **C5 导出 payload**：`handleExportJson(format)` —— xywh: `{imageName, slices:[{name,x,y,w,h}]}`（现状）；x1y1x2y2: `{imageName, slices:[{name,x1,y1,x2,y2}]}`，`x1=x,y1=y,x2=x+w,y2=y+h`。两种格式都不含辅助线/选中项/模式。文件名仍 `<base>-slices.json`。无图时 Export 仍 disabled。
- **C4 测试**：新增 `src/test/SliceList.test.tsx`（双坐标显示、编辑 x1/x2 同步、Clear 触发 onClear、Export Dialog 打开与格式回调）、`src/test/App.test.tsx`（Clear 清空 state + localStorage、Export 两格式 payload）；更新 `src/test/PreviewGallery.test.tsx`（行布局、名称仍可见、缩略图不裁切逻辑）。
- **C4 spec 更新**：`openspec/specs/image-slicing/spec.md` 新增 Clear requirement；更新 "Slices are named editable rectangles"（双坐标显示/同步）、"Preview uses the same source image"（行布局/完整缩略图）、"Slice data can be exported as JSON"（可选 xywh/x1y1x2y2 格式，默认 xywh）requirements 及其 scenarios。
- **C4 文档同步**：`doc/app-overview.md` 同步切片编辑（双坐标）、预览（行布局/缩略图）、清空按钮、导出格式选择说明。
- **类型新增**：`src/types.ts` 新增 `ExportFormat = 'xywh' | 'x1y1x2y2'` 与 `SliceEditField = 'x'|'y'|'w'|'h'|'x1'|'y1'|'x2'|'y2'`。`Slice` 接口不变。

### Must NOT have (guardrails, anti-slop, scope boundaries)
- 不修改 `CanvasModule` 坐标交互逻辑（仍消费 xywh，拖拽创建仍产出 xywh）。
- 不修改 `useKeyboardShortcuts`。
- 不修改 `Save` 的字段格式（仍 `id/name/x/y/w/h`）。
- 不新增 `x1/y1/x2/y2` 到 `Slice` 类型持久字段——x1y1x2y2 仅派生显示与导出输出形状。
- 不改导出文件名（仍 `<base>-slices.json`，不随格式变化）。
- 不引入撤销/重做。
- 不接入 `image-monitor` / `info-monitor`。
- 不改 `MainLayout` 分栏比例，不改 SliceList/PreviewGallery 各占右栏 `h-1/2`。
- 不删除 PreviewGallery 现有重命名控件与底部模式提示面板。
- Clear 不夹紧为"仅清空切片"——必须清空全部当前态 + localStorage。
- Export Dialog 不用原生 `window.confirm`——必须用 shadcn Dialog（含遮罩/ESC/焦点陷阱/a11y）。
- 不为 C5 引入除 radix-ui Dialog 外的新依赖（radix-ui 已在 dependencies）。

## Verification strategy
> Zero human intervention - all verification is agent-executed.
- Test decision: tests-after + framework Vitest + @testing-library/react（jsdom）+ `npm run build`（tsc 类型检查）+ `npm run lint`。
- 单元/组件测试覆盖：C1 双坐标显示与双向同步、C3 Clear（含 confirm 取消路径）、C5 Export Dialog（打开/格式选择/回调）、C5 两格式 payload（mock URL.createObjectURL + 捕获 Blob 内容）、C2 行布局与缩略图缩放（断言容器尺寸 = round(w*scale) 等）。
- jsdom 限制说明：radix-ui Dialog 的真实焦点陷阱/动画在 jsdom 下不完整，测试只断言语义可达性（dialog role、单选可达、确认按钮点击触发回调），不依赖真实 focus-trap 行为。
- Evidence: 每个任务将关键命令输出/截图存入 `.omo/evidence/task-<N>-slice-coords-preview-clear.<ext>`（文本日志 `.log`，截图 `.png`）。
- 最终验证波次：F1 计划符合性审计、F2 代码质量审查、F3 真实手动 QA（`npm run dev` 浏览器实测）、F4 范围保真。全部 APPROVE 才算完成。

## Execution strategy
### Parallel execution waves
> Wave 0（无依赖可全并行）：T1 类型、T2 Dialog 组件、T3 PreviewGallery 布局。
> Wave 1（依赖 T1 的类型）：T4 App 换算+Clear+导出格式、T5 SliceList 双坐标+Clear按钮+Export Dialog。
> Wave 2（依赖 T1/T4/T5）：T6 测试套件。
> Wave 3（依赖全部实现）：T7 spec + doc 同步。
> Wave 4（最终验证，并行）：F1-F4。

### Dependency matrix
| Todo | Depends on | Blocks | Can parallelize with |
| --- | --- | --- | --- |
| T1 types | — | T4, T5, T6 | T2, T3 |
| T2 Dialog 组件 | — | T5, T6 | T1, T3 |
| T3 PreviewGallery 布局 | — | T6 | T1, T2 |
| T4 App 换算/Clear/导出 | T1 | T6 | T2, T3, T5 |
| T5 SliceList 双坐标/Clear/Export Dialog | T1, T2 | T6 | T3, T4 |
| T6 测试套件 | T1, T2, T3, T4, T5 | F1-F4 | T7 |
| T7 spec + doc 同步 | T1-T6（行为已定稿） | F1, F4 | — |

## Todos
> Implementation + Test = ONE todo. Never separate.
<!-- APPEND TASK BATCHES BELOW THIS LINE WITH edit/apply_patch - never rewrite the headers above. -->

- [ ] 1. 新增类型定义（ExportFormat / SliceEditField）
  What to do / Must NOT do: 在 `src/types.ts` 新增 `export type ExportFormat = 'xywh' | 'x1y1x2y2';` 与 `export type SliceEditField = 'x' | 'y' | 'w' | 'h' | 'x1' | 'y1' | 'x2' | 'y2';`。**不修改** `Slice`、`ImageMeta`、`CanvasMode`、`GuideLine` 等任何现有接口。`Slice` 保持 `{id,name,x,y,w,h}`。
  Parallelization: Wave 0 | Blocked by: — | Blocks: T4, T5, T6
  References (executor has NO interview context): `src/types.ts:1-8`（Slice 接口现状）；`src/App.tsx:91`（handleUpdateSlice 当前 field 类型 `"x"|"y"|"w"|"h"`，需被 SliceEditField 替代）；`tsconfig.app.json`（strict 模式，新类型必须被消费否则 noUnusedLocals 报错——本任务只定义，消费在 T4/T5）。
  Acceptance criteria (agent-executable): `npm run build`（即 `tsc -b && vite build`）通过，无类型错误；`grep -n "ExportFormat\|SliceEditField" src/types.ts` 输出两行定义。
  QA scenarios: happy — 新增两类型后 `npm run build` 成功；failure — 若误改 Slice 接口加 x1 等字段，则 CanvasModule 等消费处 tsc 应报错（验证未发生）。Evidence `.omo/evidence/task-1-slice-coords-preview-clear.log`
  Commit: Y | feat(types): add ExportFormat and SliceEditField types for dual-coord display and export choice

- [ ] 2. 新增 shadcn Dialog 组件（src/components/ui/dialog.tsx）
  What to do / Must NOT do: 新建 `src/components/ui/dialog.tsx`，导出 `Dialog`、`DialogTrigger`、`DialogContent`、`DialogHeader`、`DialogTitle`、`DialogDescription`、`DialogFooter`、`DialogClose`、`DialogOverlay`（Metis gap 修复：完整含 DialogDescription 供 aria-describedby、DialogOverlay 供遮罩，均为 shadcn dialog.tsx 标准件，SliceList 用到 Description）。基于 `radix-ui` 的 `Dialog` primitive（**已验证** umbrella 包导出 Dialog，用 `import { Dialog as DialogPrimitive } from "radix-ui"`，访问 `.Root/.Trigger/.Portal/.Overlay/.Content/.Close/.Title/.Description`）。样式用 `cn`（`@/lib/utils`）+ Tailwind v4 类，遵循 `src/components/ui/button.tsx` 的 new-york 风格。`DialogOverlay`：`fixed inset-0 z-50 bg-black/50`；`DialogContent`：`fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border bg-background p-6 shadow-lg rounded-lg`，含 `<DialogOverlay>` 与 `aria-describedby` 转发（radix 内建）；`DialogHeader`/`DialogFooter` 为布局 wrapper（flex + gap）；`DialogTitle`/`DialogDescription` 转发 `asChild`。含 ESC 关闭、focus-trap（radix 内建）。用 `forwardRef` 包装各件（仿 button.tsx:41-62）。**Must NOT** 引入新依赖；**Must NOT** 自实现 focus-trap/portal（用 radix 内建）。**Must NOT** 改动 button.tsx。
  Parallelization: Wave 0 | Blocked by: — | Blocks: T5, T6
  References: `src/components/ui/button.tsx:1-64`（现有 shadcn 组件范式：React import + cva + Slot + cn@@/lib/utils + forwardRef 模式 + variants）；`components.json`（style=new-york, cssVariables, aliases @/* → src/*）；`src/lib/utils.ts`（`cn` 函数存在）；`package.json:16`（`radix-ui: ^1.4.3` 在 dependencies）；`tsconfig.json`（@/* → ./src/* 别名生效）。**已验证**：`radix-ui` umbrella 包导出 `Dialog`（实测 `Object.keys(require('radix-ui'))` 含 `"Dialog"`），无需额外依赖、无需 `@radix-ui/react-dialog`。
  Acceptance criteria: `npm run build` 通过；`npm run lint` 通过；`grep -n "DialogDescription\|DialogOverlay\|DialogContent\|DialogTitle" src/components/ui/dialog.tsx` 输出存在；文件导出上述 9 个符号。
  QA scenarios: happy — Dialog 组件可被 SliceList 导入并 `npm run build` 成功（radix-ui 已确认导出 Dialog，无需补依赖）；failure — 若误用 `@radix-ui/react-dialog` 而该包未直接安装，应改回 umbrella `radix-ui` 导入。Evidence `.omo/evidence/task-2-slice-coords-preview-clear.log`（含 build 输出）
  Commit: Y | feat(ui): add shadcn Dialog component for export format selection

- [ ] 3. PreviewGallery 改行布局 + 完整缩略图
  What to do / Must NOT do: 重写 `src/components/preview/PreviewGallery.tsx` 的切片渲染部分——容器从 `flex flex-wrap content-start gap-4`（:87）改为 `flex flex-col gap-2`（纵向滚动列表，一行一切片）。每行结构：左缩略图 + 右名称/重命名（用 `flex items-center gap-3`）。缩略图缩放：`const scale = Math.min(1, 64 / Math.max(slice.w, slice.h, 1))`（w/h ≤0 时 max(…,1) 容错避免除零/Infinity；scale 上限 1 不放大小切片）；外容器 `style={{ width: Math.max(1, Math.round(slice.w*scale)), height: Math.max(1, Math.round(slice.h*scale)) }}` + `border bg-white overflow-hidden relative flex-shrink-0`；内层背景 div `style={{ width: imageMeta.width*scale, height: imageMeta.height*scale, backgroundImage: url(...), backgroundPosition: `-${Math.round(slice.x*scale)}px -${Math.round(slice.y*scale)}px`, backgroundRepeat:'no-repeat', backgroundSize: `${imageMeta.width*scale}px ${imageMeta.height*scale}px` }}`。删除现有 :95-108 的 `maxWidth:150px/maxHeight:150px` 裁切 + TODO 注释。名称区保留现有重命名逻辑（editingId/draftName/commitEditing/cancelEditing）与铅笔按钮，宽度自适应行。**保留**底部 MODE_INFO 模式提示面板（:171-194 原样不动）。**保留** `mode`/`selectedItem` props 与 selected 高亮（若 slice 被选中，缩略图容器加 ring）。**Must NOT** 改 props 接口签名（仍 slices/imageMeta/mode?/selectedItem?/onRename?）。**Must NOT** 改 MODE_INFO 常量。
  Parallelization: Wave 0 | Blocked by: — | Blocks: T6
  References: `src/components/preview/PreviewGallery.tsx:82-170`（当前列布局与裁切逻辑）、`:171-194`（MODE_INFO 面板保留）、`:18-53`（MODE_INFO 常量保留）、`:1-16`（props 接口不变）；`src/test/PreviewGallery.test.tsx:20-24`（现有断言 `getByText("logo")` + `queryByText("#1")`，行布局后须仍通过——名称文本仍在 DOM）；`doc/app-overview.md:56-58`（预览说明待 T7 同步）。
  Acceptance criteria: `npm run build` 通过；`npm run test -- PreviewGallery` 通过（现有 2 测试 + T6 新增）；手动在浏览器（F3 QA）每个切片缩略图完整可见不被裁切。
  QA scenarios: happy — 大切片（w=800,h=600）缩略图按 scale 缩放完整可见，容器约 64×48；小切片（w=32,h=32）scale=1 容器 32×32 不放大；现有重命名测试仍绿。failure — w=0 或 h=0 切片不产生 NaN/Infinity（max(…,1) 容错）。Evidence `.omo/evidence/task-3-slice-coords-preview-clear.png`（dev 截图）+ `.log`
  Commit: Y | feat(preview): row-per-slice layout with proportional full thumbnail

- [ ] 4. App 扩展 handleUpdateSlice 换算 + handleClearAll + handleExportJson(format)
  What to do / Must NOT do: 在 `src/App.tsx`——(a) `handleUpdateSlice` 签名改为 `(id: string, field: SliceEditField, value: number)`（import SliceEditField from types）。换算在 `setSlices` 的 map 回调内读取旧 `s`（闭包内即旧值）产出新对象：
  ```
  setSlices(slices.map((s) => {
    if (s.id !== id) return s;
    switch (field) {
      case 'x':  return { ...s, x: value };
      case 'y':  return { ...s, y: value };
      case 'w':  return { ...s, w: value };
      case 'h':  return { ...s, h: value };
      case 'x1': return { ...s, x: value, w: s.w + (s.x - value) };  // 保持 x2=s.x+s.w 不动
      case 'y1': return { ...s, y: value, h: s.h + (s.y - value) };
      case 'x2': return { ...s, w: value - s.x };
      case 'y2': return { ...s, h: value - s.y };
    }
  }));
  ```
  负 w/h 不夹紧。(b) 新增 `handleClearAll`：`if (!window.confirm("Clear all slices, guides, the current image, and the saved workspace? This cannot be undone.")) return;` 然后 `setImageMeta(null); setSlices([]); setMode("slice"); setGuideLines([]); setSelectedItem(null); setSaveStatus(null); localStorage.removeItem(WORKSPACE_STORAGE_KEY);`。**不调 URL.revokeObjectURL**（imageMeta.url 是 data URL，App.tsx:53/72）。(c) `handleExportJson` 改为 `(format: ExportFormat)`（import ExportFormat），按 format 构造 payload：xywh 沿用 `slices.map(({name,x,y,w,h})=>({name,x,y,w,h}))`；x1y1x2y2 用 `slices.map(({name,x,y,w,h})=>({name, x1:x, y1:y, x2:x+w, y2:y+h}))`。其余 Blob/下载逻辑不变，文件名不变。(d) **SliceList 接线显式改**（Metis gap 修复，App.tsx:223-235）：加 `onClear={handleClearAll}`；`onExport={handleExportJson}` 保持传函数引用（SliceList 调用时传 format）。import 新类型 `{ ImageMeta, Slice, CanvasMode, GuideLine, ExportFormat, SliceEditField }`。**Must NOT** 改 Save（handleSaveWorkspace 仍 id/name/x/y/w/h）。**Must NOT** 改 CanvasModule 的 handleCanvasAddSlice。**Must NOT** 把 confirm 逻辑放 SliceList——confirm 在 App。
  Parallelization: Wave 1 | Blocked by: T1 | Blocks: T6 | Can parallelize with: T2, T3, T5
  References: `src/App.tsx:91-95`（handleUpdateSlice 现状，需替换为 switch 换算）；`src/App.tsx:112-127`（handleExportJson 现状，需加 format 参数 + x1y1x2y2 分支）；`src/App.tsx:15`（WORKSPACE_STORAGE_KEY）；`src/App.tsx:32-48`（restore 逻辑，Clear 后 removeItem 保证不再 restore）；`src/App.tsx:129-146`（Save 不改）；`src/App.tsx:223-235`（SliceList props 接线，**显式加 onClear + onExport 传 format**）；`src/types.ts`（SliceEditField, ExportFormat，T1 产出）。
  Acceptance criteria: `npm run build` 通过（SliceEditField/ExportFormat 被消费，无 noUnusedLocals）；`npm run lint` 通过；switch 穷尽 8 case（noFallthroughCasesInSwitch 满足）。
  QA scenarios: happy — 编辑 x1 时 w 同步 = 旧x+旧w-新x1 且 x2 保持；编辑 x 时 w 不变、x2 随移；Clear confirm 取消时 state 不变、confirm 确认时全部清空且 localStorage.removeItem 被调；Export('x1y1x2y2') payload 含 x1/y1/x2/y2；Export('xywh') payload 含 x/y/w/h。failure — Clear confirm 返回 false 时不应 removeItem。Evidence `.omo/evidence/task-4-slice-coords-preview-clear.log`（build+lint 输出）
  Commit: Y | feat(app): dual-coord conversion, clear-all, and format-aware export

- [ ] 5. SliceList 双坐标行 + Clear 按钮 + Export Dialog
  What to do / Must NOT do: 在 `src/components/editor/SliceList.tsx`——(a) **props 接口显式改签名**（Metis gap 修复）：`onUpdate: (id: string, field: SliceEditField, value: number) => void`（从 `"x"|"y"|"w"|"h"` 扩到 8 字段）；`onExport: (format: ExportFormat) => void`（从 `() => void` 改）；新增 `onClear: () => void`；import `{ Slice, ImageMeta, ExportFormat, SliceEditField }` 与 Dialog 组件。(b) 顶部按钮区**顺序锁定**：`Save → Clear → Export JSON → + Add Slice`。Save（:34-40）之后新增 `Clear` 按钮——红色 `bg-red-600 hover:bg-red-700 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed text-white px-2 py-1 rounded text-xs`，`onClick={onClear}`，`disabled={!imageMeta}`，`data-testid="clear-button"`。(c) Export 按钮（:41-47）改为打开 Dialog——加 `const [exportOpen, setExportOpen] = useState(false); const [exportFormat, setExportFormat] = useState<ExportFormat>('xywh');`，Export 按钮 `onClick={() => { setExportFormat('xywh'); setExportOpen(true); }}`，`data-testid="export-button"`。Dialog：`<Dialog open={exportOpen} onOpenChange={setExportOpen}><DialogContent><DialogHeader><DialogTitle>Export slices</DialogTitle><DialogDescription>Choose the coordinate format for the exported JSON.</DialogDescription></DialogHeader>` + 两个原生 radio（`data-testid="format-xywh"` checked={exportFormat==='xywh'} onChange=()=>setExportFormat('xywh')；`data-testid="format-x1y1x2y2"` checked={exportFormat==='x1y1x2y2'} onChange=()=>setExportFormat('x1y1x2y2')，带 label）+ `<DialogFooter>` 含 Cancel（`<DialogClose asChild><button data-testid="export-cancel">Cancel</button></DialogClose>`）与 Export（`data-testid="export-confirm"` `onClick={() => { onExport(exportFormat); setExportOpen(false); }}`）。(d) 每个切片行从单行 4 字段改为**双行**：容器加 `data-testid="slice-row"`；现有 `grid-cols-4`（:63-68）作为上排 xywh（InputGroup label X/Y/W/H，onChange onUpdate(id,'x',v) 等）；下方新增第二排 `grid-cols-4` 为 x1y1x2y2，InputGroup label X1/Y1/X2/Y2，value 派生 `slice.x / slice.y / slice.x+slice.w / slice.y+slice.h`，onChange `onUpdate(slice.id,'x1',v)` 等。两排复用 `InputGroup`。**Must NOT** 在 SliceList 内做 xywh 换算数学（仅 x2=x+w/y2=y+h 派生显示供 value）；换算集中在 App（T4）。**Must NOT** 自实现 modal——必须用 T2 的 Dialog。
  Parallelization: Wave 1 | Blocked by: T1, T2 | Blocks: T6 | Can parallelize with: T3, T4
  References: `src/components/editor/SliceList.tsx:1-12`（props 接口，**显式改 onUpdate/onExport 签名 + 加 onClear**）；`:24-55`（按钮区，顺序 Save→Clear→Export→Add）；`:56-83`（切片行，改双行 + data-testid="slice-row"）；`:88-99`（InputGroup 复用）；`src/components/ui/dialog.tsx`（T2 产出，用 Dialog/DialogTrigger/DialogContent/DialogHeader/DialogTitle/DialogDescription/DialogFooter/DialogClose）；`src/types.ts`（ExportFormat, SliceEditField，T1 产出）；`src/App.tsx:223-235`（App 传 onClear/onExport(format)）。
  Acceptance criteria: `npm run build` 通过；`npm run lint` 通过；`npm run test -- SliceList` 通过（T6 新增）；props 接口 onUpdate 字段类型为 SliceEditField、onExport 为 (format:ExportFormat)=>void。
  QA scenarios: happy — 上排改 x → 下排 x2 显示更新；下排改 x1 → 上排 x 与 w 同步；Clear 按钮点击触发 onClear（App 内 confirm）；Export 点击打开 Dialog，选 x1y1x2y2 + 确认触发 onExport('x1y1x2y2')；取消不调 onExport。failure — Dialog 取消不应调 onExport。Evidence `.omo/evidence/task-5-slice-coords-preview-clear.png`（dev Dialog 截图）+ `.log`
  Commit: Y | feat(slicelist): dual-coord rows, clear button, and export format dialog

- [ ] 6. 测试套件（SliceList.test + App.test + 更新 PreviewGallery.test）
  What to do / Must NOT do: (a) 新建 `src/test/SliceList.test.tsx`：测 1 双坐标显示（渲染一个 slice，断言上排 4 input value = xywh、下排 4 input value = x1=x / y1=y / x2=x+w / y2=y+h 派生）；测 2 编辑 x1 同步（fireEvent.change 下排 x1 input → 期望 onUpdate 被以 ('id','x1',newVal) 调用）；测 3 编辑 x2 同步（onUpdate ('id','x2',val)）；测 4 Clear 按钮点击触发 onClear（fireEvent.click Clear → onClear called once）；测 5 Export Dialog 打开 + 格式回调（click Export → getByRole('dialog') 可见 / getByText('Export slices') → 选 x1y1x2y2 radio → click 确认 → onExport called with 'x1y1x2y2'）；测 6 Export Dialog 取消**不**调用 onExport（click Cancel/DialogClose → onExport 未被调用）。(b) 新建 `src/test/App.test.tsx`：**测试前必备 mock**（Metis gap 修复）——
    - `vi.spyOn(window, 'confirm')`：jsdom 的 window.confirm 默认返回 false，**必须 mock**；Clear 确认路径 mockReturnValue(true)，取消路径 mockReturnValue(false)。
    - `URL.createObjectURL`/`URL.revokeObjectURL`：jsdom 不实现，**必须 mock** 为返回固定字符串（如 'blob:mock'）；`HTMLAnchorElement.prototype.click` mock 为空函数（阻止下载）；导出测试通过捕获 `Blob` 文本验证 payload（在 mock 的 createObjectURL 里读取传入的 Blob，或 spy `Blob` 构造）。
    - 图片加载：`App.handleUpload` 用 FileReader+Image；jsdom 的 Image 不触发真实 onload。用 `vi.spyOn(global, 'Image')` mock 一个设置 src 时同步调用 onload 的假 Image，或直接预设 state 通过重新 render。推荐 mock Image。
    测 1 Clear 确认（confirm=true → slices/imageMeta 清空、`localStorage.getItem(WORKSPACE_STORAGE_KEY)` 为 null、removeItem 被调）；测 2 Clear 取消（confirm=false → removeItem **不**被调、state 不变）；测 3 Export xywh payload（JSON 含 x/y/w/h、不含 x1/y1/x2/y2、不含 guides）；测 4 Export x1y1x2y2 payload（JSON 含 x1/y1/x2/y2 且 = x/y/x+w/y+h、不含 x/y/w/h）；测 5 导出文件名两格式一致（两格式下 link.download 均为 `<base>-slices.json`）。**(c) 更新 `src/test/PreviewGallery.test.tsx`**：保留现有名称显示 + 重命名测试（行布局后仍通过——`getByText("logo")` / `getByLabelText("Rename logo")` 均基于文本/label，与布局无关）；新增测 3 行布局（断言 `getAllByTestId('preview-row')` 长度 = slices.length）；新增测 4 缩略图不裁切 + 缩放（渲染 w=800,h=600 切片 + imageMeta 800×600，断言缩略图容器 style.width = round(800 * min(1, 64/800)) = 64 且内层背景 div style.width = 64）；新增测 5 退化态（w=0,h=0 切片不产生 NaN/Infinity，容器 style.width/height 不为 NaN——`expect(style.width).not.toBeNaN()`，用 `Number(style.width)` 判断）。给 PreviewGallery 行加 `data-testid="preview-row"`（T3 实现）。**jsdom Dialog 限制声明**：radix Dialog 用 Portal+focus-trap，jsdom 下 focus-trap 不完整，测试只断言语义可达性（`getByRole('dialog')`、radio 可点击、确认按钮触发回调），不断言真实焦点移动；focus-trap 行为由 F3 手动 QA 验证。**Must NOT** 删除现有 PreviewGallery 测试。**Must NOT** 依赖 jsdom 不支持的 focus-trap/真实下载。
  Parallelization: Wave 2 | Blocked by: T1, T2, T3, T4, T5 | Blocks: F1-F4 | Can parallelize with: T7
  References: `src/test/PreviewGallery.test.tsx:1-46`（现有测试范式）；`src/test/CanvasModule.test.tsx:1-298`（mock getBoundingClientRect 范式）；`src/test/setup.ts`（仅 import jest-dom）；`vitest.config.ts`（jsdom env）；`src/components/editor/SliceList.tsx`（T5 产出，需 data-testid 约定：行容器 data-testid="slice-row"、Clear 按钮 data-testid="clear-button"、Export 按钮 data-testid="export-button"、Dialog 确认 data-testid="export-confirm"、取消 data-testid="export-cancel"、两 radio data-testid="format-xywh"/"format-x1y1x2y2"）；`src/App.tsx`（T4 产出）；`src/components/preview/PreviewGallery.tsx`（T3 产出，data-testid="preview-row"）。jsdom 限制依据：jsdom 不实现 URL.createObjectURL、window.confirm 默认 false、无真实焦点管理。
  Acceptance criteria: `npm run test` 全绿（现有 2 文件 + 新增 2 文件 + PreviewGallery 新增 2-3 测试）；`npm run build` 通过；`npm run lint` 通过；App.test 中 Clear 确认路径断言 `localStorage.getItem(WORKSPACE_STORAGE_KEY) === null`，取消路径断言 removeItem 未被调（`vi.spyOn(localStorage,'removeItem')` toHaveBeenCalledTimes(0)）。
  QA scenarios: happy — 所有测试通过含双坐标/同步/Clear 双路径/Export 双格式/文件名一致/退化态不崩。failure — 若漏 mock window.confirm，Clear 确认测试会假性通过（confirm 默认 false 无操作）——必须 mock 才能真正测到清空逻辑。Evidence `.omo/evidence/task-6-slice-coords-preview-clear.log`（test 全量输出）
  Commit: Y | test: add SliceList/App tests with jsdom mocks and update PreviewGallery tests

- [ ] 7. spec + doc 同步（image-slicing spec / app-overview / memory-map）
  What to do / Must NOT do: (a) `openspec/specs/image-slicing/spec.md`——新增 requirement "Workspace state can be cleared"（Clear action 清空全部当前态 + localStorage，需 window.confirm 二次确认，含两个 scenario：确认清空 + 取消不清空；并显式说明 Clear 属持久化行为变更，满足 spec.md:156-163 meta-requirement）；更新 "Slices are named editable rectangles" requirement——**必须改写**（Metis gap 修复）现有 scenario "A slice field is edited"（spec.md:50-52 "WHEN the user changes x,y,w,or h THEN only that field changes"）为：编辑 xywh 字段改该字段；新增 scenario "A slice shows both xywh and x1y1x2y2 coordinates"（8 值同显、x1=x/y1=y/x2=x+w/y2=y+h 派生）；新增 scenario "Editing x1/x2/y1/y2 syncs xywh"（编辑一角保持对角不动：x1→x=x1,w=(旧x+旧w)-x1；x2→w=x2-x；y1/y2 同理）——**不要保留旧的 "only that field changes" scenario**，因 x1y1x2y2 编辑会同时改两个字段，与旧 scenario 矛盾。更新 "Preview uses the same source image and slice coordinates"——新增 scenario 行布局 + 完整缩略图缩放（每行一切片、scale=min(1,64/max(w,h))、退化态 w/h≤0 不崩）。更新 "Slice data can be exported as JSON"——**改写**现有 scenario "Current slices are exported"（spec.md:128-134 "each exported slice includes only name,x,y,w,h"）为：导出可选格式，默认 xywh（含 name/x/y/w/h）；新增 scenario "Export with x1y1x2y2 format"（含 name/x1/y1/x2/y2，x1=x/y1=y/x2=x+w/y2=y+h，不含 guides/selection/mode，文件名仍 <base>-slices.json）；两种格式都不含辅助线/选中项/模式。(b) `doc/app-overview.md`——更新组件分工表 SliceList 行（双坐标编辑 + Clear 按钮 + Export 格式选择 Dialog）、PreviewGallery 行（行布局 + 缩略图缩放）；更新交互流程 "预览" 段（行布局/缩放）；新增 "清空工作区" 段（Clear 按钮 + confirm + 清空范围，不含 revoke data URL）；更新 "导出 JSON" 段（可选 xywh/x1y1x2y2 格式，默认 xywh，文件名不变）；更新状态模型表（saveStatus 仍存，Clear 重置为 null）。(c) `doc/agent-memory-map.md`——确认现有路由行仍匹配；新增 `src/components/ui/dialog.tsx` 路由行（先读 doc/app-overview.md，触发 `<none>` skill——dialog 是通用 UI 原语非主流程，改后同步 app-overview 组件分工）。**Must NOT** 把一次性实现细节写进 skill。**Must NOT** 改 `.agents/skills/image-slicing-development/SKILL.md`（本变更未引入新稳定重复流程）。
  Parallelization: Wave 3 | Blocked by: T1-T6（行为定稿） | Blocks: F1, F4 | Can parallelize with: —
  References: `openspec/specs/image-slicing/spec.md:38-59`（Slices editable，**必须改写** :50-52 旧 scenario）；`:113-122`（Preview，补行布局 scenario）；`:124-134`（Export JSON，**必须改写** :128-134 旧 "only name,x,y,w,h" 为可选格式 + 新增 x1y1x2y2 scenario）；`:136-154`（Save，不改）；`:156-163`（新增持久化/导出需更新 spec 的 meta-requirement，本次 Clear 与 Export 格式变更均满足）；`doc/app-overview.md:24-36`（组件分工表）、`:56-58`（预览段）、`:60-66`（导出/临时保存段）；`doc/agent-memory-map.md:5-12`（路由表，确认 + 加 dialog 行）。
  Acceptance criteria: `grep -n "cleared\|clear" openspec/specs/image-slicing/spec.md` 输出新 requirement；`grep -n "x1y1x2y2\|export format" openspec/specs/image-slicing/spec.md` 输出更新；`grep -n "only.*that field changes" openspec/specs/image-slicing/spec.md` **应无输出**（旧 scenario 已被改写移除）；`grep -n "Clear\|清空" doc/app-overview.md` 输出新段；`grep -n "dialog" doc/agent-memory-map.md` 输出新路由行。文档无 broken 路径。
  QA scenarios: happy — spec 新 requirement 含 Given/When/Then scenario、旧矛盾 scenario 已改写、doc 与实现一致。failure — 若漏改写旧 "only that field changes" / "only name,x,y,w,h" scenario，F1 审计应捕获为 spec 矛盾。Evidence `.omo/evidence/task-7-slice-coords-preview-clear.md`（diff 摘要）
  Commit: Y | docs(spec,doc): document clear-all, dual-coord display, row preview, and export format choice

## Final verification wave
> Runs in parallel after ALL todos. ALL must APPROVE. Surface results and wait for the user's explicit okay before declaring complete.
- [ ] F1. Plan compliance audit — 核对每个 Must-have 是否由某 todo 覆盖、每个 Must-NOT-have 是否被遵守；特别核对 spec 是否显式更新（meta-requirement :156-163）；核对 Slice 存储 xywh 不变、x1y1x2y2 仅派生。
- [ ] F2. Code quality review — `npm run lint` + `npm run build` 全绿；无 noUnusedLocals/any 滥用；换算逻辑集中在 App、SliceList 仅派生显示；Dialog 用 radix a11y。
- [ ] F3. Real manual QA — `npm run dev` 浏览器实测：(1) 上传图、画切片、改上排 x 看下排 x2 同步、改下排 x1 看上排 x/w 同步；(2) 大切片预览完整不裁切；(3) 点 Clear → confirm → 全清 + 刷新不再 restore；(4) Export → Dialog → 选 x1y1x2y2 → 下载 JSON 含 x1/y1/x2/y2；(5) Export 取消不下载。截图存 evidence。
- [ ] F4. Scope fidelity — 确认未改 CanvasModule/快捷键/Save 格式/文件名/分栏比例；未接入 image-monitor/info-monitor；未加 x1y1x2y2 到 Slice 持久字段。

## Commit strategy
- 每个 todo 独立原子提交（见各 todo Commit 行），类型 feat/test/docs，scope 按模块。
- 不 squash（保持可回溯）；不 amend。
- 顺序：T1 → (T2,T3 并行) → (T4,T5 并行，依赖 T1/T2) → T6 → T7 → 最终验证。
- 最终验证若发现回归，新增 fix 提交而非 amend。
- 提交前 `git status`/`git diff` 检查，仅暂存本计划范围文件，不夹带无关改动（dirty_worktree 风险）。

## Success criteria
- `npm run test` 全绿（含新增 SliceList.test、App.test、PreviewGallery.test 新增用例）。
- `npm run build` + `npm run lint` 全绿。
- 浏览器实测 F3 五项全通过。
- `openspec/specs/image-slicing/spec.md` 含 Clear requirement 与双坐标/行预览/导出格式选择 scenario。
- `doc/app-overview.md` 组件分工与交互流程描述与实现一致。
- Slice 类型仍仅 `{id,name,x,y,w/h}`，x1y1x2y2 不入持久字段。
- Clear 带 window.confirm 二次确认；Export 用 shadcn Dialog 选择格式，默认 xywh。
