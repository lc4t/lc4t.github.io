---
title: vmware安装图形化archlinux
pubDatetime: 2015-02-09 00:45:04 +08:00
tags:
  - linux
description: Already Archive Before 20230604
postSlug: archive_vmware11_install_archlinux_with_gui
---

<!--more-->

## Archwiki 指引

->测试 vmware 的 dhcp 是否正常

`ping -c 1 t.cn`

![](http://ac-HSNl7zbI.clouddn.com/dRwEuSwYGR1j6JwK102uUiiXwtvUYATtglfXjqVq.jpg)

测试正常

->准备存储设备

首先要确定系统安装的目标设备，下面命令会显示所有连接到系统的设备和分区状况

`lsblk`

![](http://ac-HSNl7zbI.clouddn.com/g6J1Pq06plK4PvvOLlUdAfeoS2GGW9f8unjR3fEm.jpg)

用 parted 新建分区表 msdos 分区 给 / 10G 剩下的给/home

```bash
parted /dev/sda
(parted) mklabel msdos
(parted) mkpart primary ext3 1M 10G
(parted) set 1 boot on
(parted) mkpart primary ext3 10G 100%
```

->创建文件系统

先查看所有分区

`lsblk /dev/sda`

![](http://ac-HSNl7zbI.clouddn.com/ntOFMr1tLpQAVzRJGNLRvVA1vgEYQKKFwCHko118.jpg)

ext4 格式化分区，注意分区名是在上一步查看的 sda1 和 sda2

`mkfs.ext4 /dev/sda*`

![](http://ac-HSNl7zbI.clouddn.com/Vdzp4dolfAWWFoT9FJ0CjAStHlY9jzCT6J6ayUqJ.jpg)

    <若您分了一个 swap 区，也不要忘了格式化并启用它>
    # mkswap /dev/sdaX
    # swapon /dev/sdaX

->挂载分区

一共有 2 个分区,即/root（/）和/home

```bash
mount /dev/sda1 /mnt
mkdir /mnt/home
mount /dev/sda2 /mnt/home
```

![](http://ac-HSNl7zbI.clouddn.com/bA0TIkO3efWkWDStLLnmYuips339vMnnlUQHg6Vm.jpg)

->选择安装镜像

    安装前需要编辑 /etc/pacman.d/mirrorlist, 将偏好的镜像放到最前面。mirrorlist 文件也会被 pacstrap 复制到新系统，所以最好现在就设置

[镜像列表生成器](https://www.archlinux.org/mirrorlist/)

```bash
nano /etc/pacman.d/mirrorlist
pacman -Syy
```

->安装基本系统

    使用 pacstrap 来安装基本系统。如果您不想手动选择安装哪个包，忽略 -i 即可。如果您想通过 AUR (简体中文) 或者 ABS (简体中文) 编译安装软件包,需要装上 base-devel

`pacstrap -i /mnt base base-devel`

![](http://ac-HSNl7zbI.clouddn.com/BKR8l3aBMR7hvLtoIGx8eQxSx9fpgiLyfhjsWEa6.jpg)

这时候按了两次回车(default=all)软件包也不知道什么没用，所以都安装上好了

`genfstab -U -p /mnt >> /mnt/etc/fstab`

->chroot 到新系统

`arch-chroot /mnt /bin/bash`

->Locale

```bash
nano /etc/locale.gen
en_US.UTF-8 UTF-8
zh_CN.GBK GBK
zh_CN.UTF-8 UTF-8
```

接着执行`locale-gen`以生成 locale 讯息

![](http://ac-HSNl7zbI.clouddn.com/UDfGzDFNR9dfbVbE7lRzXYlOGbbESDqgwEja6YIV.jpg)

创建 locale.conf 并提交您的本地化选项：

`echo LANG=en_US.UTF-8 > /etc/locale.conf`

![](http://ac-HSNl7zbI.clouddn.com/iOBipfOYkyI4BOAFbJKypstWQtr83NcbIG5HdYX3.jpg)

->设置时区 上海 设置硬件时间

`ln -s /usr/share/zoneinfo/Zone/SubZone /etc/localtime`

`hwclock --systohc --utc`

![](http://ac-HSNl7zbI.clouddn.com/zUu2PfbDcEL4wMqM6uENY0c1GSfxPO9zmTESxHbT.jpg)

->配置

```bash
echo lc4t-Arch > /etc/hostname
systemctl enable dhcpcd@lc4t.service
```

->设置 root 密码

`passwd`

->安装并配置 bootloader，卸载分区并重启系统

```bash
pacman -S grub
grub-install --target=i386-pc --recheck /dev/sda
grub-mkconfig -o /boot/grub/grub.cfg
exit
```

    移除安装媒介，并还原 BIOS 中的启动选项。可以用 root 用户和设置的密码登录.

```bash
useradd -m -g users -G audio,video,floppy,network,rfkill,scanner,storage,optical,power,wheel,uucp -s /usr/bin/zsh lc4t
passwd lc4t
```

```bash
pacman -S sudo            #加载sudo
EDITOR=nano visudo
%wheel ALL=(ALL) ALL   #反注释
gpasswd -a lc4t wheel

sudo pacman -S bash-completion  #开启sudo的tab补全
echo complete -cf sudo >> ~/.bashrc
pacman -S alsa-utils  #声音
alsamixer #Master PCM 按M取消静音

#配置图形：
lspci | grep VGA #查看显卡型号
pacman -S xf86-video-vesa
#安装 X 窗口系统
pacman -S xorg
pacman -S xorg-server xorg-server-utils xorg-xinit
#3D加速
pacman -S mesa
#触摸板
pacman -S xf86-input-synaptics
#安装字体
#Dejavu和文泉驿-微米黑
pacman -S ttf-dejavu wqy-microhei
#桌面
pacman -S xfce4
pacman -S xfce4-goodies
```

->配置 startx

```bash
cp /etc/skel/.xinitrc ~
nano ~/.xinitrc
```

反注释对应行：

`exec gnome-session`

安装输入法

```bash
pacman -S fcitx-im
export GTK_IM_MODULE=fcitx
export QT_IM_MODULE=fcitx
export XMODIFIERS="@im=fcitx"
```

startxfce4 启动 发现鼠标无反应

`pacman -Rdd xf86-input-vmmouse`

ok
