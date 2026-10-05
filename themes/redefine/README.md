# Redefine for Zola

> Fast, Pure, Elegant. —— [hexo-theme-redefine](https://github.com/EvanNotFound/hexo-theme-redefine) 的 Zola 完整迁移版。

这是将 Hexo 主题 **Redefine v2.9.0** 完整迁移到 [Zola](https://www.getzola.org)（要求 **≥ 0.23**）的成果。
视觉与交互 1:1 复刻原主题：首页 Banner、暗色模式、Mac 风格代码块、目录滚动高亮、
本地搜索、Swup 单页过渡、归档时间线、标签云、友链 / 书签 / 相册 / 说说页面、
评论系统（giscus / waline / twikoo / utterances / artalk / gitalk）、阅读统计等。

## 快速开始

```bash
# 本仓库即是一个可直接构建的演示站点
zola build
zola serve
```

在你的站点中使用：

```bash
# 1. 把 themes/redefine 拷贝（或以 git submodule）加入你的站点
# 2. 参考 config.toml，将 [extra.redefine] 与 [translations] 拷贝到你的 config.toml
# 3. 内容结构见下文「内容组织」
```

## 内容组织（与 Hexo 的对应关系）

```
content/
├── _index.md            # 首页（paginate_by = 每页文章数，page_template = "post.html"）
├── *.md                 # 博客文章（与 Hexo 一样位于根 section，URL 为 /文章名/）
├── archives/_index.md   # 归档页（template = "archive.html"）
└── pages/               # 独立页面（page_template = "page.html"）
    ├── about.md
    ├── friends.md       # template = "friends.html"
    ├── bookmarks.md     # template = "bookmarks.md" → bookmarks.html
    ├── essays.md        # template = "essays.html"（说说）
    └── gallery.md       # template = "masonry.html"（相册，数据在 static/masonry/data.json）
```

文章 front matter 示例：

```toml
+++
title = "文章标题"
date = 2024-06-01
updated = 2024-06-02
description = "摘要描述"
[taxonomies]
tags = ["Zola"]
categories = ["技术"]
[extra]
cover = "/images/xxx.webp"   # 封面图（原主题的 cover/banner/thumbnail）
sticky = true                 # 置顶
copyright = "自定义版权 HTML"  # 覆盖默认版权
license = "cc_by"             # 单篇文章的许可协议
+++
正文……
<!-- more -->
摘要之后的内容（首页列表展示 more 之前的部分，与 Hexo 一致）
```

## 配置

所有主题配置位于 `config.toml` 的 `[extra.redefine]` 下，**键名与原版
`_config.yml` 完全一致**（info / colors / global / home_banner / navbar / home /
articles / comment / footer / inject / plugins / page_templates / cdn ...），
迁移已有站点时可以直接照搬原配置值。主要差异：

| 原 Hexo 配置 | Zola 版对应 | 说明 |
| --- | --- | --- |
| `navbar.links`（YAML 映射） | `[[extra.redefine.navbar.links]]` 数组 | TOML 数组保证顺序；`name` 即翻译键，也可直接写显示文本 |
| `home.sidebar.links` | `[[extra.redefine.home.sidebar.links]]` | 同上 |
| `home_banner.subtitle.text` | 数组 | 需写成 TOML 数组 |
| `articles.code_block.highlight_theme.light/dark` | `[markdown.highlighting] light_theme/dark_theme` | 使用 [giallo](https://github.com/getzola/giallo) 主题名（github-light / dark-plus / one-dark-pro ...） |
| hexo-generator-searchdb | `[search] index_format = "fuse_json"` | Zola 内置索引，`fuse_json` 对中文友好 |
| `theme.links`（友链数据） | `[[extra.redefine.links]]` | 页面放在 `content/pages/friends.md` |
| `theme.bookmarks` | `[[extra.redefine.bookmarks]]` | 同上 |
| `theme.essays`（说说） | `[[extra.redefine.essays]]` | `content` 字段支持 HTML |

界面文案在 `[translations]`（对应原版 `languages/*.yml`）；`window.i18n`（供 JS 使用）
由主题静态文件 `static/js/i18n/<lang>.js` 提供，新增语言时同时补充两者。

## 主题资产与构建

主题静态资源（`themes/redefine/static/`）直接取自原主题源码：

- `css/style.css` —— 由原主题 Stylus 源码离线编译（编译时注入默认配置值）；
  运行期的配置差异（主色、导航栏渐变、内容宽度、横幅文字色等）由模板内联的
  `<style>` 变量覆盖实现，无需重新编译 CSS。
- `css/tailwind.css` —— Tailwind v4 扫描本主题模板与 JS 生成，源文件为
  `themes/redefine/css/tailwind.source.css`。改动模板引入新 Tailwind 类后需要重新构建：

  ```bash
  cd themes/redefine/tools && npm i && npm run build:css
  ```

- 语法高亮使用 Zola 0.23 内置的 giallo（VSCode 语法引擎），构建时自动产出
  `giallo-light.css` / `giallo-dark.css`，主题按 `.dark` 类切换（跟随主题明暗按钮）。
- `js/build/main.js` 等 —— 原主题 ES 模块逐文件压缩产物，原样复用；
  仅 `tools/codeBlock.js`（适配 Zola 的 `<pre class="giallo">` DOM）
  与 `tools/localSearch.js`（适配 Zola 搜索索引格式）做了改写，源码与产物保持同步。

## 与原主题的功能差异

- **分类无层级**：Zola taxonomies 是扁平的，原版的父子分类（A > B）显示为平级。
- **推荐阅读**：原版基于 nodejieba + TF-IDF 余弦相似度（Hexo 构建期插件）；
  静态版以「同分类优先 + 时间序」近似，数量由 CSS 精确截断。
- **搜索**：使用 Zola 内置 fuse 索引（`search_index.<lang>.json`）替换
  hexo-generator-searchdb 的 XML，UI 与关键词高亮逻辑不变。注意 Zola 内置分词
  不支持中文站点用 elasticlunr 语言管道，因此固定使用 fuse 格式。
- **字数统计**：Zola 的 `word_count` 按空白分词（中文按字符计），与 hexo-wordcount
  数值略有差异；阅读时间取 `reading_time`。
- **文章加密（hbe）**、APlayer 播放器 UI 已随资产带入但未接入（原版也需额外插件）。
- masonry 相册数据从 `theme.masonry` 改为 `static/masonry/data.json`
  （字段：`image / title / description / width / height`）。

## 目录结构

```
themes/redefine/
├── theme.toml
├── templates/            # Tera 模板（base.html + 各页面 + partials/）
├── static/
│   ├── css/              # style.css（Stylus 编译产物）+ tailwind.css
│   ├── fontawesome/ webfonts/ fonts/ images/ assets/
│   └── js/               # build/（运行时）+ i18n/<lang>.js
├── css/tailwind.source.css
└── tools/                # 重建 tailwind.css 的脚本
```

## 许可

沿用原主题 [GPL-3.0](https://github.com/EvanNotFound/hexo-theme-redefine) 协议。
主题信息保留于页脚（`powered by Zola · theme Redefine`），是对原作者的尊重，请勿移除。
