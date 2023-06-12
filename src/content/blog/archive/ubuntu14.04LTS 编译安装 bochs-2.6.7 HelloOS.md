---
title: ubuntu14.04LTS 编译安装 bochs-2.6.7 HelloOS
pubDatetime: 2015-01-21 00:45:04
tags:
  - linux
description: Already Archive Before 20230604
postSlug: archive_ubuntu_bochs
---

<!--more-->

首先从 bochs 官方网站找到 bochs2.6.7 的下载地址，其中符合 linux 14.04LTS 的是 bochs-2.6.7.tar.gz

在虚拟机中更新 sources.list

`sudo gedit /etc/apt/sources.list`
如果所用的源有问题，会出现无法自动下载依赖的情况，官方源列表可以在 wiki 找

我的是这个

链接：http://pan.baidu.com/s/1kTh2SL5 密码：tihm

那修改好 list 后 也就是保存了之后，更新

`sudo apt-get update`

OK..！

转到文件目录

解压`tar vxzf bochs-2.6.7.tar.gz`

转到目录`cd bochs-2.6.7`

先来尝试一下配置 configure
`./configure --with-x11 --enable-debugger --enable-disasm --enable-pci --enable-pcidev --enable-plugins --enable-ne2000 --enable-pnic --enable-usb`

````
OK,第一个error是
`configure: error: C++ preprocessor "/lib/cpp" fails sanity check`

确实c++编译器相关的package，来执行
`sudo apt-get install build-essential`
获取一些编译用的基本库
实际上，只解决这个问题，需要
```bash
sudo apt-get install glibc-headers
sudo apt-get install gcc-c++
````

---

安装 build-essential 后，重新 configure，OK，成功
接下来
`make`
问题主要出现在 make 部分

    error：
    #include <gtk/gtk.h>
    ^
    compilation terminated.
    make[1]: *** [gtk_enh_dbg_osdep.o] Error 1
    //
    make: *** [gui/libgui.a] Error 2

找不到 gtk 的库，干脆直接把依赖都装上

`sudo apt-get install build-essential xorg-dev bison libgtk2.0-dev libc6-dev bochs-sdl nasm gcc g++ gdb libwxgtk2.8-dev libx11-xcb-dev vgabios bximage gtk2-devel`

重新设置 configure,再次`make`
发现：

    /usr/bin/ld: gui/libgui.a(gtk_enh_dbg_osdep.o): undefined reference to symbol 'pthread_create@@GLIBC_2.2.5'
    /lib/x86_64-linux-gnu/libpthread.so.0: error adding symbols: DSO missing from command line
    collect2: error: ld returned 1 exit status
    make: *** [bochs] Error 1

在 bochs-2.6.7 文件夹里面找 makefile 这个文件，找到 LIBS 变量，在后面添加
`-lz -lrt -lm -lpthread`
然后再次 make，不要重新生成 makefile
编译通过..

`sudo make install`
安装报错
`libbx_usb_common.la', needed by `plugins gcc'
这个是 usb 上的,在 `bochs-2.6.7/iodev/usb/makefile.in` 修改`OBJS_THAT_CAN_BE_PLUGINS`,加入`usb_common.o`
OK,这次好了

---

启动 bochs 还需要配置文件，来建立一个 hello os world

准备好引导文件:`boot.asm`

```asm
org 07c00h

mov ax,cs

mov ds,ax

mov es,ax

call DispStr

jmp $

DispStr:

mov ax,BootMessage

mov bp,ax

mov cx,16

mov ax,01303h

mov bx,000ch

mov dl,000ch

int 10h

ret

BootMessage: db "Hello,OS world!"

times 510-($-$$) db 0

dw 0xaa55
```

`nasm boot.asm -o boot.bin`

然后 bximage 建立软盘镜像

```bash
bximage
1[Enter]
fd[Enter]
[Enter]
[Enter]
```

然后写入
`dd if=boot.bin of=a.img bs=512 count=1 conv=notrunc`
配置 bochsrc：

```bash
###############################################################
# Configuration file for Bochs
###############################################################

# how much memory the emulated machine will have
megs: 32

# filename of ROM images
romimage: file=/usr/share/bochs/BIOS-bochs-latest
vgaromimage: file=/usr/share/vgabios/vgabios.bin

# what disk images will be used
floppya: 1_44=a.img, status=inserted

# choose the boot disk.
boot: a

# where do we send log messages?
# log: bochsout.txt

# disable the mouse
mouse: enabled=0

#display_library:sdl

# enable key mapping, using US layout as default.
#keyboard_mapping: enabled=1, map=/usr/share/bochs/keymaps/x11-pc-us.map
```

OK，
`bochs -f bochsrc`
启动之后选择 6,然后在终端输入 c,然后 waiting....
