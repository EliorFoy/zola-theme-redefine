+++
title = "Hello Redefine for Zola"
date = 2024-06-01
updated = 2024-06-02
description = "第一篇示例文章：展示 Markdown 渲染、代码高亮、图片、引用等排版元素。"
[taxonomies]
tags = ["Zola", "Redefine", "博客"]
categories = ["技术"]
+++
欢迎来到 **Redefine for Zola**！这是 [hexo-theme-redefine](https://github.com/evannotfound/hexo-theme-redefine) 主题向 [Zola](https://www.getzola.org) 平台的完整迁移版本。

<!-- more -->

## 文本排版

支持 *斜体*、**粗体**、~~删除线~~、`行内代码`、[链接](https://www.getzola.org) 等基本排版。

> 这是一段引用文字。Fast, Pure, Elegant.

## 代码块

```rust
fn main() {
    let greeting = "Hello, Redefine!";
    println!("{}", greeting);
}
```

```python
def fib(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a

print(fib(10))
```

## 列表

1. 有序列表项一
2. 有序列表项二
   - 嵌套无序项
   - 另一个嵌套项

## 表格

| 特性 | Hexo 版 | Zola 版 |
| ---- | ------- | ------- |
| 模板引擎 | EJS | Tera |
| 样式 | Stylus + Tailwind | 预编译 CSS + Tailwind |
| 高亮 | highlight.js | giallo（亮/暗双主题） |
| 搜索 | searchdb | elasticlunr |

## 图片

![示例图片](/images/redefine-logo.webp)
