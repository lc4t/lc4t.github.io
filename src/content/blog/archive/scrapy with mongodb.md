---
title: scrapy with mongodb
pubDatetime: 2016-07-28 00:45:04
tags:
  - python
description: Already Archive Before 20230604
postSlug: archive_scrapy_with_mongodb
---

scrapy 用来处理数据(Item)的部分叫做 Pipeline

当 xx_spider.py 中 yield 一个 item，将按照 settings.ITEM_PIPELINES 的顺序保存数据，其中

```python
ITEM_PIPELINES = {
# 'xx.pipelines.FirstPipeline': 1,
'xx.pipelines.DuplicatesPipeline': 2,
'xx.pipelines.MongoPipeline': 3,
}
```

这里后面的数字代表优先级，0-1000，按照从小到达执行 Pipeline

关键在于 pipelines.py 文件，直接给示例

```python

# -*- coding: utf-8 -*-

import pymongo
from scrapy.exceptions import DropItem


class FirstPipeline(object):

def process_item(self, item, spider):
    pass


class DuplicatesPipeline(object):

def __init__(self):
    self.urls_seen = set()

def process_item(self, item, spider):
    #item['url']是和items.py的Fields保持一致的
    if item['url'] in self.urls_seen:
        raise DropItem("Duplicat item found: %s" % item)
    else:
        self.urls_seen.add(item['url'])
        return item

class MongoPipeline(object):

def __init__(self, mongo_uri, mongo_db):
    self.mongo_uri = mongo_uri
    self.mongo_db = mongo_db

@classmethod
def from_crawler(cls, crawler):
    return cls(
        mongo_uri = crawler.settings.get('MONGO_URI'),
        mongo_db = crawler.settings.get('MONGO_DATABASE', 'items')
        )

def open_spider(self, spider):
    self.client = pymongo.MongoClient(self.mongo_uri)
    self.db = self.client[self.mongo_db]

def close_spider(self, spider):
    self.client.close()

def process_item(self, item, spider):
    collection_name = item.__class__.__name__
    self.db[collection_name].insert(dict(item))
    return item



```
