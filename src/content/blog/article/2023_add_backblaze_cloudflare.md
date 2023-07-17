---
title: 使用 Backblaze 和 Cloudflare 作为图床
pubDatetime: 2023-06-28 20:00:00 +08:00
postSlug: 2023-add-backblaze-cloudflare
description: 搞点新玩意之图床
tags:
  - cloud
otherSource: [
	{
		href: "https://mp.weixin.qq.com/s/J5cwXhgwPYEFX42uPRP0yQ", 
		plat: "wechat", 
		badge: "https://img.shields.io/badge/Other-WeChat-1AAD19?style=flat-square&logo=wechat"
	}]
---

## 缘起

本来是打算直接把图放在 github 仓库内的，后来担心同步到其他平台会难以加载（实际上应该用平台的图片托管服务才合理），加上 gihtub pages 更多是托管而非做体验优化，一旦未来想做专门的图片加载优化，可能会不太方便，于是先把图片丢到图床上再说。

图床，首先排除国内托管，众所周知，国内 ugc 服务都要尽审核义务以防止传播违法信息，但我们并不知道服务商审核是用什么办法审核的，是 AI、算法甚至是人工，一旦出现极端情况：不小心传了个人敏感信息且平台因为审核义务将其备份，导致删除不彻底就会很尴尬。

在 Todo 中翻到曾经记录过 Backblaze + Cloudflare 可以作为图床且支持 CDN 。Cloudflare 已经是知名国际厂商了，尤其是其用户可感知的防 D——让用户光明正大等个十几秒。

## 配置

首先前往 [Backblaze 的主页](https://www.backblaze.com/zh_CN/)注册，注册完成后即可到[B2 存储桶](https://secure.backblaze.com/b2_buckets.htm)创建新的存储桶。从 RAWURL 看到其存储是 AWS 的 S3，和腾讯云 COS 等服务没有本质的区别，所以 BackBlaze 更像是一个对象存储的第四方服务。
![添加 B2 存储桶](https://img.sakanano.moe/file/sakanano/public/images/article/065145.png)
创建存储桶(Bucket)需要注意，其名称是平台内唯一的，也就是说你也不能用其他人用过的名字。
另外作为图床，其权限属性应该是 Public，也就是「Files in Bucket are Public」。
![配置存储桶](https://img.sakanano.moe/file/sakanano/public/images/article/065342.png)
创建成功后，我们就可以点击 Create/Download 去传个文件测试下，以获取其资源访问地址。
![Upload/Download](https://img.sakanano.moe/file/sakanano/public/images/article/070115.png)
上传任意文件后，可以点击文件名或右边的 Info 图标，获取其详细信息。
![Details](https://img.sakanano.moe/file/sakanano/public/images/article/071802.png)
在 Friendly URL 中可以得到实际访问的域名，这也是自定义域名的 CNAME 目标域名。

---

使用平台的长域名作为资源地址显得不是很优雅，所以这里用 Cloudflare 将其代理掉，并提供 CDN。
将自己的域名 DNS 托管迁移到[Cloudflare](https://dash.cloudflare.com)，在「DNS > 记录」中添加一条 CNAME 记录，确保其代理状态是「开」的状态。
![配置 CNAME](https://img.sakanano.moe/file/sakanano/public/images/article/072340.png)
另外需要在「SSL/TLS > 概述 > 完全」开启 HTTPS，防止 HTTPS 请求 HTTP 的尴尬情况。
DNS 的规则还是很好用的，例如对 ROOT 的请求，在主站还没做配置的时候，可以先用重定向规则跳到子域名。
![域名重定向规则](https://img.sakanano.moe/file/sakanano/public/images/article/072940.png)
ok，配置好自定义域名后，可以对该域名内容设置缓存了，在「规则 > 页面规则」中，对整个子域设置缓存即可。
![配置自定义域名缓存](https://img.sakanano.moe/file/sakanano/public/images/article/073151.png)

---

最后，别忘了在给存储桶设置缓存，在「Backblaze > 桶 > Bucket Settings」按钮中，设置`{"cache-control":"max-age=43200"}`以保证对象存储桶是使用缓存的。
![Bucket 设置缓存](https://img.sakanano.moe/file/sakanano/public/images/article/073357.png)

## 使用

除了刚刚自己上传图片的方式，也可以使用 iPic，点击「账户 > 应用密钥 > 添加新的应用程序密钥」，创建一个 iPic 专用的 ApplicationKey（注意该 Key 只会出现一次，及时复制）。
把 Bucket、keyID、applicationKey 填入到 iPic 的 Backblaze 源中。
为了快速生成图片链接，点击网址前缀的配置项，可以设置生成的 URL 链接。
图片链接的基本格式是 `https://{domain}/file/{bucket}`，文件夹是上传路径，这里我选择的是`public/images/article`。
![图片网址配置](https://img.sakanano.moe/file/sakanano/public/images/article/071220.png)
这样就可以自动把剪贴板的图片上传到 Backblaze 啦！
