# Redefine for Zola —— 完整迁移说明

将 [hexo-theme-redefine](https://github.com/evannotfound/hexo-theme-redefine) v2.9.0
完整迁移至 Zola（≥ 0.23.0）。

## 成果

```
zola-theme-redefine/
├── config.toml            # 站点配置：[extra.redefine] 与原版 _config.yml 键名一一对应
├── content/               # 演示内容（文章、归档、关于、友链、书签、说说、相册）
├── static/masonry/data.json
└── themes/redefine/       # ★ 主题本体（可整个目录拷走复用）
    ├── theme.toml
    ├── README.md          # 使用文档 + 迁移映射 + 差异说明
    ├── templates/         # Tera 模板（原 EJS 模板的 1:1 移植）
    ├── static/            # 原 Stylus 编译 CSS + Tailwind + 原版 JS/字体/图标
    ├── css/tailwind.source.css
    └── tools/             # 重建 tailwind.css 的 npm 脚本
```

## 迁移要点

| 层面 | Hexo 原版 | Zola 版方案 |
| --- | --- | --- |
| 模板 | EJS（layout/pages/components） | Tera（base.html 继承 + partials include） |
| 样式 | Stylus（hexo-config 注入） | 离线编译为 style.css，配置差异由模板内联 CSS 变量覆盖 |
| 工具类 CSS | Tailwind v4 扫描 EJS | Tailwind v4 扫描 Tera 模板 + JS |
| 代码高亮 | hexo highlight + hljs 主题 | giallo class 模式（light/dark 双主题，构建期产出两份 CSS） |
| 代码块 DOM | `figure.highlight` | JS 将 Zola 的 `pre.giallo` 包装为相同结构，复用全部样式与复制/折叠按钮 |
| 搜索 | hexo-generator-searchdb (XML) | Zola `fuse_json` 索引，改写 localSearch.js 数据源解析 |
| 暗色切换 | `html.dark` + hljs 主题 class | 相同；giallo 双 CSS 通过 link.disabled 联动切换 |
| 运行时配置 | `export_config()` 注入 window.theme | Tera 直接输出 `config.extra.redefine | json_encode` |
| i18n | languages/*.yml（模板 __() + JS window.i18n） | `[translations]`（trans()）+ static/js/i18n/*.js |
| 分页 | hexo paginator | Zola paginator（首页 `paginate_by`），DOM 还原相同 class |
| 归档 | 按 YAML 分组年份 | `group_by(attribute="year")` + 时间线 DOM 复用 |
| TOC | hexo toc() 递归 | Zola `page.toc` 树，固定 6 层展开（0.23 不支持 Tera macro） |

构建过程的重要发现（供后续维护）：

1. **Zola 0.23 移除了 Tera 的 `import` 与 `macro` 标签** —— 宏只能定义/使用在同一文件内；
   本主题除 TOC 外全部改用 `{% include %}` 传上下文。
2. **不可用的 Tera 过滤器/test**：`slice`、`map`、`trim_start_matches`、`starting_with`、
   `containing` 等；可用替代：`nth`、`split`、`regex_replace`、`json_encode`、`group_by`。
3. **`paginator.total_pages`** 在 0.23 中是"内容页数"，分页器页数要用 `number_pagers`。
4. **搜索索引语言**：`zh` / `zh-CN` 不在 elasticlunr 支持列表，中文站必须用 `fuse_json`。
5. 子模板顶层只允许 `{% extends %}` / block / component；共享变量需在 base.html 顶层 `set`。

## 验证结果（2026-10-05）

- `zola build` 通过：9 页面 + 2 section + atom.xml/sitemap/搜索索引/giallo 双主题 CSS。
- 浏览器实测（Chrome，1440px 桌面 + 390px 移动）：
  - 首页 Banner、打字机副标题、社交链接、文章卡片、分页、侧栏（公告/头像/等级/统计）✓
  - 文章页：元信息、字数/阅读时长、TOC 滚动高亮、Mac 代码块（复制/折叠按钮）、
    版权卡片、推荐阅读、图片查看器容器 ✓
  - 暗色模式切换 + 语法高亮双主题联动 ✓
  - 本地搜索（fuse 索引加载 + 关键词高亮）✓
  - 归档时间线、标签 blur 云、分类卡片、友链、书签、说说、相册、404 ✓
  - 移动端抽屉菜单（导航 + 侧栏链接去重）✓
  - 控制台无错误（仅搜索输入框缺少 id/name 的 a11y 提示，与原版一致）✓
- 与官方演示站 redefine.ohevan.com 逐屏对比，视觉与交互一致；
  已知差异（分类层级、推荐算法、字数统计口径）记录于 themes/redefine/README.md。

## 后续可选项

- `zola serve` 常驻预览：`zola.exe serve --port 1188 --interface 127.0.0.1`
- 发布到 GitHub Pages / Vercel：`zola build` 产物在 `public/`
