# 项目概括

## 项目名称
coca-cola-cutter

## 项目简介
coca-cola-cutter 是一个基于 React + TypeScript + Vite 的图像切片工具，用于将一张大图片切割成多个小切片。

## 技术栈
- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS v4 + shadcn/ui
- **UI 组件库**: Radix UI, Lucide React
- **测试**: Vitest + Testing Library

## 功能特性
1. **图片上传** - 支持上传本地图片文件
2. **画布编辑** - 在画布上可视化绘制切片区域
3. **切片管理** - 添加、删除、调整切片的位置和尺寸（x, y, w, h）
4. **预览画廊** - 实时预览切好的图片片段

## 目录结构
```
src/
├── components/      # UI 组件
│   ├── canvas/      # 画布模块
│   ├── controls/   # 控制栏
│   ├── editor/     # 切片编辑器
│   ├── layout/     # 布局组件
│   └── preview/    # 预览组件
├── lib/            # 工具函数
├── test/           # 测试文件
├── App.tsx         # 主应用组件
├── types.ts        # 类型定义
└── index.css       # 全局样式
```

## 运行命令
- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run lint` - 代码检查
- `npm run test` - 运行测试
