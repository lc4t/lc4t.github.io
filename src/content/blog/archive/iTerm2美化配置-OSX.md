---
title: iTerm2美化配置 OSX
pubDatetime: 2017-04-11 17:43:31
tags:
  - macos
description: Already Archive Before 20230604
postSlug: archive_iTerm2_beautify
---

### Target

为 OSX 配置好看的终端, Linux 也可以用

<!--more-->

### 下载 iTerm2

[iTerm2 下载地址](http://www.iterm2.com/#/section/downloads)

### zsh and zprezto

将 iTerm2 拖到应用程序, 打开, 输入下面命令

```
git clone git://github.com/robbyrussell/oh-my-zsh.git ~/.oh-my-zsh
cp ~/.oh-my-zsh/templates/zshrc.zsh-template ~/.zshrc
git clone --recursive https://github.com/sorin-ionescu/prezto.git "${ZDOTDIR:-$HOME}/.zprezto"
```

切换 zsh

`chsh -s /bin/zsh`

配置

```
setopt EXTENDED_GLOB
for rcfile in "${ZDOTDIR:-$HOME}"/.zprezto/runcoms/^README.md(.N); do
  ln -s "$rcfile" "${ZDOTDIR:-$HOME}/.${rcfile:t}"
done
```

### zsh 主题切换: agnoster

先准备好 powerline 字体

[字体地址](https://github.com/supermarin/powerline-fonts/blob/bfcb152306902c09b62be6e4a5eec7763e46d62d/Monaco/Monaco%20for%20Powerline.otf)

打开安装即可

后面还有一个 font 和 fontpatch, 按照 readme 指印即可

[fontpatcher](https://github.com/powerline/fontpatcher)

[fonts](https://github.com/powerline/fonts)

修改主题直接`vim ~/.zshrc`中找到`ZSH_THEME="robbyrussell"`修改 robbyrussell 为 agnoster

保存, shell 中再开一次`zsh`即可看到效果, 不过明显出现了问号, 刚刚的字体就是为这个准备哒~

打开 iTerm2-Preferences-Profiles-Text-Change Font 选择刚刚安装的`Monaco for Powerline`

### 用 brew 安装 zsh 插件

如果没有安装 xcode-select 需要先安装

`xcode-select --install`

安装 brew

```
curl -LsSf http://github.com/mxcl/homebrew/tarball/master | sudo tar xvz -C/usr/local --strip 1
brew install wget
```

第二步如果没有权限, 使用`sudo chown -R $(whoami):admin /usr/local`改一下权限

另外, brew 很慢, 建议挂代理, 默认大家都有一个 socks5 代理在本地, 那么在`~/.zshrc`加一个

`alias PROXY="export ALL_PROXY=socks5://127.0.0.1:1080"`

想使用代理就`PROXY`即可

好, 挂上代理, `brew update`一下

`brew search zsh`来找 zsh 插件

例如 autojump

`brew install autojump`

然后按照其说明配置在`~/.zshrc`中添加

```
[[ -s $(brew --prefix)/etc/profile.d/autojump.sh ]] && . $(brew --prefix)/etc/profile.d/autojump.sh
```

建议添加到靠后的位置, 以后方便定位原配置和自添加配置

同时修改`plugins=(git)`为`plugins=(autojump git)`

在 shell 中`zsh`一下, 输入个`j`看效果

 当然, 也可以不通过 brew 来装插件, 例如 zsh-syntax-highlighting

```
git clone git://github.com/jimmijj/zsh-syntax-highlighting ~/.oh-my-zsh/custom/plugins/zsh-syntax-highlighting
```

之后再修改`plugins=(autojump zsh-syntax-highlighting git)`

### 调整 iTerm2 参数

#### 光标移动过慢

应当在设置-键盘中调整两个参数: 按键重复调快, 重复前延迟调短

#### 向上滚动有限制

打开 iTerm2-Preferences-Profiles-Terminal

这个选项卡上面的 Scrollback Buffer 是限制滚动行数, 在 Unlimited scrollback 打上勾即可

#### 声音好烦啊

打开 iTerm2-Preferences-Profiles-Terminal-Notifications

在 Slience bell 打上勾

#### 透明度和背景图

打开 iTerm2-Preferences-Profiles-Window

Transparency 就是透明度啦, 右边 👉 就是背景图 Background Image

#### 快捷键

打开 iTerm2-Preferences-Key

之后随意啦
