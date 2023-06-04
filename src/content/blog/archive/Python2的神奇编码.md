---
title: Python2的神奇编码
pubDatetime: 2017-07-12 10:00:00
tags:
  - python
description: Already Archive Before 20230604
---

尝试解决 Python 编码问题

<!--more-->

### 基础知识

#### 编码基础

1. Unicode 是一种字符标准，GBK、UTF-8 都是其实现，我们说的编码应当是后者（即具体的实现）
2. Windows 默认编码为**GBK**，Linux/MacOS 为**UTF-8**，这会影响 python 文件 IO，其实不影响本身的编码
3. Python 有默认字符类型和默认字节类型
4. 底层存储用的是二进制（字节类型序列），使用什么编码来识别它决定了它显示为乱码还是期望值

#### decode/encode 方法

不论在 python2 还是 python3，encode 即转换为字节类型，decode 即转换为字符串类型，只不过两个版本的 python 对字节类型、字符串类型做了修改

那么，理论上字节类型只应该有 decode 方法，字符串类型只应该有 encode 方法才对吧（python3 是这样的）？

但是由于 python2 的设计缺陷，即两者同时有两种方法

另外，在 Python2 中，两个方法的默认参数为**encoding='ascii'**，而 python3 中为**utf-8**，这取决于 python 编码，即**sys.getdefaultencoding()**

### Python2 情形

#### str 字节类型

在使用引号引住的情形，默认使用**str**类型，这是已经**编码过的字节序列**，即**bytes**

```python2
>>> type('a')
<type 'str'>
>>> type('哈哈')
<type 'str'>
>>> type('😑')
<type 'str'>
```

字节序列的特点是\x ，比如

```python2
>>> '哈哈'
'\xe5\x93\x88\xe5\x93\x88'
```

这里\x 是表示其为字节序列，即直接说明了 16 进制串为 **e59388e59388**，这里可以看到**哈**被编码为了 16 进制串**e59388**

这说明在 Python2、MacOS 下，默认一个汉字占用 3 字节，实际上，这是因为一个中文字被 UTF-8 编码为了 3 字节

验证一下'哈哈'是什么编码

```python2
>>> chardet.detect('哈哈')
{'confidence': 0.7525, 'language': '', 'encoding': 'utf-8'}
```

在此要额外说一下

```python2
>>> '\xe5\x93\x88\xe5\x93\x88'.decode('utf-8')
u'\u54c8\u54c8'
>>> print(u'\u54c8\u54c8')
哈哈
```

而 python3 中，bytes 是没有 decode 方法的，python2 发什么了什么呢？

**python2 的 str 类型也有 encode 方法，这是设计缺陷**

另外我们在 Windows、Python2 下尝试一下

```python2
>>> '哈哈'
'\xb9\xfe\xb9\xfe'
```

和 MacOS 情形不同，但是同样是**哈哈**，为什么显示的结果不同呢？

这就是 bytes，简单来说，bytes 是存储在物理设备上的实际值，至于怎么存、怎么理解它，取决于**UTF-8、GBK**这样的实现标准

当然我们也可以手动确认使用什么标准，例如

```python
>>> print('\xb9\xfe\xb9\xfe'.decode('gbk'))
哈哈
```

#### unicode 字符串类型

```
>>> type(u'哈哈')
<type 'unicode'>
>>> type(u'a')
<type 'unicode'>
```

上面说过，unicode 是一种标准，这里 python2 将**unicode**作为一种字符串类型，可以看做一种实现

在 MacOS、Windows 上，下面的返回是相同的

```python2
>>> u'哈哈'
u'\u54c8\u54c8'
>>> type(u'哈哈')
<type 'unicode'>
```

在字符串前面的\u 表示其后面为**unicode**字符串，由于其本身是一种实现，那么在 Windows、MacOS 上就不会有区别，这点与 str 类型不同

### Python3 情形

#### bytes 字节类型

在 Python3 中引入了 b''表示字节类型，且 type 使用了 bytes

```python3
>>> b'\xe5\x93\x88\xe5\x93\x88'
b'\xe5\x93\x88\xe5\x93\x88'
>>> type(b'\xe5\x93\x88\xe5\x93\x88')
<class 'bytes'>
```

并且 python3 不允许字节、字符串类型隐式转换，必须使用 encoded/decode 方式，由此很多库的返回值要多加一个 decode 了

#### str 字符串类型

```python3

>>> '哈哈'
'哈哈'
>>> type('哈哈')
<class 'str'>
```

python3 使用了 str，即引号引住的方式表示这是一个字符串，也不需要使用\u 来特意声明

#### Python2 的编码问题

有一个核心的误导在于，str 和 unicode 是两种不同的数据类型，但是偏偏可以混用（python2 的 str 和 unicode 同是一个父类**basestring**）

而混用时隐式转换使用的是环境默认编码(ascii)

在 python2 中

```python2
>>> base64.b64encode(u'abc')
'YWJj'
>>> base64.b64encode('abc')
'YWJj'
```

在 python3 中

```
>>> base64.b64encode('abc')
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "/usr/local/Cellar/python3/3.6.1/Frameworks/Python.framework/Versions/3.6/lib/python3.6/base64.py", line 58, in b64encode
    encoded = binascii.b2a_base64(s, newline=False)
TypeError: a bytes-like object is required, not 'str'
>>> base64.b64encode(b'abc')
b'YWJj'
```

这里是 python2 的 unicode 向 str 隐式转换，下面这个例子更好理解

```Python2
>>> 'abc' + u'abc'
u'abcabc'
>>> type('abc' + u'abc')
<type 'unicode'>
```

而 python3 中这样是不允许的

```python3
>>> 'abc' + b'abc'
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: must be str, not bytes
```

**其次，python 存在默认的编码和参数**

在 python2 中，encode、decode 的参数为 ascii，这导致了只有寥寥字母数字可以顺利通关，其他的不指定编码必定报错

```python2
>>> u'abc'.encode()
'abc'
>>> u'我要报错'.encode()
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
UnicodeEncodeError: 'ascii' codec can't encode characters in position 0-3: ordinal not in range(128)
```

这里的错误时说，**它没法用 ascii 识别这个中文的 utf-8 编码**

因为字节是无国界的，编码实现是有偏见的，这里想要把 unicode 转为 str，而 encode 默认使用 ascii 方式来转换，

但是这里是中文，unicode->ascii 转换失败（越界）

```python2
>>> u'abc啊'.encode()
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
UnicodeEncodeError: 'ascii' codec can't encode character u'\u554a' in position 3: ordinal not in range(128)
>>> u'\u0061\u0062\u0063啊'
u'abc\u554a'
```

#### 暴力的解决方案

在**不能使用 Python3**的情况下，**统一编码**是你唯一的出路，最好加上文件保存编码声明 # -\*- coding: utf-8 -\*-

强烈反对使用 sys.setdefaultencoding()，因为几乎所有问题都可以通过 encode/decode 解决，且[Dangers of sys.setdefaultencoding('utf-8')](https://stackoverflow.com/questions/28657010/dangers-of-sys-setdefaultencodingutf-8)

首先明确进入的字符串是什么编码，使用这个编码将之 encode 为字节类型，就可以随意转换了，为了以后兼容，使用 UTF-8 是一种好方案

#### 一般原则

文本使用字符串类型，通信、网络、IO 接口使用字节类型
