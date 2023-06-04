---
title: gnome3禁用触摸板后怎样打开
pubDatetime: 2015-05-10 00:45:04
tags:
  - linux
description: Already Archive Before 20230604
---

gnome3 在 菜单的设置选项中禁用了触摸板后无法启用,经过摸索找到了解决办法:

<!--more-->

终端打开 dconf-editor 搜索 touchpad (ctrl+f 搜索,默认向下,前几次在里面没找到是因为选中的项太靠后了,没找到 touchoad 这个选项)

路径是`org-gnome-desktop--peripherals-touchpad`

将 send-events 的值改为 enabled(重置为默认值)即可打开

![](http://ac-HSNl7zbI.clouddn.com/Vrjj3wEpHkbE3PfWI0qPBoST9ePfaBsxcKlFNdQR.jpg)
