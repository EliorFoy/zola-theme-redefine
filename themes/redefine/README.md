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

## 写作模块（原 Hexo 标签插件 → Tera 组件）

Zola 0.23 移除了 shortcodes，改用 **Tera 组件**。主题在 `templates/components/`
提供与原版标签插件 DOM 一致的组件，可直接写在 Markdown 正文中：

| 原语法 | Zola 组件用法 |
| --- | --- |
| `{% callout warning fa-x::标题 %}…{% endcallout %}` | `{% <callout type="warning" icon="fa-solid fa-x" title="标题"> %}…{% </callout> %}` |
| `{% button 文本, 链接, 图标 %}` | `{{<button text="文本" url="…" icon="fa-solid fa-x" />}}` |
| `{% folding 标题 %}…{% endfolding %}` | `{% <folding title="标题" open=true> %}…{% </folding> %}` |
| `{% grid 3 %}…{% endgrid %}` | `{% <grid cols={3} gap="16px"> %}…{% </grid> %}` |
| `{% tabs %}<!-- tab 名@<i …> -->…{% endtabs %}` | `{% <tabs name="x"> %}<!-- tab 名@<i class="fa-solid fa-star"></i> -->…{% </tabs> %}` |
| `{% mermaid %}`（hexo-filter） | `{% <mermaid> %}graph LR; A-->B;{% </mermaid> %}` |

注意：

- 组件非字符串参数需用 `{2}` 形式传入（如 `cols={3}`）。
- 组件输出会再经过一次 Markdown 渲染，因此组件模板输出必须是不含空行的连续
  HTML 块，否则缩进行会被解析为代码块（tabs 组件已按此约定实现）。
- 旧 note 系列标签已废弃，请统一使用 `callout` 组件。

## 官方文档功能核对清单

对照 redefine-docs（zh/docs）逐项核对的结果：

| 文档章节 | 功能 | 状态 |
| --- | --- | --- |
| basic/info · defaults · colors | 标题/作者/favicon/头像/logo/主色/默认暗色 | ✅ 键名一致，CSS 变量运行时覆盖 |
| basic/global | 自定义字体、内容宽度、侧栏(TOC)宽度、悬停效果、阅读进度、网站统计、单页应用、Open Graph、预加载动画、侧边工具栏、Google Analytics | ✅（字体/宽度等由模板内联 CSS 覆盖；hover.scale 需重编 CSS） |
| basic/fontawesome | thin/light/duotone/sharp_solid | ✅ 条件加载 |
| home/home_banner | 样式 static/fixed、明暗图、标题、打字机副标题、hitokoto、文字颜色/样式、自定义字体、社交链接+二维码 | ✅ |
| home/navbar | auto_hide、渐变背景、宽度、链接+子菜单、本地搜索 | ✅（宽度的区分首页/内页用 CSS `:has` 实现） |
| home/home | 侧栏、日期格式、摘要长度、分类/标签显示 | ✅ |
| posts/articles | 字号/行高/图片圆角/对齐/链接图标/黑幕遮罩/标题间距、字数统计、作者标签、代码块（复制/样式/明暗主题/字体）、目录、版权、懒加载、文章推荐 | ✅（推荐算法以同分类聚合近似；`link_icon` 需站点开启 `markdown.external_links_class = "external-link"`） |
| article_customize | cover/banner、thumbnail、excerpt（自定义/关闭）、sticky、expires | ✅（sticky 显示置顶徽标；Zola 无法按 sticky 值重排序） |
| posts/comment | waline/gitalk/twikoo/giscus/utterances/artalk | ✅ 六套全部移植，`page.extra.comment = false` 可单篇关闭 |
| footer | 运行时间、图标、起始年份、统计、自定义、ICP | ✅ |
| inject | head/footer 注入 | ✅ |
| page_templates | friends、tags（blur/cloud）、categories、masonry、bookmarks | ✅ |
| modules | callout、button、folding、grid、tabs | ✅ 以 Tera 组件实现（见上表） |
| plugins/mermaid | mermaid 图表 + 明暗主题 | ✅ `{% <mermaid> %}` 组件 |
| plugins/aplayer | 固定播放器 | ✅ 配置 `plugins.aplayer.audios` 数组后自动加载 |
| shuoshuo/essays | 本地说说 | ✅ `[[extra.redefine.essays]]` |
| shuoshuo/artitalk | Artitalk 远程说说 | ➖ 与主题无关，用 `inject` 注入 Artitalk JS 即可 |
| plugins/encrypt | 文章加密 | ➖ Hexo 构建期插件无 Zola 等价物；可改用静态站通用的客户端加密方案 |
| plugins/mathjax | LaTeX 公式 | ➖ 通过 `inject` 引入 MathJax/KaTeX（Zola 无内置渲染） |
| plugins/all_minifier | 全站压缩 | ➖ Zola 用 `minify_html = true`；CSS/JS 主题侧已压缩 |
| cdn | 主题资产 CDN | ➖ Zola 主题本地分发，无 npm CDN 概念；可用对象存储镜像 static/ |
| language | en/zh-CN/zh-TW/ja | ✅ `default_language` + `[translations]` + i18n JS（附赠 es/fr） |
| developer | 二次开发 | ✅ 模板/组件均为可读源码，样式构建脚本在 tools/ |

## 与原主题的功能差异

- **分类无层级**：Zola taxonomies 是扁平的，原版的父子分类（A > B）显示为平级。
- **推荐阅读**：原版基于 nodejieba + TF-IDF 余弦相似度（Hexo 构建期插件）；
  静态版以「同分类优先 + 时间序」近似，数量由 CSS 精确截断。
- **搜索**：使用 Zola 内置 fuse 索引（`search_index.<lang>.json`）替换
  hexo-generator-searchdb 的 XML，UI 与关键词高亮逻辑不变。注意 Zola 内置分词
  不支持中文站点用 elasticlunr 语言管道，因此固定使用 fuse 格式。
- **字数统计**：Zola 的 `word_count` 按空白分词（中文按字符计），与 hexo-wordcount
  数值略有差异；阅读时间取 `reading_time`。
- **写作模块**：以 Tera 组件替代 Hexo 标签插件（tabs 为单层实现，不支持 hexo 的
  subtabs/subsubtabs 多层嵌套）。
- **文章加密（hbe）**：JS 资产随主题带入但无构建期加密，等价方案见上表。
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
