+++
title = "写作模块演示"
date = 2024-11-20
description = "演示 Callout、按钮、折叠、网格、选项卡与 Mermaid 图表。"
[taxonomies]
tags = ["Markdown", "Redefine"]
categories = ["写作"]
[extra]
sticky = true
+++
这一页演示从 Hexo 标签插件迁移而来的 Zola Tera 组件（0.23 起取代 shortcodes）。

<!-- more -->

## Callout 提示

{% <callout type="info"> %}
这是一条 **info** 简单提示。
{% </callout> %}

{% <callout type="warning" icon="fa-solid fa-triangle-exclamation" title="带标题的警告"> %}
提供 `title` 参数即可渲染带标题样式。
{% </callout> %}

## 按钮

{{<button text="打开 Zola 官网" url="https://www.getzola.org" icon="fa-solid fa-arrow-up-right-from-square" target="_blank" />}}

{{<button text="大号居中按钮" url="#" size="lg" align="center" />}}

## 折叠

{% <folding title="点开查看折叠内容"> %}
这里是被折叠的 **Markdown** 内容。

- 支持列表
- 支持 `代码`

```js
console.log("hello folding");
```
{% </folding> %}

## 网格

{% <grid cols={2} gap="16px"> %}
{% <callout type="success"> %}左边的成功提示。{% </callout> %}
{% <callout type="danger"> %}右边的危险提示。{% </callout> %}
{% </grid> %}

## 选项卡

{% <tabs name="demo-tabs"> %}
<!-- tab 第一步@<i class="fa-solid fa-flag"></i> -->
第一步的内容。
<!-- endtab -->
<!-- tab 第二步@<i class="fa-solid fa-pen"></i> -->
第二步的内容。
<!-- endtab -->
<!-- tab 第三步 -->
第三步的内容。
{% </tabs> %}

## Mermaid

{% <mermaid> %}
graph LR;
    A[写文章] --> B{选择模块};
    B --> C[Callout];
    B --> D[Tabs];
    B --> E[Grid];
{% </mermaid> %}
