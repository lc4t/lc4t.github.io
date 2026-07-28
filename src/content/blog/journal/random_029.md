---
title: R#029 想好形式，再选工具
pubDatetime: 2024-12-23 01:00:00 +08:00
tags:
  - 随机刊物
description: "2024.12.17 ~ 2024.12.23"
postSlug: random_029
---

## 事件

1. [小米官方 HomeAssistant 插件](https://github.com/XiaoMi/ha_xiaomi_home/blob/main/doc/README_zh.md)。小米开源了官方 HA 插件，再也不用自己调其他第三方插件了，设备增多之后国内生态也开始趋于整合智能化了。

## 信息

1. 用户故事：某个角色通过「该产品」完成某种活动，达成某个价值。这里要确保描述的词语是精准而不通用的。
2. 领域驱动设计(DDD)：这个概念主要是在[Thoughtworks 技术雷达 vol.31](https://www.thoughtworks.com/content/dam/thoughtworks/documents/radar/2024/10/tr_technology_radar_vol_31_cn.pdf)找到的，因为好奇，经过几个月的搜索、理解、研究，我判定这个方法论就是扯淡。思路看着很新，但是这个思路的核心是理解业务，它也没有方法告诉人们怎么理解业务怎么绘制模型。一言以蔽之，太高高在上的理论不足以指导现实。在后续描述的领域叙事对现实的价值更有用，尤其是给不懂具体业务的老板汇报的时候。
3. [Azure 的结构图](https://techcommunity.microsoft.com/blog/azurearchitectureblog/azure-course-blueprints/4338972?WT.mc_id=DT-MVP-5001664)。好复杂，难以想象一个地方出问题要排查多少关联。

## 灵感

1.  带项目有感：项目里程碑应该是某个产品版本而不是功能点；版本计划应该是根据耗时评估的，而不是根据 DDL 再定版本。所以，我打算把不同里程碑用版本号的方式体现出来，把各个任务分配到不同的版本中去。
2.  dot 画图看起来比 mermaid 好看很多，抽空学习一下。
3.  如果要做个人数据的信息化，就不能依赖太多上层系统，必须要把数据以 csv 等形式保留，不然各个 APP 的数据墙非常难搞。

## 系统

1. Linear 没有时间线，版本管理很麻烦，虽然订阅了但是也打算换了，毕竟我只是用它做一个按照 tag 区分的 kanban，当时是因为 Omniplan 在 macOS 上有恶性 bug 才换过去的，现在重新回到 Omniplan。
2. 账单记录换了很多 APP，对它有了新的理解：账单 APP 最主要的功能就是方便速记。如果要做精细的报表分析，每个 APP 都不尽如人意，最终还是要走 Beancount。所以准备筹划写一个 APP 导出 csv 再导入到 Beancount 的小工具。
3. 订阅了[The Wire China](https://www.thewirechina.com/)，一个主要讲中国经济的 Newsletter。
4. 因为要做不同项目之间的关联，重新订阅了 Heptabase，但是 Heptabase 不支持在 Task 维度上使用 kanban，属实有些麻烦。

## Other

1. 我发现这个工作一直在忙，OKR 结算后开始筹划接下来的计划，虽然大体方向是确定的，但是要提前想好要在什么时间点交什么作业；然后计划整理完后就开始跟进度写方案，中间穿插各种打断，忙来忙去又到下一个周期了。这两天待家里写规划，一个项目已经快 400 个关键事项了，而且这样的项目竟然还有好几个，太抽象了。怪不得说很多产品做出来总是被骂呢。
2. 本周有个小伙伴邮件提问了职业发展相关的问题，突然想起来 Blog 是可以挂一个来信的 QA 区，算是对我自己过去想法的积累，顺便也能给世界做点贡献。
