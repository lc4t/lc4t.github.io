---
title: uestc无线网络连接教程
pubDatetime: 2015-06-09 00:45:04 +08:00
tags:
  - uestc
description: Already Archive Before 20230604
postSlug: archive_uestc_wifi
---

我校 uestc 的账号是宿舍 电信宽带 账号密码..没有的。。右上角叉号

另外,如果宿舍掉线很有可能是你这里没@local

添加了 archlinux 两种方法（linux 比较通用）

重写了 win8 (删除了 winxp win7 的)

修改了 android （不再需要 root）

提供了 ios 的 config 文件及修改位置

## [archlinux] & [ubuntu]

需要用 networkmanager(gnome,或其他网络管理器) 和 wpa_supplicant(用来支持 802.1x)

```bash
sudo pacman -S network-manager-applet wpa_supplicant
```

完成后在 /etc/NetworkManager/system-connections/ 目录内新建一个 uestc 文件 或者 现在 networkmanager 里面新健一个隐藏网络

#### 第一种（推荐第二种）

```bash
sudo touch /etc/NetworkManager/system-connections/uestc
sudo gedit /etc/NetworkManager/system-connections/uestc
```

```bash
[connection]
id=uestc
uuid=881762b8-5201-48b1-9288-f28e80bc0127
type=wifi
permissions=
secondaries=

[wifi]
hidden=true
mac-address=00:C2:C6:80:3C:4D
mac-address-blacklist=
mode=infrastructure
seen-bssids=
ssid=uestc

[wifi-security]
auth-alg=open
group=
key-mgmt=ieee8021x
pairwise=
proto=

[802-1x]
altsubject-matches=
eap=peap;
identity=你的用户名028... （后面加上@local表示连入内网,按照前辈的说法,内网是不计费的,然而现在是包月了）
password-flags=1
phase2-altsubject-matches=
phase2-auth=mschapv2

[ipv4]
dns-search=
method=auto

[ipv6]
dns-search=
method=auto

```

保存后并不能自动连接，主动连接后多次输入密码可成功

#### 第二种：

新建隐藏 wifi 网络，按照大清水寺的要求填写，主要是：

```bash
Connection: uestc
Network name: uestc
Wi-Fi security: 动态 WEP （802.1x）
Authentication: 受保护的EAP（PEAP）
Anoymous identity: 你的用户名,也可以不填
CA certificate: ------
勾选 No CA certificate is required
PEAP version: 自动
Inner authentication: MSCHAPv2
Username: 用户名[@local表示内网]
Password: 密码
不勾选 每次询问密码
```

添加后,可能要求多次输入密码,并且可能会出现无法连接,多次尝试后可成功

对于 ubuntu 同上面第二种方法,在 Network Manager 选择 Edit Connections->Add->Choose a Connection Type 选择 Wi-Fi,下列两个选项卡中

```bash
#其中WiFi中：
SSID: uestc
#其余可以不管
Wi-Fi Security:
Security: Dynamic WEP (802.1x)
Authentication: Protected EAP (PEAP)
Anonymous identity: 可以空 也可以写自己用户名 (@local表示内网)
CA certificate: (None)
PEAP version: Automatic
Inner authentication: MSCHAPv2
Username: 用户名 (@local表示内网)
Password: 密码
#下面两个都不需要勾选
save的时候会由个没有CA证书的提示,选择Ignore
```

OK

同样可能出现重复输入密码,连接失败需要重复的问题

## ---[Android]---

在 WLAN 界面手动添加网络,

```bash
网络名称: uestc
安全性: 802.1x Enterprise
EAP 方法: PEAP
第2阶段身份验证: MSCHAPV2
身份： 用户名[@local表示内网]
密码： 密码
```

保存后可以自动连接

对于安卓 5.0.2 版本用户,uestc 经常不自动连接,可以使用安卓版的 WiFi Manager(google play 有,当然别的地方也有),保存 uestc 后可以手动选择连接它

## win8

