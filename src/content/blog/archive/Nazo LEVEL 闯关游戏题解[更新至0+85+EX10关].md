---
title: Nazo LEVEL 闯关游戏题解
pubDatetime: 2015-06-12 00:45:04 +08:00
tags:
  - game
description: Already Archive Before 20230604
postSlug: archive_nazo_level_writeup
---

#### Basic

网址 http://cafebabe.cc/nazo/ 手机 hint: chrome 浏览器在网页前加 view-source: 可以查看源代码..现在没找到可以调试网页的工具,所以那个 52 是不能做的.. 页面和 hint(右边是进入左边地址的 hint)

```
http://cafebabe.cc/nazo/ 右边是进入左边地址的hint
http://cafebabe.cc/nazo/level2.html 直接点
http://cafebabe.cc/nazo/level3.html 直接输入level3
http://cafebabe.cc/nazo/helloworld.html 看源文件
http://cafebabe.cc/nazo/java.html js
http://cafebabe.cc/nazo/pinetree.html 凯撒密码-1或+25
http://cafebabe.cc/nazo/DEADBEEF.html 转16进制即可
http://cafebabe.cc/nazo/bravo.html qq昵称
http://cafebabe.cc/nazo/Clippy.html 图片是office助手 名字就是
http://cafebabe.cc/nazo/click.html 图片改rar
http://cafebabe.cc/nazo/tested.html 数字换成二进制 然后1对应字母留下
http://cafebabe.cc/nazo/basic/index.html
http://cafebabe.cc/nazo/basic/office.html 图片名
http://cafebabe.cc/nazo/basic/xyzzy.html 作弊码
http://cafebabe.cc/nazo/basic/akpwgdl.html 五笔字根
http://cafebabe.cc/nazo/basic/month.html MjJA 月份首字母 31天的大写
http://cafebabe.cc/nazo/basic/linux.html linux 这是icon
http://cafebabe.cc/nazo/basic/monomaniac.html 二维码
http://cafebabe.cc/nazo/basic/sos.html 莫尔斯
http://cafebabe.cc/nazo/basic/solve.html 数字代表第几个字母
http://cafebabe.cc/nazo/basic/doge.html
http://cafebabe.cc/nazo/basic/pi.html
http://cafebabe.cc/nazo/basic/42.html 《银河系漫游指南》
http://cafebabe.cc/nazo/basic/random.html Webdings字体 wps里符号顺序代表ascii
http://cafebabe.cc/nazo/basic/cherry.html 前面*4+1,但是如果你用*4+1+123会进入第0关然后再进入下一关,这个提示在css里面
http://cafebabe.cc/nazo/basic/shadow.html
http://www.gamefront.com/fez-hieroglyphic-alphabet-decoded/
http://cafebabe.cc/nazo/basic/sanic.html 刺猬sanic 识图啊
http://cafebabe.cc/nazo/basic/cache.html FAceB00B [A-Z][A-Z][a-z][a-z]([A-Za-z0-9])[0-9][0-9]\1
http://cafebabe.cc/nazo/basic/Mandelbrot.html google识图
http://cafebabe.cc/nazo/basic/337845818.html http://tieba.baidu.com/p/2897378143
http://cafebabe.cc/nazo/basic/scp173.html google识图
http://cafebabe.cc/nazo/basic/key.html 注意图片左下角
http://cafebabe.cc/nazo/medium/GameOfLife.html http://www.douban.com/group/topic/23842638/
http://cafebabe.cc/nazo/medium/spring.html 改1为l
http://cafebabe.cc/nazo/medium/pong.html 第一个电子游戏
http://cafebabe.cc/nazo/medium/delete.html new完了delete啊
http://cafebabe.cc/nazo/medium/suffix.html minecraft标识 creeper
http://cafebabe.cc/nazo/medium/for.html 14444 22是第22关的42
http://cafebabe.cc/nazo/medium/level.html 键盘上每个字母右移1
http://cafebabe.cc/nazo/medium/forty.html 丢记事本
http://cafebabe.cc/nazo/medium/dizzy.html 提示有4位 然后圆周率对应字母顺序 fece
http://cafebabe.cc/nazo/medium/dizzy/?.html 题目即答案 ?
http://cafebabe.cc/nazo/medium/checkmate.html sm666 尼玛背景真可怕 然后一搜真是..
http://cafebabe.cc/nazo/medium/8pm.html bf
http://cafebabe.cc/nazo/medium/pewdiepie.html OSU 。。转就行了.. 10圈 顺时针 当然也可以js解密
http://cafebabe.cc/nazo/medium/thumb.html 看提示。。 index是食指 .. 旁边就是拇指
http://cafebabe.cc/nazo/medium/slumber.html 禁用js 答案 -1/12
http://cafebabe.cc/nazo/medium/tilt.html 小键盘上看到,T工LT == tilt
http://cafebabe.cc/nazo/medium/cheater.html 看js z和r
http://cafebabe.cc/nazo/medium/portal.html lavender 识别音乐.. 口袋妖怪 紫苑镇
http://cafebabe.cc/nazo/medium/champion.html 生日不对..庆祝不对..蒙的 反正跟庆祝有关 前面有个注释是只有冠军才能（输入lie得冠军提示）.. http://cafebabe.cc/nazo/advanced/bilibili.html
http://cafebabe.cc/nazo/advanced/acfun.html 是是是
http://cafebabe.cc/nazo/advanced/shenlan.html 把body的背景反注释
http://cafebabe.cc/nazo/advanced/received.html 搜图发现smiledog,访问smile.html发现404,改.jpg,提示behind you,you后面是received http://cafebabe.cc/nazo/advanced/mouse.html js 或者鼠标移动到坐标1280 720
http://cafebabe.cc/nazo/advanced/gtx690.html nuclear.html 和 braid.html 提示战术核 战术核显卡gtx690
http://cafebabe.cc/nazo/advanced/baymax.html 提示是thumbnail 缩略图 另存为图片显示的缩略图和原来不一样
http://cafebabe.cc/nazo/advanced/follow.html win10密钥可破NKJFK-GPHP7-G8C3J-P6JXR-HQRJR
http://cafebabe.cc/nazo/advanced/eye.html 斗鸡眼可破
http://cafebabe.cc/nazo/advanced/klein.html Klein bottle的简化图...
http://cafebabe.cc/nazo/advanced/mushroom.html 首先看源代码的问题,答案是clock,图片名字也是提示,访问clock.jpg,得到一个直线型的时钟,竖线长短分别是分针时针,下面是刻度,枚举时间即可,1130正确 http://cafebabe.cc/nazo/advanced/slender.html 图即提示
http://cafebabe.cc/nazo/advanced/little.html 丢GNU魔棒（GNU的模糊选择工具,用PS也可以,没准画图也行）选中即可
http://cafebabe.cc/nazo/advanced/keypad.html 主键盘的数字特殊符号区上下交换 ($)
http://cafebabe.cc/nazo/advanced/bored.html 刷新多次后未果直接按ESC离开..
http://cafebabe.cc/nazo/advanced/running.html 让它掉到蓝色区域ok
http://cafebabe.cc/nazo/advanced/cellphone.html 连续50次。。
http://cafebabe.cc/nazo/advanced/dolphin.html 注意这是ce11phone,11有问题,改成cellphone后又跳转,检查ce11phone源代码,发现UA检查跳转到m,检查m源代码发现dolphin
http://cafebabe.cc/nazo/advanced/tell.html 有10个div,可以改掉背景,在div里加个background-color:red;不会改的可以直接审查元素鼠标悬停到div的地方会选中
http://cafebabe.cc/nazo/advanced/xor.html 这是mc的一个异或门,xor代表异或
http://cafebabe.cc/nazo/advanced/coffee.html 检查里面唯一的js,最后面是判断代码,如果xor页面有6个则OK,当然里面也写了answer页面
http://cafebabe.cc/nazo/ultimate/noose.html
http://cafebabe.cc/nazo/ultimate/magic.html Solar日,Aqua水,Metallum金,Terra地,Luna月,Ignis火,Arbor木 日、月、火、水、木、金、土代表一周的星期一到星期日
http://cafebabe.cc/nazo/ultimate/magic.html 60427 栅栏密码2栏..可以试出来 这是LED数字 提示是自动保存,地址后面加.bak得到真实地址
http://cafebabe.cc/nazo/ultimate/chihuahua.html 我在哪,那就是看IP:115.159.76.12
http://cafebabe.cc/nazo/ultimate/dice.html 手机查IMEI,*#06#
http://cafebabe.cc/nazo/ultimate/15.html 查三通道,神器stegslove,eight plus seven
http://cafebabe.cc/nazo/ultimate/soeasy.html 最后一行倒数第二个是个二维码 扫即可
http://cafebabe.cc/nazo/ultimate/guru.html hint是名字,Tesserac.html页面是hint:  .go  /left *right -up +down然后走到按照象限排列,原本是在8开始的,所以结果8172548274321
http://cafebabe.cc/nazo/ultimate/grandtheftauto.html 弹一下欢乐颂..c是do
http://cafebabe.cc/nazo/ultimate/protein.html youtube,301
http://cafebabe.cc/nazo/ultimate/revolve.html 提示人名是个速记法,用的12进制,12进制+12进制=12进制
http://cafebabe.cc/nazo/ultimate/%E6%81%90%E6%80%96%E8%B0%B7.html 这是个恐怖谷的图像,英文的恐怖谷提示一个404,里面说输入中文,那么就是恐怖谷.html
http://cafebabe.cc/nazo/ultimate/kaleidoscope.html 网址正好是16进制,直接转10进制ok
http://cafebabe.cc/nazo/ultimate/jiggle.html 输入1,出现jackie,估计问的是jackie的鼻子,银魂109集梗,134个,继续输入134,又不对,提示typo是答案,发现眼晴,找英文,Sunny正确
http://cafebabe.cc/nazo/ultimate/smoke.html 直接反编译js看到下一关地址
http://cafebabe.cc/nazo/ultimate/Akhlut.html 丢神器stegslove,三通道看到文字“因纽特狼杀人鲸”,google it,找到鲸狼,英文即可
```

