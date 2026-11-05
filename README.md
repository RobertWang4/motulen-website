# MOTULEN GROUP 官网

Astro 7 + Tailwind v4 静态站，内容全部来自 `src/content/` 下的 JSON。改 JSON → `npm run build` → 部署 `dist/`。

## 常用命令

```bash
npm install        # 首次
npm run dev        # 本地预览 http://localhost:4321
npm run build      # 生成 dist/
npm run verify     # 检查 dist/：页面齐全、语言互链、无旧站文字、合规底注在位
```

## 内容结构

所有文案都在 `src/content/`，模板里不写文字。`zh/` 和 `pl/` 两个目录结构完全相同。

```
src/content/
  site.json                 品牌名、联系方式（邮箱 / 电话 / 两种语言的地址）、默认语言
  zh/ pl/
    ui.json                 导航、按钮、标签、页脚等界面文字
    home.json               首页：hero / facts / statement / services / band / markets / approach / values / closing
    about.json              关于：定位、五个市场、现有运营经验表、跨国团队
    services.json           业务页文案 + 六条业务的顺序（order）
    services/<id>.json      每条业务：编号、标题、副标题、status(current|planned)、photo、groups[]、note
    approach.json           合作方式：三阶段 stages + 五项价值 values（首页也读这里）
    projects.json           项目经验表
    contact.json            联系页文案
public/img/stock/           当前使用的生成图；换实拍时放新图，改 JSON 里的 photo 字段
```

所有 JSON 在构建时用 zod 校验（`src/lib/content.ts`），字段写错会直接报错并指出文件。

## 常见改动

- **换联系方式**：改 `site.json` 的 `contact`。
- **改文案**：中文改 `zh/` 对应文件，波兰语改 `pl/` 同名文件。两边键名必须一致。
- **业务从"发展中"转为现有业务**：把该业务 JSON 的 `status` 改成 `current`，并改写 `note`。
- **换图片**：新图放进 `public/img/`，改 JSON 里的 `photo`。

## 部署

已接 GitHub Pages：推送到 `main` 自动构建发布到 https://robertwang4.github.io/motulen-website/ （工作流在 `.github/workflows/deploy.yml`，子路径由 `astro.config.mjs` 里的 `BASE_PATH` 处理）。

换其他托管也可以，`dist/` 是纯静态：

- **Vercel / Netlify**：导入仓库，框架选 Astro，构建命令 `npm run build`，输出目录 `dist`。
- **Cloudflare Pages**：同上。
- 部署前把 `astro.config.mjs` 里的 `site` 改成正式域名（影响 sitemap 和 hreflang）。

## 目录说明

- `docs/superpowers/`：本次改版的设计文档和实施计划。
- `scripts/verify.mjs`：构建结果检查脚本。
- `demo/`、`aiot logo/`：早期选型资料，仅供参考。
