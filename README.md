# Redefine for Zola

> **Fast, Pure, Elegant.** —— Hexo 人气主题 [hexo-theme-redefine](https://github.com/EvanNotFound/hexo-theme-redefine) 的 Zola 完整移植版。

[![License: GPL-3.0](https://img.shields.io/badge/License-GPL--3.0-blue.svg)](LICENSE)
[![Zola](https://img.shields.io/badge/Zola-%E2%89%A50.23-orange)](https://www.getzola.org)
[![Upstream](https://img.shields.io/badge/upstream-hexo--theme--redefine%20v2.9.0-red)](https://github.com/EvanNotFound/hexo-theme-redefine)

---

> ## 致谢与出处（重要）
>
> 本项目是 [EvanNotFound](https://github.com/EvanNotFound) 开发的 Hexo 主题
> **[Redefine](https://github.com/EvanNotFound/hexo-theme-redefine)**（v2.9.0）向
> [Zola](https://www.getzola.org) 平台的移植版本。
>
> - 全部设计、交互与视觉均来自原项目，感谢原作者的杰出工作
> - 原项目采用 **GPL-3.0** 协议，本移植版同样以 **GPL-3.0** 开源（见 [LICENSE](LICENSE)）
> - 原主题文档：<https://redefine-docs.ohevan.com> · 原版演示：<https://redefine.ohevan.com>
> - 页脚保留了原主题署名（`theme Redefine`），请勿移除，这是对原作者的尊重

## 简介

将 Redefine 主题从 Hexo 平台完整迁移到 Zola：模板逐文件移植（EJS → Tera）、
样式原样复用（Stylus 编译产物 + Tailwind v4）、JS 交互层原样复用并适配 Zola 的
DOM 约定。视觉与交互和原版一致，同时获得 Zola 的构建速度与单二进制部署体验。

**已验证的特性**：首页 Banner（打字机副标题 / 社交链接 / hitokoto）、明暗模式
（含语法高亮双主题联动）、Mac 风格代码块（行号 / 复制 / 折叠）、目录滚动高亮、
本地搜索、Swup 单页过渡、归档时间线、标签云、分类 / 友链 / 书签 / 说说 / 相册、
六套评论系统、KaTeX·MathJax 公式、Mermaid 图表、APlayer 播放器、外链图标、
阅读统计等。逐项核对清单见
[themes/redefine/README.md](themes/redefine/README.md#官方文档功能核对清单)。

## 快速开始

```bash
git clone https://github.com/EliorFoy/zola-theme-redefine.git
cd zola-theme-redefine
zola serve   # http://127.0.0.1:1111 —— 本仓库即为可构建的演示站点
```

在自己的站点使用：

1. 将 `themes/redefine/` 拷贝（或 git submodule）到你的站点
2. 参考 [config.toml](config.toml)，把 `[extra.redefine]` 与 `[translations]`
   拷入你的 `zola.toml`（键名与原版 `_config.yml` 一一对应）
3. 内容结构见 [themes/redefine/README.md](themes/redefine/README.md#内容组织与-hexo-的对应关系)

要求 **Zola ≥ 0.23**（下载：<https://www.getzola.org/documentation/getting-started/installation/>）。

## 从 Hexo 博客迁移

```bash
# front matter 自动转换（tags/categories/excerpt/sticky/... → Zola 格式）
node themes/redefine/tools/hexo-to-zola.mjs <hexo 的 source 目录或单个 .md> <你的 content 目录>
```

配套说明：

- Hexo 独立页面（`source/xxx/index.md`）→ Zola 的 `content/xxx/_index.md`（section）
- `source/_data/links.yml` → `config.toml` 的 `[[extra.redefine.links]]`
- 写作模块（`{% note %}` `{% tabs %}` 等 Hexo 标签）→ 同 DOM 的 Tera 组件，
  对照表见 [themes/redefine/README.md](themes/redefine/README.md#写作模块原-hexo-标签插件--tera-组件)
- ```mermaid 代码块无需改动，运行时自动渲染

## 与原版的差异

少量平台级差异（分类无层级、推荐算法近似、文章加密无等价物等）已完整记录在
[themes/redefine/README.md](themes/redefine/README.md#与原主题的功能差异) 与
[MIGRATION.md](MIGRATION.md)。

## 文档

| 文档 | 内容 |
| --- | --- |
| [themes/redefine/README.md](themes/redefine/README.md) | 主题使用手册：内容组织、配置映射、写作组件、功能核对清单 |
| [MIGRATION.md](MIGRATION.md) | 迁移过程记录、Zola 0.23 的坑、构建工具说明 |
| [原主题文档](https://redefine-docs.ohevan.com) | 配置项语义与原版一致，可直接参考 |

## 贡献

欢迎 issue / PR。修改模板后需要重建 Tailwind 产物时：

```bash
cd themes/redefine/tools && npm i && npm run build:css
```

## License

本项目基于 [hexo-theme-redefine](https://github.com/EvanNotFound/hexo-theme-redefine)
（© [EvanNotFound](https://github.com/EvanNotFound)）移植，遵循
[GPL-3.0](LICENSE) 协议开源。移植与修改部分同样以 GPL-3.0 发布。
