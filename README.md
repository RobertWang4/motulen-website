# MOTULEN GROUP 官网

Astro 7 + Tailwind v4 静态站，内容全部来自 `src/content/` 下的 JSON。改 JSON → `npm run build` → 部署 `dist/`。

## 常用命令

```bash
npm install        # 首次
npm run dev        # 本地预览 http://localhost:4321
npm run build      # 生成 dist/
npm run verify     # 检查 dist/：页面齐全、语言互链、站内链接有效、无旧站文字和客户名、合规底注在位
```

## 内容结构

所有文案都在 `src/content/`，模板里不写文字。`zh/` 和 `pl/` 两个目录结构完全相同。

```
src/content/
  site.json                 品牌名、联系方式（邮箱 / 电话 / 两种语言的地址）、默认语言
  zh/ pl/                   两种语言结构完全相同
    ui.json                 导航（含「关于我们」三项说明）、按钮、标签、页脚等界面文字
    home.json               首页：hero（两行标题、视频、按钮）/ 各板块标题 / closing（全站页底共用）
    about.json              MOTULEN GROUP：定位、服务范围、业务布局（01–05 取自服务文件，06 在这里）
    value.json              服务价值：合作价值（5 项）、项目管理方式（3 阶段）
    projects.json           成功案例：intro、5 个案例（正文 + 关联服务 id）、底注
    platform.json           MOTULEN 全球平台：市场布局、运营经验表、跨国团队组织、亚洲人才引进计划
    services.json           5 项服务的顺序（order）和两组的组名（groups）
    services/<id>.json      每项服务：编号、group、标题、photos[]、caption、groups[]、note、plan（规划中）、link
    contact.json            联系页文案
public/img/ppt/             页面照片（文件名见各 JSON 的 photo / photos）
public/img/stock/header-team.jpg  联系页照片
public/video/hero.mp4       首页 hero 视频（缺失时显示 poster）
```

标题里用 `**关键词**` 标出高亮词（每个标题最多一处），由 `src/lib/hl.ts` 转成 `<span class="hl">`。

内容来源：中文/波兰语 PPT 与客户网站要求文档。波兰语凡 PPT 里有的句子逐字取自 PPT；其余为翻译，待客户核对。页面：首页 · 关于我们（MOTULEN GROUP / 服务价值 / 成功案例）· 欧洲服务（5 项）· MOTULEN 全球平台 · 联系我们。

所有 JSON 在构建时用 zod 校验（`src/lib/content.ts`），字段写错会直接报错并指出文件。

## 常见改动

- **换联系方式**：改 `site.json` 的 `contact`。
- **改文案**：中文改 `zh/` 对应文件，波兰语改 `pl/` 同名文件。两边键名必须一致。
- **规划中的服务转为现有能力**：去掉服务 JSON 里的 `plan: true`，并改写 `note`。
- **换图片**：新图放进 `public/img/`，改 JSON 里的 `photo`。

## 部署

已接 GitHub Pages：推送到 `main` 自动构建发布到 https://robertwang4.github.io/motulen-website/ （工作流在 `.github/workflows/deploy.yml`，子路径由 `astro.config.mjs` 里的 `BASE_PATH` 处理）。

换其他托管也可以，`dist/` 是纯静态：

- **Vercel / Netlify**：导入仓库，框架选 Astro，构建命令 `npm run build`，输出目录 `dist`。
- **Cloudflare Pages**：同上。
- 部署前把 `astro.config.mjs` 里的 `site` 改成正式域名（影响 sitemap 和 hreflang）。

## 目录说明

- `docs/superpowers/`：早期改版的设计文档和实施计划（部分已过时）。
- `scripts/verify.mjs`：构建结果检查脚本。
- `demo/`、`aiot logo/`：早期选型资料，仅供参考。
