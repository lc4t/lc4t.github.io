---
title: 彻底清除wine的打开方式列表和快捷方式
pubDatetime: 2015-05-19 00:45:04
tags:
  - linux
description: Already Archive Before 20230604
---

正式卸载 wine 之后,

```bash
#打开方式
rm -f ~/.local/share/mime/packages/x-wine*
rm -f ~/.local/share/applications/wine-extension*
rm -f ~/.local/share/icons/hicolor/*/*/application-x-wine-extension*
rm -f ~/.local/share/mime/application/x-wine-extension*
#清除wine目录
rm -rf ~/.wine
#清除菜单项
rm -f ~/.config/menus/applications-merged/wine*
rm -rf ~/.local/share/applications/wine
rm -f ~/.local/share/desktop-directories/wine*
rm -f ~/.local/share/icons/????_*.{xpm,png}
rm -f ~/.local/share/icons/*-x-wine-*.{xpm,png}
```
