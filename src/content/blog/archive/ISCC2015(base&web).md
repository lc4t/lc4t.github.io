---
title: ISCC2015(base&web)
pubDatetime: 2015-05-12 00:45:04
tags:
  - ctf
description: Already Archive Before 20230604
postSlug: archive_iscc2015_writeup
---

<!--more-->

### BASE50-easy？

```python
#ISCC-BASE50_easy?.py
code = "mzdvezc"
CHARBASE = ord('a')
# encode y = 5x + 12 (mod 26)
# decode x = 21(y - 12) (mod 26)
for i in code:
    y = ord(i) - CHARBASE - 12
    if (y < 0):
        y += 26
    x = y * 21 % 26
    print (chr(x + 97),end="")

#flag : anthony
```

### BASE50-神秘纸条

    这是一个BASE64-ENCODED MD5HASH:

    HEX-ENCODED MD5 HASH： a4704fd35f0308287f2937ba3eccf5fe
    BASE64-ENCODED MD5HASH： pHBP018DCCh/KTe6Psz1/g
    HEX-ENCODED SHA HASH： 93ef0dd827103681fcee453b78be2ff14e1a261d
    BASE64-ENCODED SHA HASH：k+8N2CcQNoH87kU7eL4v8U4aJh0
    CLEARTEXT: The

```python
#pHBP018DCCh/KTe6Psz1/g==     -->    The
#Lo1tv5ESqHnUzrFUA9EKeA==     -->    death
#pHV9dBn/O0jpLpBZbw51SA==     -->    god
#Ypm6LL2WYaXjhytxVSHNag==     -->    only
#mpftptifXJ6EVgRooGeXBw==     -->    eat

#google : The death god only eat
#get : The Death God Only Eat Apples

#flag : apples
```

### BASE150-恶作剧 or 机密？

    下载压缩文件,提示是4位密码,爆破之

