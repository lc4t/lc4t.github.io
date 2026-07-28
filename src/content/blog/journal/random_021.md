---
title: R#021 平台和用户之争
pubDatetime: 2024-10-28 01:00:00 +08:00
tags:
  - 随机刊物
description: "2024.10.22 ~ 2024.10.28"
postSlug: random_021
---

## 事件

1.  建议同程和南航用户查看 681 [这个视频](https://www.bilibili.com/video/BV1BfyQY8E9T/)，根据[网络安全法](https://www.cac.gov.cn/2016-11/07/c_1119867116_2.htm)和[民法典](https://www.gov.cn/xinwen/2020-06/01/content_5516649.htm)，将公民个人信息泄露到无权第三方是违法行为。
    这一事件目前声量不够大，不太确定后续进展，如果这时候有集体诉讼就好了。
    ![网络安全法-第 42 条](https://img.sakanano.moe/file/sakanano/public/images/article/elr0yj.png)
    ![民法典-第 111 条](https://img.sakanano.moe/file/sakanano/public/images/article/58cxn3.png)
2.  [京东代言人杨笠事件](https://weibo.com/1717871843/OC6s2a0mO)似乎发展成近些年男性参与最大的性别冲突，也有不少 UP 因为站队或者解题方向问题被冲——尤其是一些键政区 UP。

    说起来，我觉得大 v、专家、明星以及一些键政区 UP 很容易陷入与广大普通民众脱节的陷阱：他们因为自己所处的位置和听到的声音，要么觉得自己具备了超越一般人道德水准的权力、要么喜欢站在上层从事远水解不了近渴的发言。

    不得不怀念一句：「从群众中来，到群众中去」。

    当然了每个冲突、每个社会矛盾都是复杂的，我们也能寄希望于找到一个方法通杀，让所有人都满意；在法律底线下，我鼓励充分表达和竞争，然后用实际行动表达自己的价值观——只有让价值观落地为真切影响自己利益的行为，才能看出谁和谁是一伙的，反之亦然。

3.  [Linux 内核移除一些俄罗斯籍 MAINTAINERS](https://github.com/torvalds/linux/commit/6e90b675cf942e50c70e8394dfb5862975c3b3b2)。科学无国界但科学家有国界，同理，开源无国界但维护开源项目的负责人也是有国界的，这么一看供应链安全也算是国家安全战略的重要一部分了。

    我们计算机界也有自己的 SWIFT！

## 阅读

1. 针对上面的事件 2，我觉得[这个视频](https://www.bilibili.com/video/BV1ezyUY2Eay)值得一看，社会问题是复杂的，但复杂问题的解决方法就是找到一个主线，重点解决主线，次要解决支线，不然所有子问题都同权就没办法分配资源了。

## 灵感

无

## 系统

1. Follow 开始公测了，话题转回到信息轰炸上来，实际上 Follow 等各类 APP 仍然没有解决无效信息的问题（不过说起来大部分用户也不知道自己想要什么信息所以才会依赖推荐系统吧 hhh）。

   现在想来，我们除了需要从特定源获取信息外，还需要方式去筛选评价消息的质量，给消息而不止是订阅源做一道准入；另外也可以找些办法去统计自己阅读每个消息(源)的时间频率，进而自动创建一些过滤器。

   Follow 解决了第一步多类型信息源的聚合问题，后续希望有 APP 能继续解决阅读的问题，不然再怎么换 APP，也只是靠着 APP 的新鲜感去关注消息流罢了。

2. 时隔 4 年续订了 Surge，痛失 70 刀，主要是解决分流问题，订阅方面使用 sub-store 把节点信息转换成了 Surge 的版本，然后使用[这个配置](https://raw.githubusercontent.com/Rabbit-Spec/Surge/Master/Conf/Spec/Surge-CN.conf)作为基准配置，不过在 Mac 上似乎没办法在获取自己填写的节点链接后，自动填充到「代理」功能中，只是靠着策略组在工作。

   重新回到 Surge 使用后发现它有个模块功能，类似 Chrome 的油猴，可以缓解一些开屏广告、消息流广告问题。除了这个原因外，Clash 的客户端频繁出问题，加点钱上一个颜值高的客户端更省心一些。

   突然想起来大概是 2019 年有两个小伙伴跟我合租 Surge，现在已经找不到人了...（混在茫茫的 vx 好友中）只记得是在少数派当年的 Slack 上加的，登上 Slack 一看，历史的聊天记录已经不让看了...

3. 调整了 Stork 的订阅关键词，作为一个 Stork 免费版用户，10 个关键词逐渐不够用了，很早之前是随意写的单个关键词，比如之前写一个「steganography」当做关键词，现在使用 3 层 AND 作为一个关键词：

   1）第一层必须声明一个学科，例如「psychology」

   2）第二层声明子领域，比如「("clinical psychology" OR "mental health" OR "psychological counseling")」

   3）第三层用于识别这个子领域可能得关键词，比如("major depressive disorder" OR "bipolar disorder" OR "narcissistic personality disorder" OR "antisocial personality disorder" OR "anxiety disorders" OR "personality disorders")

   三层结构用 AND 相连，有多个子领域用 OR 相连即可，通过这样的结构一方面能把多个关键词合并到一个栏位，另一方面也能让 Stork 推送更加精准。话说，[Researcher](https://www.researcher-app.com/)是不是就这么来组织关键词来着？但是[Researcher](https://www.researcher-app.com/)不能自由编辑关键词，有些麻烦。

4. 本周减少了大量 B 站 RSS 订阅，有不少 UP 已经不更了、换赛道了、质量下降了。![当前 B 站 RSS 订阅数量](https://img.sakanano.moe/file/sakanano/public/images/article/s9ji66.png)

## Other

1. 鉴于香港的 AC+没办法在 2 年过期后续期，作为一个不戴壳不贴膜的选手容易翻车，所以最后买了国行的 iPadmini7，原价 4799 淘宝 4199，虽然赶不上国补但还不错，只是没办法满血 AI 之类的功能了。这么说来，Mac mini 作为一个不需要买 AC+的设备，倒是适合去香港买。
2. 本周把小佩自动猫砂盆换新了。 2022 年买的，考虑到计划报废，2 年也算是到寿命了，于是参加了以旧换新-500，没想到顺丰小哥上门回收的时候说这个回收就是拿去垃圾场销毁。想了想也是，大件运回、拆零件、检测、维修再利用的成本可能比重新生产一个还要贵。
3. 正如博客当前所见，亮色模式下增加了一个背景壁纸，我觉得很好看！不过暗色情况下还没，等我想到设定再去约。
