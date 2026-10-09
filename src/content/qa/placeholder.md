---
title: 问答标题模板
question: |
  在这里填写经过脱敏的问题内容。

  可保留段落和编号，不要填写邮箱或其他私密联系方式。
anonymous: true
pubDatetime: 2026-01-01 00:00:00 +08:00
tags:
  - 示例
draft: true
---

在这里填写回复正文，支持 Markdown。

这是不含真实往来信息的草稿模板。复制为新的文件并填写内容后，删除
`draft: true` 即可公开。文件名决定地址：`/qa/<文件名>/`。

公开署名时设 `anonymous: false`，另填 `askerName`；需要引用公开来源时，
可填 `askerUrl`。匿名时姓名和链接都不展示。

这个模板也保证 Astro 2.7 的 QA collection 不为空；没有其他记录时保留它。
