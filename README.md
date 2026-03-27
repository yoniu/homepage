# Yoniu Moment（开发中）

一个用于发布日常瞬间的微博系统，随时随地掌握瞬间。

前端基于 NextJS(SSG) / React / TypeScript / Ant Design / Axios / ahooks / TailwindCSS 开发。

后端基于 NestJS / TypeScript / TypeORM 开发。

后端仓库（持续开发中）：<https://gitee.com/yoniu/homepage-api>

![主页展示](./screenshot.png)

## 特性

- 移动端支持，随时随地发布 Moment📱💻
- 多种展示方式：图片、视频、音乐、文字
- 每一条 Moment 可以搭配一条音乐，切换 moment 自动播放
- Moment 详情页（信息流可能导致过往日期太久的 moment 无人问津）
- Image Item 图片自动轮播，搭配背景音乐，米米的
- Text Item 支持插入图片多宫格、支持标题显示、Markdown 保存（想换系统顺手的事）、支持背景颜色 / 文字颜色设置
- Video Item 支持视频发布
- 支持 Meting 获取音乐详情（获取的音乐 url 暂时不支持播放）
- 支持文件上传（backblaze: 基于 AWS S3，意思是只要是 AWS S3 类的对象存储都可以）
- 支持友链设置（静态渲染，每次修改友链请**重新构建部署**，对友链双方 SEO 友好）
- 适配 Twikoo / Artalk 评论系统
- 可选接入 51LA v6 网站统计
- 适配百度地图定位

## Todo

- 背景音乐曲库（保存当前使用，下次不用重新添加，直接从曲库里面找。也可以到曲库页面添加。）
- Live Photo Item 支持 Live Photo 发布（web 端无法上传 live photo，后续可能会出 APP，安卓妹别想了）
- 除了 Text Item 其他 Item 支持添加~~浮动文字 (已完成)~~、贴纸
- 加入 AI 支持（可能是根据 moment 内容自动生成背景音乐？）
- ...

## 使用指南

请保证 Node.js 版本 >= 18.18。后端需要运行环境，不是纯静态项目。

推荐宝塔一把梭，也可以使用 Cloudflare Pages 前端，宝塔做后端。

环境变量（没有设置环境变量的东西就在开发目录下面加一个 `.env` 文件）：

```
NEXT_PUBLIC_HOMEPAGE_API=<后端连接>
NEXT_PUBLIC_COMMENT_PROVIDER=<twikoo/artalk，默认 twikoo>
NEXT_PUBLIC_TWIKOO_ENVID=<Twikoo连接>
NEXT_PUBLIC_ARTALK_SERVER=<Artalk 服务端地址>
NEXT_PUBLIC_ARTALK_SITE_NAME=<Artalk 站点名>
NEXT_PUBLIC_ENABLE_V6_ANALYZE=<true/false，默认建议 false>
NEXT_PUBLIC_V6_ID=<51LA V6 ID>
NEXT_PUBLIC_V6_CK=<51LA V6 CK>
NEXT_PUBLIC_SITE_URL=<站点域名，可选，用于 RSS 绝对链接>
RSS_FEED_TITLE=<RSS 标题，可选，默认 Yoniu Moment>
RSS_FEED_DESCRIPTION=<RSS 描述，可选，默认 Latest public moments>
RSS_FEED_LANGUAGE=<RSS 语言，可选，默认 zh-CN>
RSS_CACHE_TTL=<RSS 缓存秒数，可选，默认 600>
```

其中 `NEXT_PUBLIC_COMMENT_PROVIDER=artalk` 时，需要额外配置 `NEXT_PUBLIC_ARTALK_SERVER` / `NEXT_PUBLIC_ARTALK_SITE_NAME`；`NEXT_PUBLIC_ENABLE_V6_ANALYZE=true` 时才会注入 51LA 脚本；如果不需要统计，可以不填 `NEXT_PUBLIC_V6_ID` / `NEXT_PUBLIC_V6_CK`。

安装项目（没 pnpm 也可以使用 npm，最好是 pnpm）:

```bash
pnpm install
```

启动开发模式:

```bash
pnpm dev
```

启动生产方式:

> 生产方式就是打包成静态文件，会在 `./dist` 目录下生成可运行的静态文件。

```bash
pnpm build
```

## RSS

- RSS 使用 **[EdgeOne](https://console.cloud.tencent.com/edgeone/pages)** 作为 Pages Cloud Functions 动态生成，函数文件在 `cloud-functions/rss/index.js`
- RSS 路径为 `/rss`
- 本地调试 RSS 请使用 `edgeone pages dev`，不是 `pnpm dev`
- 至少需要配置 `NEXT_PUBLIC_HOMEPAGE_API`
- 如果希望 RSS 中的分享链接是绝对地址，请配置 `NEXT_PUBLIC_SITE_URL`