#### EXTRA 部分

```
http://cafebabe.cc/nazo/extra/xiaoai.php
http://cafebabe.cc/nazo/extra/xiaozhuo.php 这是一个井字棋,赢不了,输入井字棋可过关
http://cafebabe.cc/nazo/extra/maxzhuo.php A是位置和数字都正确,B是数字正确但位置不对,每个人数字不同,自行测试
http://cafebabe.cc/nazo/extra/egg.php    楦¤泲 这是UTF-8编码的鸡蛋的GBK编码。。把它转换成UTF-8即可
http://cafebabe.cc/nazo/extra/ddooggee.php   把页面的script.js反混淆可看到下一关地址。。我可没耐心玩100次...
http://cafebabe.cc/nazo/extra/ddooggee.php 社工到QQ无用,注册一个QQ按照要求改一下,头像使用本地的,通过
http://cafebabe.cc/nazo/extra/workwithdorsy.php 得到一片2进制,转到16进制发现缺一位,尝试前或后补0,后补0成功,查文件头是个JPG,直接打开得到地址
http://cafebabe.cc/nazo/extra/world.php 转成一个颜色。。
http://cafebabe.cc/nazo/extra/h0sts.php hosts是xiao.zhuo,改hosts实现,然后根据页面,Referer改成http://nazo/刷新即可
http://cafebabe.cc/nazo/extra/prophecy.php 《2012》 尝试各种单词,预言(正解在评论里)
http://cafebabe.cc/nazo/extra/1reverse1.php ?EX10=R 是ex10的提示,倒车,开脑洞,把EX10=R反过来即可
```
