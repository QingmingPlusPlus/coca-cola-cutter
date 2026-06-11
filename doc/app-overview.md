# 应用模块说明

本文档描述当前代码实现状态。长期行为约束见 `openspec/specs/image-slicing/spec.md`。

## 应用边界

coca-cola-cutter 当前是纯前端单页工具，没有后端、持久化、导出下载或多图片工作区。用户上传的图片通过 `URL.createObjectURL` 存在浏览器会话内；切片、辅助线和选中项都保存在 React state 中。

## 状态模型

核心状态集中在 `src/App.tsx`：

| 状态 | 类型 | 说明 |
| --- | --- | --- |
| `imageMeta` | `ImageMeta \| null` | 当前图片文件名、宽高、大小、类型和 object URL |
| `slices` | `Slice[]` | 切片矩形，坐标和尺寸使用原图像素 |
| `mode` | `CanvasMode` | 当前交互模式：切片、垂直辅助线、水平辅助线、选择 |
| `guideLines` | `GuideLine[]` | 辅助线集合，按方向保存单一像素位置 |
| `selectedItem` | `{ type, id } \| null` | 当前选中的切片或辅助线 |

`src/types.ts` 是这些数据结构的唯一公共类型入口。新增字段或模式时，先改类型，再同步所有消费组件和测试。

## 组件分工

| 路径 | 职责 |
| --- | --- |
| `src/App.tsx` | 上传图片、重置工作区、创建/删除/更新切片和辅助线、连接快捷键 |
| `src/components/layout/MainLayout.tsx` | 固定全屏双栏布局，左侧画布+控制栏，右侧切片列表+预览 |
| `src/components/canvas/CanvasModule.tsx` | 根据当前模式处理鼠标事件、坐标换算、绘制切片覆盖层、辅助线和拖拽 |
| `src/components/controls/ControlBar.tsx` | 文件上传入口、图片元信息、当前非切片模式提示、清空辅助线按钮 |
| `src/components/editor/SliceList.tsx` | 切片数量、手动新增、删除、编辑 `x/y/w/h` |
| `src/components/preview/PreviewGallery.tsx` | 用 `background-position` 从原图显示切片预览，并展示快捷键提示 |
| `src/hooks/useKeyboardShortcuts.ts` | 全局模式快捷键和删除选中项；输入框聚焦时跳过 |
| `src/components/image-monitor/*` | 独立图片查看/拖放上传原型，当前未接入 `App.tsx` |
| `src/components/info-monitor/index.tsx` | 占位信息模块，当前未接入 `App.tsx` |

## 交互流程

### 上传图片

`ControlBar` 选择文件后调用 `App.handleUpload`。`Image` 对象加载完成后写入 `imageMeta`，并清空 `slices`、`guideLines`、`selectedItem`，模式重置为 `slice`。

### 绘制切片

`CanvasModule` 在 `slice` 模式下监听 `mousedown`、`mousemove`、`mouseup`。坐标由画布容器的边界和滚动偏移换算为图像内坐标。拖拽宽高大于 2 像素时才创建切片，最终数值四舍五入。

### 辅助线

快捷键 `v` 和 `h` 分别进入垂直/水平辅助线模式。点击画布即在当前 `x` 或 `y` 坐标新增辅助线。鼠标移动显示预览线，控制栏可一次清空全部辅助线。

### 选择与移动

快捷键 `s` 进入选择模式。点击切片或辅助线后可拖动位置；按 `d` 删除当前选中项；按 `Escape` 回到切片模式并清空选择。

### 预览

`PreviewGallery` 遍历 `slices`，以切片宽高作为容器尺寸，用上传图片作为背景图，并通过负的 `x/y` 偏移显示对应局部。当前预览容器最大尺寸限制为 `150px`，大切片缩放策略仍是待完善项。

## 当前限制

- 没有导出、下载或保存切片配置。
- 没有将切片和辅助线限制在图片边界内。
- 没有撤销/重做。
- 上传新图片时未显式 revoke 旧 object URL。
- `image-monitor` 和 `info-monitor` 不是主应用流程的一部分。

## 验证入口

- 单元/组件测试：`npm run test`
- 类型与打包验证：`npm run build`
- 静态检查：`npm run lint`
