## About

基于[Astro](https://astro.build/), 主题来自[astro-paper](https://astro-paper.pages.dev), 参考[zxh.io](https://zxh.io/)做了一些修改。

## Todo

- [x] 迁移旧文章，归档展示
- [x] 文章草稿状态和 badge 支持
- [x] 主页 Layout
- [ ] About 页面 采用 Typst
- [x] 调整归档草稿 typo
- [x] 引入照片展示页
- [ ] Link 页面: 第三方和友链
- [x] 引入清单页面
- [x] 域名和 moe 备案
- [x] 替换 hexo 版本
- [x] 新文章
- [x] 全文 RSS
- [x] 评论

## QA 开发

QA 替代 Records 的主导航位置；Records 列表与详情路由已下线，旧内容保留在
`src/content/blog/record/` 中并设为草稿，不进入搜索与标签列表。

QA 使用独立的 `qa` content collection。`src/content/qa/placeholder.md`
是无真实信息的草稿模板，默认不公开；复制为新文件后填写短标题、脱敏问题和
回复正文，移除 `draft: true` 即可发布到 `/qa/<文件名>/`。标题由编辑拟定，
最多 40 字；`anonymous: true` 隐藏署名和来源链接，否则可填写 `askerName`
和公开来源的 `askerUrl`。

`src/config.ts` 中的 `QA.submitEmail` 默认为空。需要启用邮件投稿时，填写
愿意公开的站主收件地址。提问者邮箱及其他私密联系方式不可写入 frontmatter、
问题或回复正文，也不要将原始来信提交到仓库；schema 拒绝额外字段，但不会
自动识别正文中的个人信息，收录前仍需人工脱敏。

本地预览：`npm run start -- --host 127.0.0.1 --port 4325`，打开 `/qa/`。
