---
title: linux下TexStudio中文乱码/不显示解决方案 & 代码高亮/伪代码编辑
pubDatetime: 2015-10-05 00:45:04
tags:
  - linux
description: Already Archive Before 20230604
---

### 保证安装了最新版的

extra/texlive-latexextra

extra/texlive-langchinese

`yaourt -S texlive-latexextra`

### 然后下载 Ctex

```bash
cd /tmp
wget -r -np http://ctex-kit.googlecode.com/svn/trunk/ctex/
```

### 移动到 xelatex 目录

`sudo mv /tmp/ctex-kit.googlecode.com/svn/trunk/ctex /usr/share/texmf-dist/tex/xelatex`

### 刷新

`sudo texhash`

### 调整一个 bug

`sudo vim /usr/share/texmf-dist/tex/latex/ctex/config/ctexopts.cfg`

注释掉里面没有注释掉的行,%%是注释符

### 代码高亮

    只需要aur/minted即可

### 伪代码

    使用clrscode，我把需要的文件放在了 [这里](https://sourceforge.net/projects/lc4t/upload/lc4t.me/clrscode)
