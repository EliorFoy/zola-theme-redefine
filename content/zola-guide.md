+++
title = "使用 Zola 构建静态博客"
date = 2024-09-20
description = "Zola 的安装、目录结构与构建流程简介。"
[taxonomies]
tags = ["Zola", "静态站点"]
categories = ["技术"]
+++
Zola 是一个使用 Rust 编写的静态站点生成器，单二进制文件、构建速度快。

## 安装

<!-- more -->

```bash
# Windows (winget)
winget install getzola.zola

# macOS
brew install zola
```

## 常用命令

```bash
zola init my-site   # 初始化站点
zola serve          # 本地预览（支持热重载）
zola build          # 构建到 public/
```

## 目录结构

- `content/`：Markdown 内容
- `templates/`：Tera 模板
- `static/`：静态资源
- `themes/`：主题
