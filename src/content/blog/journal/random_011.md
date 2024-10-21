---
title: R#011
pubDatetime: 2024-08-19 23:00:00 +08:00
tags:
  - 随机刊物
description: "2024.08.13 ~ 2024.08.19"
postSlug: random_011
---

## 事件：这一周期发生的(社会/新闻)事情和想法

1. [这个](https://github.com/AriaLyy/Aria/commit/16e1fddca5996c1b2aba8b3284a0389f372ccf0b)，属实对开源有点打击了。

## 阅读：读到的书、文章、视频，摘抄或者想法

无

## 灵感：放到 inbox 中的待办事项，原因及处置进展

1. 从自己经历和最近刷个人 Blog 站点来看，大家写博客、做开源基本都是大学而且集中在大二，似乎博客就是自己学前端孵化的孩子一样，挺好；但是又看到一大片失联的 Blog，寻思着，他们可能是毕业了吧（

## 系统：对系统的调整和输入，比如尝试某个新出来的工具、方法

1. 上周错怪了 AutoBamgumi，是追番工具几乎都不支持历史老番下载。不过已经切成 BGmi 了，虽然下镜像和对接下载软件费了点功夫：主要是镜像源 6 月被 ban，只能走 dockerhub.icu 渠道了，然后也不知道为什么 [这个 docker 版本](https://github.com/codysk/bgmi-docker-all-in-one)总是无法提交 Transmission 任务，换了[Aria2](https://github.com/DDS-Derek/BGmi-All-In-One-Docker?tab=readme-ov-file)的版本好了。不过下载 torrent 时还是有墙的问题，暂时手动修改了 `/bgmi/conf/aria2/aria2.conf`，添加了`all-proxy` 项，观察一下。

2. 有许多统计提醒项，例如信用卡积分兑换里程的提醒，需要我在某个特定的地方记录当前值、提醒的边界值；或者某个 UID 需要添加到追定中；....有不少这样小的需求，我把它归类为：更新数据 -> 设置边界 -> 自动处理 -> 执行提醒。想了下要么自己做个 AllInOne 的 APP，要么只能用 Notion 这种记录方便又有 API 的工具糊一个。考虑到现在需求本身就比较零散，能用要远大于做得好，打算先基于 Notion 搞一下。

## Other：不在以上分类

1. 太 e 了，吃了丙戊酸镁，然后根本睡不着，第二天直接晕车、头疼，不太行，不吃了。
2. 本周还是没空写长文，两天的休息时间完全不够恢复的，考虑一下年假找个安静的地方写文章。
