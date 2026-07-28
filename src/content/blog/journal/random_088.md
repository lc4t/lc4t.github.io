---
title: R#088 Vibe Coding!
pubDatetime: 2026-2-9 23:59:59 +08:00
tags:
  - 随机刊物
description: "2026.2.3 ~ 2026.2.9"
postSlug: random_088
---

## 事件

1. [《网络犯罪防治法（征求意见稿）》公开征求意见的公告](https://www.mps.gov.cn/n2254536/n4904355/c10386242/content.html)：监管实质上是一件好事，相比原本地方自主决策的浮动，有法可依意味着边界更清晰了，希望后续能逐渐替代口袋罪。

## 信息

无

## 灵感

1. 首先是写复杂项目遇到的问题，我觉得不能让高级模型做所有的事情，它应该只用来做 PM，然后指挥一堆 code agent 来干活就好，这类似 Agent Team 或者 multi-agent ，但是我这里的 Code Agent 是不同 IDE，例如 cursor、opencode，主要是尽可能压榨不同 IDE 免费 token 用的

   这就涉及到拆分需求，目前，我是通过：plan->task: `doc->dev->test->doc->commit` -> next task -> end plan 这样的循环来让 code agent 工作的

2. 说起 Agent，现在的 Agent 主要是用来解决当前用户的指令，集中在 vibe coding 领域，但是我想 AI 的趋势是让不懂黑箱的人也能用，那么怎么让不懂 Agent 设计的人也能写一个 Agent 呢？怕是需要一个 Agent Designer 来当 PM，最终实现产物也是一个 Agent
3. 那么，这个 Agent 也没有必要运行在本地， 就会出现 Agent as a Service 服务，一个小白也可以设计自己的 Agent，而不只是一个简单的对话服务，目前，这部分工作还是需要一个有软件开发经验的人来操盘
4. 不过这与云 IDE 有点像？但侧重点似乎不同，云 IDE 还是在用 AI 解决开发的问题，而 AaaS 是解决一人公司的问题
5. 没有什么是加一个中间层解决不了的，之前的 AI 安全还在说 LLM 的问题，后面应该认真看看安全到底要在 Agent 的哪一层了——至少，function call 和 tool call 得插个安全层吧

## 系统

1. 已卸载 openclaw，我相信暴力堆叠鼠标、键盘操作，是没法在不确定的情况下执行高危操作的，不过 openclaw 和 virustotal 合作对 skill 进行扫描是个好事，与我无关了
2. 因为 token 实在是不够用，开了 OpenRouter、Codex 等各种服务，现在，用一个聪明的模型当 PM，其他子功能都用更轻量免费的模型来实现，也算是手动 Agent Team 了
3. chatlog 真不错，及时备份吧

## Other

1. 心跳太强的问题去检查后发现是心悸，说不能喝咖啡了——不过我也不怎么喜欢喝咖啡，我将捐出未来 1 年所有的咖啡券！