![](http://ac-HSNl7zbI.clouddn.com/6A1tJnDOjGUHMWXgeM9xaFIS5DN1fwSISTSSz57H.jpg)

    发现密码:hj7k

    打开看到:
    WkhWaGJtY3lNREUxWkhWaGJtZGtZUW89Cg==
    base64解密之
    ZHVhbmcyMDE1ZHVhbmdkYQo=
    再解密之得到flag
    flag : duang2015duangda

    Base150-Decrypt

```python
Ma=[
    1,4,7,
    2,5,8,
    3,6,10
   ]

code=[
      22,9,0,
      12,3,1,
      10,3,4,
      8,1,17
     ]

answer=[]

flag = 0
for t in range(0,12,3):
    flag = 0
    for i in range(0,99,1):
        for j in range(0,99,1):
            for k in range(0,99,1):
                if ((1*i + 4*j + 7*k)%26 == code[t]  and
                    (2*i + 5*j + 8*k)%26 ==  code[t+1] and
                     (3*i + 6*j + 10*k)%26 == code[t+2]):
                    answer.append(i)
                    answer.append(j)
                    answer.append(k)
                    flag = 1
                    break
            if(flag):
                break
        if(flag):
            break
    if(flag):
        continue
print (answer)

for i in answer:
    print (chr(i + 97),end="")
#flag : overthehillx
```

### BASE150-蛛丝马迹

    下载文件 提示是异或机密且给出了密钥 ,先解异或

```python
s = [  0xBE,  0x2A,  0x28,  0x48,  0x7A,  0x5C,  0x2A,  0x21,  0xCB,  0x93,  0x0D,  0x2A,  0x70,  0x36,  0xD3,  0x4E,  0xC9,  0xB6,  0xCF,  0x3C,  0xB6,  0x71,  0x99,  0xF5,  0x46,  0x69,  0xA1,  0x24,  0xF9,  0x71,  0x70,  0x11,  0x2A,  0x37,  0x31,  0x27,  0x30,  0x16,  0x71,  0x90,  0x26,  0xC9,  0x18,  0x72,  0xC9,  0x09,  0x4E,  0xC9,  0x0B,  0x5E,  0xC9,  0x4B,  0xC9,  0x2B,  0x4A,  0xEF,  0x7F,  0x28,  0x48,  0x7A,  0x5C,  0x37,  0x47,  0xD7,  0xBD,  0x15,  0xBA,  0xD7,  0x22,  0xC9,  0x07,  0x7E,  0xC9,  0x0E,  0x47,  0x3A,  0x41,  0x8F,  0xC9,  0x1B,  0x62,  0x41,  0x9F,  0x71,  0xBD,  0x05,  0xC9,  0x76,  0xF9,  0x41,  0xB7,  0xDB,  0x4D,  0xFC,  0x44,  0x78,  0x86,  0x36,  0x4A,  0x83,  0x88,  0x45,  0x41,  0x92,  0x04,  0xA9,  0xB3,  0x79,  0x16,  0x66,  0x5E,  0x37,  0xA6,  0xC9,  0x1B,  0x66,  0x41,  0x9F,  0x24,  0xC9,  0x7E,  0x39,  0xC9,  0x1B,  0x5E,  0x41,  0x9F,  0x41,  0x6E,  0xF9,  0xD7,  0x1D,  0xE9,  0x15,  0x23,  0x7F,  0x28,  0x48,  0x7A,  0x5C,  0x37,  0xEB,  0x71,  0x99,  0x11,  0x2A,  0x35,  0x34,  0x36,  0x64,  0x2A,  0x14,  0x29,  0x68,  0x7A,  0xC9,  0x86,  0x11,  0x12,  0x12,  0x11,  0xBD,  0x15,  0xBE,  0x11,  0xBD,  0x15,  0xBA,  0xD2,  0xD2,  0xD2,  0xD2]

key = 0x42
for t in s:
    print ("\\x%x" % (key^t),end = "")
print ("")
```

    得到一段shellcode,分别用win和linux编译看看哪个能运行

```c
#include <stdlib.h>
const unsigned char shellcode[] =
"\xfc\x68\x6a\xa\x38\x1e\x68\x63\x89\xd1\x4f\x68\x32\x74"
"\x91\xc\x8b\xf4\x8d\x7e\xf4\x33\xdb\xb7\x4\x2b\xe3\x66"
"\xbb\x33\x32\x53\x68\x75\x73\x65\x72\x54\x33\xd2\x64"
"\x8b\x5a\x30\x8b\x4b\xc\x8b\x49\x1c\x8b\x9\x8b\x69\x8"
"\xad\x3d\x6a\xa\x38\x1e\x75\x5\x95\xff\x57\xf8\x95\x60"
"\x8b\x45\x3c\x8b\x4c\x5\x78\x3\xcd\x8b\x59\x20\x3\xdd"
"\x33\xff\x47\x8b\x34\xbb\x3\xf5\x99\xf\xbe\x6\x3a\xc4\x74"
"\x8\xc1\xca\x7\x3\xd0\x46\xeb\xf1\x3b\x54\x24\x1c\x75"
"\xe4\x8b\x59\x24\x3\xdd\x66\x8b\x3c\x7b\x8b\x59\x1c\x3"
"\xdd\x3\x2c\xbb\x95\x5f\xab\x57\x61\x3d\x6a\xa\x38\x1e"
"\x75\xa9\x33\xdb\x53\x68\x77\x76\x74\x26\x68\x56\x6b"
"\x2a\x38\x8b\xc4\x53\x50\x50\x53\xff\x57\xfc\x53\xff\x57"
"\xf8\x90\x90\x90\x90";
int main(int argc, char **argv) {
    int (*ret)();
    ret = (int(*)())shellcode;
    (int)(*ret)();
    exit(0);
}
```

    linux不行,wine把exe执行后直接弹出Vk*8wvt&
    flag : Vk*8wvt&

### WEB200-What should you do now?

    打开网站看源码:

```javascript
var chr =
  "1311|1337|1357|1294|1325|1337|1333|1340|1325|1347|1353|1350|1313|1341|1346|1336|";
var str = "";

function a(arg) {
  var i, k;
  i = "";
  for (k = 0; k < chr.length; k++) {
    if (chr.charAt(k) == "|") {
      //如果是|就让i减去arg
      i -= arg;
      str += String.fromCharCode(i);
      i = "";
    } else {
      //取出chr的每个四位数字给i
      i += chr.charAt(k);
    }
  }
}

function b() {
  str = "";
  a(pass.value);
  alert(str);
}

for (var i = 1294 - 255; i <= 1357 + 255; i++) {
  //我们自己来调用a()来爆破一下密码，由于密码肯定是ASCII范围内，直接在min-255max+255内找
  a(i);
  console.log(str + ">>>>" + i);
  str = "";
}

//Key:YeahYourMind>>>>1236
//flag : YeahYourMind
```

### WEB250-How？

    打开网页,提交一次抓包
    发现sql语句

![](http://ac-HSNl7zbI.clouddn.com/9eKV0GYdOMPdvQKyYooR6chqmrEqHyCv7omJTtct.jpg)

    是个强制md5输入,不过用了true参数,那么加密结果返回的就是md5 hash的raw值
    想要绕过sql只能注入,考虑最短的可能性
    'or'1
    其中1可以为任意非0值

    爆破之得到密文ffifdyop
    其加密结果为

![](http://ac-HSNl7zbI.clouddn.com/GSVOdptJEPaSXP4nhnPQk1RFA955sploUFyAtGJA.jpg)

    提交得到You got it! flag:{45dcbc39e5596ffbb0d09dd3e2bde0fa}
    flag : 45dcbc39e5596ffbb0d09dd3e2bde0fa

### 剩下两个 web 题

    4.流量考的是溢出,只需要输入一个非常长的数字,比如按30s的1,然后 *0,提交返回flag


    5.第二个简直了,抓包看到hint是cmd,cookies直接设置名称为cmd,值为执行的命令,题目说明了是windows,dir发现当前目录下有个文件,复制到地址栏打开得到flag

### RE350-不择手段

    凝聚(CNSS)2014新生招新题

    出来解压出来elf执行文件丢安卓模拟器
    输出是一个class文件
    class文件用jd-gui打开直接看到flag

![](http://ac-HSNl7zbI.clouddn.com/HVY4rdCxbd1rGWlw2T5SoIv4SyWCWcex0NoIkomu.jpg)

    flag : CN55_ARM

### MISC300-Godlike

    下载文件发现里面是个.pcap

![](http://ac-HSNl7zbI.clouddn.com/CEf32yabOXD4D1wDS5DJKqeqSOwqXPX8eY5o97K7.jpg)

    丢给wireshark检查http,发现一个可以的php

![](http://ac-HSNl7zbI.clouddn.com/szDCt9yfdJj8hrQuWaS1s8SK0bMvKdUDqnjr9HbB.jpg)

    再过滤ip

![](http://ac-HSNl7zbI.clouddn.com/mAwVEycL7Fhe3kzJs2SgRAtMUJRqgmDTRlUvSd4K.jpg)

    这是一个shell(phpspy),上传了一个zip

![](http://ac-HSNl7zbI.clouddn.com/hBXFOVfcBPnTzkRu1cNJBvQKhdMfWRX7pQi93BQf.jpg)

    跟入TCP,把hehe.zip提出来

![](http://ac-HSNl7zbI.clouddn.com/fkW9nJ6aUwvE9bJK14fLyEqMnHV2c33U6KorzNDK.jpg)

    继续跟踪发现再shell上执行时还有密码

![](http://ac-HSNl7zbI.clouddn.com/vOWlfaejixi68tqufqydIergGeTeWwywLaEO9Eg7.jpg)

    解压 看到flag

![](http://ac-HSNl7zbI.clouddn.com/P5AQsJRoXGxs4hUQTVAVnErhaX7cv2d3BNg4D4ui.jpg)

    flag{ce8c136df237e86bb7a553347f}

### MISC300-道中道

    这个被坑惨了,上神器stegsolve看RGB的0通道都能找到PK头 甚至还有flag.txt 感觉是个选择通道合并 然而并没有操作成功
    后来观察图片的hex,手动读取差异位..而且最后有个rot13的提示

![](http://ac-HSNl7zbI.clouddn.com/x8y40iBp0ifwjwKUxFmYfpeOvfh50GnM6Eo67UF8.jpg)

    写了片不合格的代码

![](http://ac-HSNl7zbI.clouddn.com/HYUWRVk5mtF4vCJ2k6CfYifKL69eaXQ27CBqSoKr.jpg)

    输出发现是有问题的--hex的顺序..

![](http://ac-HSNl7zbI.clouddn.com/MP9YpjmWpAWmLjQjfcRko50N1AB39mEB0YCt3lhM.jpg)

![](http://ac-HSNl7zbI.clouddn.com/4HSvismucNEusbGiFCUl9Xv3UomxFvTAsjdYwwWR.jpg)

    调整好后..发现是个加密的zip,密码是最后那一串的rot13

    打开flag.txt flag:{40a4156965b782efb4f574c5d0cf219a}
    flag : 40a4156965b782efb4f574c5d0cf219a

### MISC350-细节决定成败

    真的是细节决定成败,直接V2.1.0的binwalk跑出来

![](http://ac-HSNl7zbI.clouddn.com/0lmFbwOepTtnwpBTQmoTCslDrqjFHqTGal7SKGX6.jpg)

![](http://ac-HSNl7zbI.clouddn.com/tLpV4JRwdh9HrGs1suJYHeUtmqtzFVMtOND5YL3j.jpg)

    a6be8a33b7c987f4ffb76d9c9805c7eb
