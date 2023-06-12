---
title: archlinux本地全局转发shadowsocks为http和https
pubDatetime: 2015-06-17 00:45:04
tags:
  - linux
description: Already Archive Before 20230604
postSlug: archive_archlinux_local_global_forward_shadowsocks_to_http_and_https
---

### ss 客户端

首先,要有一个 ss,这里使用的就是 shadowsocks 客户端(sslocal)
`yaourt -S community/shadowsocks`
或者
`sudo pacman -S shadowsocks`

<!--more-->

### 编辑配置文件

```bash
sudo touch /etc/shadowsocks/config.json
sudo gedit /etc/shadowsocks/config.json
{
	"server":"remote-shadowsocks-server-ip-addr",
	"server_port":443,
	"local_address":"127.0.0.1",
	"local_port":1080,
	"password":"your-passwd",
	"timeout":300,
	"method":"aes-256-cfb",
	"fast_open":false,
	"workers":1
}
```

### 测试 ss 启动(可忽略)

`sslocal -c /etc/shadowsocks/config.json`

### 守护进程

```bash
systemctl start shadowsocks-server@config
systemctl enable shadowsocks-server@config
#这里@后面的内容配置文件名字一致(不含json)
```

### 使用 delegate 转发端口协议

`yaourt -S community/delegate`

建立这个文件 /etc/systemd/system/delegate-shadowsocks.service

```bash
#File: /etc/systemd/system/delegate-shadowsocks.service
[Unit]
Description=Delegate daemon for forwarding http requests to shadowsocks
Requires=shadowsocks@config.service
After=network.target shadowsocks@config.service

[Service]
Type=forking
User=nobody
ExecStart=/usr/bin/delegated -P10801 SERVER=http SOCKS=127.0.0.1:1080

[Install]
WantedBy=multi-user.target
```

之后就是 enable 它了

`systemctl enable delegate-shadowsocks.service`

### 再转发 https

再来一个文件咯..

```bash
#File: /etc/systemd/system/delegate-shadowsocks-2.service
[Unit]
Description=Delegate daemon for forwarding http requests to shadowsocks
Requires=shadowsocks@config.service
After=network.target shadowsocks@config.service

[Service]
Type=forking
User=nobody
ExecStart=/usr/bin/delegated -P10802 SERVER=https SOCKS=127.0.0.1:1080

[Install]
WantedBy=multi-user.target
```

`systemctl enable delegate-shadowsocks-2.service`

这样本地的 10801 就是 http,10802 是 https 了～

### 附上 delegated 简单使用方法

开启服务：delegated -P< 要使用的端口> SERVER=http SOCKS=127.0.0.1:<shadowsocks 端口>

停止服务：delegated -P< 要使用的端口> -Fkill</shadowsocks>
