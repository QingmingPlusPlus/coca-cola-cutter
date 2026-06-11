# 项目概括

## 项目名称

coca-cola-cutter

## 项目简介

coca-cola-cutter 是一个基于 React + TypeScript + Vite 的图片切片工具。当前实现聚焦单张图片工作区：上传本地图片，在原图像素坐标上绘制矩形切片，添加辅助线，选择并移动切片或辅助线，并在右侧实时预览切片结果。

更细的模块现状见 `doc/app-overview.md`。

## 技术栈

- 前端框架：React 18 + TypeScript
- 构建工具：Vite
- 样式：Tailwind CSS v4 + shadcn/ui 约定
- UI 依赖：Radix UI、Lucide React
- 测试：Vitest + Testing Library

## 当前主流程

1. 上传本地图片，读取图片宽高、文件名、大小和 MIME 类型。
2. 在画布上按原图坐标拖拽生成切片。
3. 通过快捷键切换辅助线、选择和切片模式。
4. 在右侧列表编辑切片坐标与尺寸。
5. 在预览区按切片矩形展示图片局部。

## 目录结构

```text
src/
├── components/
│   ├── canvas/       # 原图画布、切片绘制、辅助线与拖拽
│   ├── controls/     # 上传与当前图片信息
│   ├── editor/       # 切片列表与坐标编辑
│   ├── layout/       # 双栏主布局
│   ├── preview/      # 切片预览与模式提示
│   ├── image-monitor/# 未接入主应用的候选图片查看模块
│   └── info-monitor/ # 未接入主应用的占位信息模块
├── hooks/            # 全局快捷键
├── lib/              # 通用工具
├── test/             # Vitest 测试
├── App.tsx           # 应用状态与模块编排
└── types.ts          # 核心数据类型
```

## 运行命令

- `npm run dev`：启动开发服务器
- `npm run build`：TypeScript 构建并打包
- `npm run lint`：运行 ESLint
- `npm run test`：运行 Vitest
