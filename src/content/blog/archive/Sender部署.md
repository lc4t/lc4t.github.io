---
title: Sender部署
pubDatetime: 2017-05-17 03:42:04
tags:
  - python
  - django
description: Already Archive Before 20230604
postSlug: archive_sender_deploy
---

<!--more-->

### RabbitMQ

`rpm -Uvh http://www.rabbitmq.com/releases/erlang/erlang-18.1-1.el7.centos.x86_64.rpm`

`rpm -Uvh http://www.rabbitmq.com/releases/rabbitmq-server/v3.5.6/rabbitmq-server-3.5.6-1.noarch.rpm`

`systemctl start rabbitmq-server`

### 数据库初始化

`mysql5.7`

修改编码为 utf-8, 在`/etc/my.cnf`追加

```bash
default-storage-engine=INNODB
character_set_server=utf8
collation-server=utf8_general_ci
```

建立用户

`CREATE USER 'username'@'localhost' IDENTIFIED BY 'password';`

建立数据库

`CREATE DATABASE sender;`

授权

`GRANT ALL ON sender.* TO 'username'@'localhost';`

### sender_API

使用`pip3 install -r requirements.txt`安装依赖

如果中间出现错误请把错误和系统版本一起 Google

修改`settings.py`的`SECRET_KEY`, `DEBUG=False`和数据库信息

`python3 manage.py collectstatic`部署 static 的静态文件

`python3 manage.py migrate`同步数据库

`python3 manage.py createsuperuser`创建管理员

### systemctl 启动 uWSGI

`cat /etc/systemd/system/sender.uwsgi.service`

```bash
[Unit]
Description=uWSGI Sender
After=syslog.target

[Service]
ExecStart=/usr/bin/uwsgi --ini=/var/www/sender_API/uwsgi.ini --chown-socket=nginx:nginx
# Requires systemd version 211 or newer
RuntimeDirectory=uwsgi
Restart=always
KillSignal=SIGQUIT
Type=notify
StandardError=syslog
NotifyAccess=all

[Install]
WantedBy=multi-user.target
```

启用服务 `systemctl enable sender.uwsgi`

启动服务 `systemctl start sender.uwsgi`

如果修改文件后要生效，需要`systemctl daemon-reload`重新加载 service 文件

### Celery 服务

命令行启动的方式是`celery -A send_core worker --loglevel=info --beat`

为了方便，改用 systemd 启动它, 参考官方文档后,

`cat /etc/systemd/system/sender.celery.service`

```bash
[Unit]
Description=Celery Service
After=network.target

[Service]
Type=forking
User=nginx
Group=nginx
EnvironmentFile=-/etc/conf.d/celery
WorkingDirectory=/var/www/sender_API
ExecStart=/bin/sh -c '${CELERY_BIN} multi start ${CELERYD_NODES} \
  -A ${CELERY_APP} --pidfile=${CELERYD_PID_FILE} \
  --logfile=${CELERYD_LOG_FILE} --loglevel=${CELERYD_LOG_LEVEL} ${CELERYD_OPTS}'
ExecStop=/bin/sh -c '${CELERY_BIN} multi stopwait ${CELERYD_NODES} \
  --pidfile=${CELERYD_PID_FILE}'
ExecReload=/bin/sh -c '${CELERY_BIN} multi restart ${CELERYD_NODES} \
  -A ${CELERY_APP} --pidfile=${CELERYD_PID_FILE} \
  --logfile=${CELERYD_LOG_FILE} --loglevel=${CELERYD_LOG_LEVEL} ${CELERYD_OPTS}'

#Restart=always
#KillSignal=SIGQUIT
#Type=notify
#StandardError=syslog
#NotifyAccess=all
[Install]
WantedBy=multi-user.target
```

`cat /etc/conf.d/celery`

```bash
# Name of nodes to start
# here we have a single node
CELERYD_NODES="sender"
# or we could have three nodes:
#CELERYD_NODES="w1 w2 w3"

# Absolute or relative path to the 'celery' command:
CELERY_BIN="/usr/bin/celery"
#CELERY_BIN="/virtualenvs/def/bin/celery"

# App instance to use
# comment out this line if you don't use an app
CELERY_APP="send_core"
# or fully qualified:
#CELERY_APP="proj.tasks:app"

# How to call manage.py
CELERYD_MULTI="multi"

# Extra command-line arguments to the worker
CELERYD_OPTS="--beat --schedule=/var/www/celery/celerybeat-schedule --time-limit=300 --concurrency=8"
#CELERYBEAT_OPTS="--schedule=/var/run/celery/celerybeat-schedule"

# - %n will be replaced with the first part of the nodename.
# - %I will be replaced with the current child process index
#   and is important when using the prefork pool to avoid race conditions.
CELERYD_PID_FILE="/var/www/celery/%n.pid"
CELERYD_LOG_FILE="/var/log/celery/%n%I.log"
CELERYD_LOG_LEVEL="INFO"
```

另外权限要设对

```
chmod -R 0755 /var/www/celery
chown -R nginx:nginx /var/www/celery
```

我觉得实际上这里应该把`beat`部分改用`CELERYBEAT_OPTS`, 但是要连带修改, 偷懒直接写到`CELERYD_OPTS`

另外`--schedule=/var/www/celery/celerybeat-schedule`其实应该在`/var/run`, 但是它每次重启就没了, 且需要重新 chmod, 决定换个位置

### Nginx 配置

```bash
server {
    listen 80;
    server_name 127.0.0.1 115.29.110.218 sender.lc4t.cn;
    access_log /var/log/nginx/sender_FE.access.log;
    error_log /var/log/nginx/sender_FE.error.log;
    root /var/www/sender_FE/dist;
    charset     utf-8;
    location / {
            root /var/www/sender_FE/dist;
            index index.html;
        }
    location ~.*\.(js|css|html|png|jpg)$ {
        expires    7d;
    }

    location ^~ /static/admin {
        alias /var/www/sender_API/static/admin/;
    }

    location ^~ /static/asyncmailer {
        alias /var/www/sender_API/static/asyncmailer/;
    }

    location ~ / (api|admin) {
        uwsgi_pass unix:/var/www/sender_API/sender_API.sock;
        include uwsgi_params;
    }
}
```

最后,将所有的服务 enable,`reboot`看效果

```bash
systemctl status rabbitmq-server
systemctl status mysqld
systemctl status sender.celery
systemctl status sender.uwsgi
systemctl status nginx
```

后面考虑部署`Sentry`来监控异常, 但是这个 vps 太太太弱了估计带不动了, 再说吧
