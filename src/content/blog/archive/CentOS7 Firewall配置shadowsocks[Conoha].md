---
title: CentOS7/Firewall配置shadowsocks[Conoha]
pubDatetime: 2016-03-8 00:45:04
tags:
  - linux
description: Already Archive Before 20230604
postSlug: archive_centos7_firewall_config_shadowsocks
---

### shadowsocks

```bash
yum install -y python-setuptools
easy_install pip
pip install shadowsocks
vim  /etc/shadowsocks/config.json
```

```json
{
  "server": "0.0.0.0",
  "server_port": 25,
  "local_address": "127.0.0.1",
  "local_port": 1080,
  "password": "password",
  "timeout": 300,
  "method": "chacha20"
}
```

    之后 chmod 755 /etc/shadowsocks/config.json
    由于使用了chacha20/其他加密，安装库

```bash
yum install -y libsodium openssl-devel python-devel
yum groupinstall "Development Tools"
pip install M2Crypto
```

    还有一些其他安装的提高性能

```bash
yum install -y libevent
pip install greenlet
pip install gevent
```

    运行or停止

```bash
ssserver -c /etc/shadowsocks/config.json -d start|stop
```

### firewall

```bash
systemctl start|stop|status|disable|enable  firewalld # 控制
firewall-cmd --get-active-zones                       #查看区域信息
firewall-cmd --get-zone-of-interface=eth0             #查看eth0的区域

firewall-cmd --reload                                 #重载规则
firewall-cmd --zone=public --add-interface=eth0       #将eth0添加到public区域
firewall-cmd --zone=public --add-interface=eth0 --permanent # 上一个命令的永久生效（--permanent）
firewall-cmd --set-default-zone=public                #设置默认区域
firewall-cmd --zone=public --list-ports               #查看此区域的开放端口
firewall-cmd --zone=public --add-port=25/tcp          #开放8080，永久生效用--permanent
firewall-cmd --permanent --direct --add-rule ipv4 filter INPUT 0 -p icmp -s 0.0.0.0/0 -d 0.0.0.0/0 -j ACCEPT  # 允许icmp
```
