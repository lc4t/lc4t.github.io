---
title: 使用Docker简单记录
pubDatetime: 2017-04-11 13:51:41 +08:00
tags:
  - docker
description: Already Archive Before 20230604
postSlug: archive_docker_simple_record
---

OS X 上使用 Docker 的 APP 配置，做一下常用的命令记录

<!--more-->

### 安装与镜像源

使用[官方提供](https://www.docker.com/docker-mac)的 APP

安装好之后配置[DaoCloud 的加速](https://www.daocloud.io/mirror#accelerator-doc)

> 右键点击桌面顶栏的 docker 图标，选择 Preferences ，在 Daemon 标签（Docker 17.03 之前版本为 Advanced 标签）下的 Registry mirrors 列表中加入下面的镜像地址:

> http://27d936ab.m.daocloud.io

> 重启 docker

### Docker 命令

#### 镜像搜索 docker search \*

搜索公共镜像

![docker search](https://ww4.sinaimg.cn/large/006tNc79ly1fed8y5a3hyj31gg0qygxi.jpg)

#### 拉取镜像 docker pull NAME

这个 NAME 就是刚刚搜索出来的 NAME 栏

下载一个 lnmp 的镜像，不选择 CentOS7 是因为可能遇到 systemctl 起不来的坑

![docker pull imagine10255/centos6-lnmp-php56](https://ww2.sinaimg.cn/large/006tNc79ly1fed90jvh5lj30zu056gnr.jpg)

#### 启动镜像 docker run --

eg: `docker run -i -t --name=test -p 0.0.0.0::80 -v ~/Desktop/html:/www/html  lc4t/centos6:lnmp5.6 /bin/bash`

`-i -t /bin/bash` 是用来做前台数据交互

`-p 0.0.0.0::80`是将容器的 80 端口映射到外部的 0.0.0.0 的随机端口，用`-P`将会自动映射所有

`-p`的参数支持`ip:hostPort:containerPort、 ip::containerPort、hostPort:containerPort`

`--dns=IP` 设置 dns 地址，如果无法解析域名需要设置

`--name=test` 写个名字方便

`-v` 是用来做目录映射 Host:Container

`-d` 后台运行

#### 进入停止的镜像 docker attack ID

当`exit`退出后，镜像处于停止状态，再次进入使用`docker attach ID`，这里 ID 能唯一识别就好，也可以是 NAME 或 TAG

#### 其他命令

`docker ps -al` 获取开启的镜像

`docker images` 已经 pull 的镜像包

`docker ps -a | awk '{ if ($1 != "CONTAINER") {print $1;}}' | xargs docker rm` 删除停止的镜像们