1. 右键 2 右下角的 wifi 信号托盘图标,打开网络和共享中心
2. 设置新的连接或网络[如果保存过 uestc 的要在 WLAN 列表里选择忘记此网络]
3. 手动连接到无线网络
4. 网络名: uestc
   安全类型: 802.1x
   勾选 自动启动此连接
5. 更改连接设置

   [连接]默认即可 即 勾选 当此网络在范围内时自动连接
   [安全]默认的不用更改（安全类型是 802.1x 加密类型是 WEP ）
   选择网络身份验证方法： Microsoft:受保护的 EAP（PEAP）
   勾选 每次登录时记住此连接的凭据
   点 PEAP 右边的设置
   取消勾选 通过验证证书来验证服务器的身份
   选择身份验证方法：
   安全密码(EAP-MSCHAP v2) （这里点右边的配置 取消勾选 自动使用 Windows 登录名和密码）
   勾选 启用快速重新连接 （下面 4 个都是默认好的）
   点最下面的高级设置
   勾选 制定身份验证模式 选择 用户身份验证 点击 保存凭据 输入宽带用户名(@local 表示内网)和密码
   ok

另外本人测试一下 ios..，xiaoyao9933 的 ios 是可以用的，也会出现不会自动连，连接断掉的情况，其他还没有测试，鉴于 win8 的方法很通用了，就不再测试 win8 之下版本了

## ios

ios 需要加载一个配置文件 这个文件包含了你的用户名和密码,将这个文件保存为 uestc.mobileconfig (大概可以确认打开这个文件会安装证书)

    修改下面两个位置
    第23行 username （@local表示内网）
    第25行 password

```xml
[xml][/xml]
< ?xml version="1.0" encoding="UTF-8"?>
< !DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
<key>PayloadContent</key>
<array>
<dict>
<key>AutoJoin</key>
<true></true>
<key>EAPClientConfiguration</key>
</dict><dict>
<key>AcceptEAPTypes</key>
<array>
<integer>25</integer>
</array>
<key>EAPFASTProvisionPAC</key>
<false></false>
<key>EAPFASTProvisionPACAnonymously</key>
<false></false>
<key>EAPFASTUsePAC</key>
<false></false>
<key>UserName</key>
<string>username</string>
<key>UserPassword</key>
<string>password</string>
</dict>
<key>EncryptionType</key>
<string>WEP</string>
<key>HIDDEN_NETWORK</key>
<false></false>
<key>PayloadDescription</key>
<string>Configures wireless connectivity settings.</string>
<key>PayloadDisplayName</key>
<string>uestc</string>
<key>PayloadIdentifier</key>
<string>com.company.uestc.wifi1</string>
<key>PayloadOrganization</key>
<string></string>
<key>PayloadType</key>
<string>com.apple.wifi.managed</string>
<key>PayloadUUID</key>
<string>C9DEDB2D-A061-4E9B-BC8F-B54CF678911E</string>
<key>PayloadVersion</key>
<integer>1</integer>
<key>ProxyType</key>
<string>None</string>
<key>SSID_STR</key>
<string>uestc</string>
</array></dict>

<key>PayloadDescription</key>
<string>Profile description.</string>
<key>PayloadDisplayName</key>
<string>uestc</string>
<key>PayloadIdentifier</key>
<string>com.company.uestc</string>
<key>PayloadOrganization</key>
<string></string>
<key>PayloadRemovalDisallowed</key>
<false></false>
<key>PayloadType</key>
<string>Configuration</string>
<key>PayloadUUID</key>
<string>D4DF97B4-4545-4090-80C4-E6D95D8C60B6</string>
<key>PayloadVersion</key>
<integer>1</integer>

</plist>
```

