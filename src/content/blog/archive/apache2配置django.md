---
title: apache2配置django
pubDatetime: 2015-11-28 00:45:04 +08:00
tags:
  - django
description: Already Archive Before 20230604
postSlug: archive_apache2_with_django
---

apache2 需要安装扩展

```bash
apt-get install libapache2-mod-wsgi-py3  # for python3
apt-get install libapache2-mod-wsgi      # for python2
```

在 httpd.conf 启用

```bash
LoadModule wsgi_module modules/mod_wsgi.so
```

下面是我的配置

```bash
cat /etc/apache2/sites-available/school.conf
```

```python
<virtualhost *:8001>

    ServerName xxx.com
    DocumentRoot /home/lc4t/web_py/school
    Alias /static/ /home/lc4t/web_py/school/school/static/
#    Alias /static/js/ /home/lc4t/web_py/school/school/static/js/
#    Alias /static/css/ /home/lc4t/web_py/school/school/static/css/
    WSGIScriptAlias / /home/lc4t/web_py/school/school/wsgi.py
    <directory "/home/lc4t/web_py/school/school">
        <files wsgi.py>
        Require all granted
        </files>
    </directory>
 </virtualhost>
```

然后 a2ensite school.conf 启用它
注意这里用的 8001 端口 需要配置监听

还有一个主要的文件是 wsgi.py
这个是会自己生成的:

```python
import os
import sys
from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "school.settings")
sys.path.append('/home/lc4t/web_py/school')
application = get_wsgi_application()
# os.environ.setdefault("DJANGO_SETTINGS_MODULE", "settings")
# os.environ['LC_ALL']="en_US.UTF-8"
```

之后可能会出现一些小问题，注意看 error.log 就好
关于后台 css 丢失， 我的解决办法是直接复制 admin 到 static 里面
