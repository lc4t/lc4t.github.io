---
title: Django引用外部css/js文件
pubDatetime: 2015-10-8 00:45:04
tags:
  - django
description: Already Archive Before 20230604
postSlug: archive_django_use_static
---

除官方文档外，还有其他方法：

目录结构，保证 static 目录与 urls.py settings.py 同目录

    --/web_py
    ------/school
    ----------/grade
    ----------/school
    --------------urls.py
    --------------settings.py
    --------------/static
    ----------manager.py

grade 里，模板文件中引用注意目录位置

settings.py 需要设置：

```python
STATIC_URL = '/static/'
STATICFILES_URLS = (
os.path.join(BASE_DIR, "static"),
)
```

这里注意 BASE_DIR 是哪个目录，是上级的 school 还是与 grade 同级的 school

urls.py 添加
import school.settings # 因为上面的目录是上级的 school，所以注意要 school.settings
再添加一个 url 规则

`url(r'^static/(?P<path>.*)$', 'django.views.static.serve', {'document_root':school.settings.STATIC_URL}),`