-----------------分---------割---------线--------------
附前辈的版本（重点是 ios 的）

    欢迎转载，转载请注明xiaoyao9933

    我校uestc网络采用WEP 802.1x EAP+PEAP+MSCHAPV2验证方式。

    资费方式说明：
    1、用户名密码即为严格的电脑上拨号器的用户名（要和你电脑上拨号器的账号名一致，注意如‘-’，028等等）
    2、资费方式同你上网账号的资费，分包月和每小时9角两种。
    3、连接账号时，必须保证没有其他客户端正在连接该账号（如寝室登录时，你将不能登录）
    4、如果在用户名后加上@local（如0286185xxxx@local），正常情况下将登陆内网，但是我校这套系统明显有bug，拨了内网照样可以连外网，所以说，相当于免费了（拨内网不计费，这么不和谐的bug，我还是把字体颜色调淡些吧，大家多享受几天福利吧）
    5、在连接WiFi后断开，短时间内，可能无法再次连接，帐号会被占用，等待一段时间就可以再次连接了。

    下面盗用下学校图书馆官方对这种连接的说明（图略了，详情去附件下载）：
    Windows XP无线客户端的相关配置

    引用
    1、在Windows无线客户端中，通过“刷新网络列表”搜索相应的SSID，测试中的SSID为uestc，然后选择“更改高级设置”
    2、在弹出的对话框中，选择“无线网络配置”，在“首选网络”中选择“uestc”，然后点击“属性”
    3、在弹出的“uestc属性”对话框中，在“关联”项中根据SSID的配置，在“网络验证 ”中选择“开放式”，在“数据加密 ”中选择“WEP”
    4、选择“验证”项，在“EAP类型 ”中选择“受保护的EAP (PEAP)”，然后点击“属性”
    5、在弹出的“受保护的EAP属性”的对话框中，去掉在“验证服务器证书 ”选项上的勾。然后点击“配置”
    6、在弹出的“EAP MSCHAPv2 属性”对话框中，去掉“自动使用Windows登录名和密码”选项的勾，然后选择“确定”。
    7、按照以上步骤设置完成后，选择连接SSID uestc，对弹出的对话框中输入您寝室电信账号的用户名和密码。
    8、认证通过后，SSID uestc上会出现“已连接上”，并且客户端可正常访问网络。

    Windows 7无线客户端的相关配置

    1、打开任务栏右下角的无线图标里的“打开网络与共享中心”
    2、点击左侧的“管理无线网络”
    3、点上面的“添加”-》手动创建网络配置文件
    4、网络名添uestc，安全类型802.1x，其他的不变。下一步。
    5、点“更改连接设置”里的“安全”选项卡，点“设置”
    6、取消勾选“验证服务器证书”。
    7、在弹出的“EAP MSCHAPv2 属性”对话框中，去掉“自动使用Windows登录名和密码”选项的勾，然后选择“确定”。
    8、按照以上步骤设置完成后，选择连接SSID uestc，对弹出的对话框中输入您寝室电信账号的用户名和密码。
    9、认证通过后，SSID uestc上会出现“已连接上”，并且客户端可正常访问网络。
    （如果你想保存用户名和密码，在刚才第5步的安全选项卡中点“高级设置”，勾选“指定身份验证模式”--》用户身份验证，然后点保存凭据，里面输入用户名和密码即可。）

    Android设备无线客户端的相关配置

    上面的方法在电脑上连接uestc这个网同样适用，既然在教学楼了，大家都是带手机的人，手机怎么上呢？
    下面我介绍下我自己找到的Android手机的连接方法：
    1、点击设置里的无线和网络设置-&gt;WLAN设置-&gt;拖动到底部，选择添加WLAN网络。
    2、网络SSID写：uestc
    3、安全性选802.1x EAP
    4、阶段2身份验证选择MSCHAPv2
    5、身份写上你寝室账号的用户名（要和你电脑上拨号器的账号名一致，注意如‘-’，028等等），匿名身份不填。
    6、密码填，账号密码
    7、点击保存
    8、用Root Explorer（也称RE管理器，前提是root过的系统），长按住 /data/misc/wifi/wpa_supplicant.conf这个文件，选“用文本编辑器打开”。
    9、这个文件里你会看到一大堆network，找到ssid=uestc那个（就是你刚刚创建的），找到key_mgmt那项，改为‘key_mgmt=IEEE8021X’，也就是删掉了IEEE8021X前面的WPA那个。
    10、点手机的菜单键，保存并退出。
    11、现在你去wlan管理里看看（最后重新打开WiFi一次），是不是系统开始自动连接教学楼的uestc信号了，如果开始获取IP，那就是认证通过了，等一会儿后，就连接成功了（没获取IP，系统会自动重试）

    Android版的配置其实可以完全可以通过改那个文件弄完，过几天要是有空的话（最近很忙），我可以写一个简陋的清水河网络便捷配置的apk。

    iOS / Mac OS 设备客户端设置

    其实我之前就想自己写个配置证书生成器，奈何js写的不好，又以为要签名（后来发现不用签名），在这里感谢haozi.name朋友的制作。
    原帖传送门http://bbs.qshpan.com/read.php?tid=1107108&amp;fpage=2

    iOS

    1、用iOS上的Safari浏览器打开 ~http://haozi.name/uestc.php~ [新地址](https://lc4t.me/uestc.php)
    2、填写用户名密码(就是上网账号)
    3、点击生成配置
    4、系统将跳转到配置文件安装界面
    (这里会显示配置文件unsigned 正常.因为签名需要你的设备ID)
    5、点击安装.
    6、搞定之后 到能搜到的uestc网络的地方
    WiFi里面选连接即可。（初次使用会弹出是否信任认证 ，点信任即可。）

    Mac OS

    Safari 打开http://haozi.name/uestc.php填写用户名密码(就是上网账号) 点击生成配置会自动下载一个 uestc.mobileconfig到你的下载目录双击确认安装即可。

    Ubuntu 11.04连接示范

    点击无线图标，选择连接到隐藏的无线网络，按以下方式选择就可以了
    电子科技大学【无线校园】品学楼，食堂，图书馆----uestc信号连接，多客户端非官方说明指南

    其他linux发行版示范

    首先确认你安装了wpa_supplicant,如果是apt方式的

    sudo apt-get install wpasupplicant

    没有apt或其他方式的，可以自己下载源代码编译一下
    然后创建一个新的配置文件（没gedit的，vim编辑也不错）

    sudo gedit /etc/wpa_supplicant/wpa_supplicant.conf

    配置文件如下：

    [bash]
    network={
        ssid="uestc"
        scan_ssid=1
        key_mgmt=IEEE8021X
        eap=PEAP
        phase2="auth=MSCHAPV2"
        identity="0286185xxxx"
        password="*********"
    }
    [/bash]

    改变网络接口配置

    [bash]sudo gedit /etc/network/interfaces[/bash]

    在你的无线网卡下面添加如下：

    [bash]wpa-driver wextwpa-conf /etc/wpa_supplicant/wpa_supplicant.conf[/bash]

    最后重启下网络服务

    [bash]sudo /etc/init.d/networking restart[/bash]

    FAQ

    Q：1、这个用的什么账号，怎么计费？
    A：用的寝室的账号，按电信的方式来，也就是小时和包月两种。

    Q：2、为什么Android的还要改文件？
    A：因为android自带的802.1x是WPA加密方式的，我们学校是WEP的。

    Q：3、WP7能不能用？
    A：非常抱歉，不能

    Q：4、好麻烦啊
    A：一次配置，以后自动享受

    Q：5、能不能多个设备同时登陆同一账号？
    A：我试了一下，好像不能。你寝室如果登着这个账号，手机再在这边连可能连不上。

    Q：6、我想换账号怎么办？
    A：一定要在/data/misc/wifi/wpa_supplicant.conf这个文件里改用户名和密码，在系统里改的话又会加上那个WPA选项。

    Q：7、网速如何？
    A：可能是目前知道的人少的原因吧，速度非常快，目前可达1.5MB/s
