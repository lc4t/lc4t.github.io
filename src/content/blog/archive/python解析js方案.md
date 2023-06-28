---
title: python解析js方案
pubDatetime: 2017-07-21 10:00:00 +08:00
tags:
  - python
description: Already Archive Before 20230604
postSlug: archive_python_parse_js
---

在 Python 爬虫的时候遇到的 JS，几种策略

<!--more-->

1. pyv8 只支持 python2，容错高
2. PyExecJS，支持到 python3，容错率低，同样的代码 pyv8 执行 ok，但是这个报多余的分号...
3. phantomjs，动态渲染页面执行 js，主要是不好 kill 掉，不直接杀进程内存能 gg
4. 手动解析 script，也是一种方案，主要是 py 处理一下混淆
5. py 调 os.system 再解析，这种就是依赖本地另一个工具，比如 node 之类的，解析 js 再返回结果，增加外部依赖
