# 视图切换组件架构

## 组件关系

```
┌─────────────────────────────────────────┐
│              调用方                      │
│  TodaySchedule / AllSchedule / Search   │
└──────────┬──────────────┬───────────────┘
           │              │
           ▼              ▼
    ┌──────────┐   ┌──────────┐
    │ IosTabBar│   │ViewToggle│  (default variant)
    └────┬─────┘   └──────────┘
         │
         │ 委托
         ▼
    ┌──────────┐
    │ViewToggle│  (variant="ios")
    └──────────┘
```

## 组件说明

### `ViewToggle`

**文件**：`src/components/ui/ViewToggle.tsx`  
**样式**：`src/styles/Schedule.css` (default) + `src/styles/IosTabBar.css` (ios)

基础切换组件，支持两种视觉变体：

| 属性 | 类型 | 说明 |
|------|------|------|
| `value` | `string` | 当前选中值 |
| `onChange` | `(v: string) => void` | 切换回调 |
| `options` | `ViewToggleOption[]` | 选项列表 |
| `variant` | `"default"` \| `"ios"` | 视觉变体 |
| `floating` | `boolean` | iOS 变体专属：固定底部悬浮 |

**两种变体**：

| 变体 | 样式 | 动画 | 使用场景 |
|------|------|------|----------|
| `default` | `filter-group` / `filter-btn` | 白色滑块滑动 `0.25s` | 桌面端 header 内嵌 |
| `ios` | `ios-tab-bar` / `ios-tab` | 毛玻璃 + 白色滑块 `0.3s` | 移动端底部悬浮 |

两个变体都通过 `::after` 伪元素实现滑块，`active-right` 类触发 `translateX` 滑动。

### `IosTabBar`

**文件**：`src/components/ui/IosTabBar.tsx`

`ViewToggle` 的轻量封装，提供更简洁的 API：

| 属性 | 类型 | 说明 |
|------|------|------|
| `options` | `IosTabOption[]` | 选项（`{ key, icon, label }`） |
| `activeKey` | `string` | 当前选中 key |
| `onChange` | `(key: string) => void` | 切换回调 |
| `floating` | `boolean` | 固定底部悬浮 |

内部委托给 `<ViewToggle variant="ios">`，映射 `key` → `value`。

### `IosFab`

**文件**：`src/components/ui/IosFab.tsx`  
**样式**：`src/styles/Schedule.css`

独立悬浮按钮，与切换组件配合使用：

| 属性 | 类型 | 说明 |
|------|------|------|
| `onClick` | `() => void` | 点击回调 |
| `title` | `string` | 提示文字 |

## 响应式使用模式

```tsx
const isMobile = isBelow("md");

// 桌面端：header 内嵌 ViewToggle + Button
{!isMobile && (
    <>
        <ViewToggle value={mode} onChange={...} options={...} />
        <Button onClick={...}>添加日程</Button>
    </>
)}

// 移动端：底部悬浮 IosTabBar + IosFab
{isMobile && (
    <>
        <IosTabBar activeKey={mode} onChange={...} options={...} floating />
        <IosFab onClick={...} />
    </>
)}
```

## 何时使用哪个

| 场景 | 组件 |
|------|------|
| 桌面端 header 内嵌 | `ViewToggle` (default) |
| 移动端底部悬浮 | `IosTabBar floating` |
| 需要简化 API | `IosTabBar` |
| 悬浮添加按钮 | `IosFab` |
| 搜索筛选等自定义场景 | `ViewToggle` (default) |
