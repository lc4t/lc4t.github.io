---
title: React setState后值不能立即更新
pubDatetime: 2016-06-03 00:45:04 +08:00
tags:
  - react
description: Already Archive Before 20230604
postSlug: archive_react_setstate
---

```js

setPasswordFirst: function (password)
  {

    this.setState({
      passwordFirst: password
    }, function(){this.check()});

  },
  check: function (){
    this.refs.passwordAgainCheck.sameCheckAgain(this.state.passwordFirst, this.state.passwordSecond);
  },
  setPasswordSecond: function (password)
  {
    this.setState({
      passwordSecond: password
    }, function(){this.check()});
  },
```

    this.setState的值是不会立即更新的，如果在this.setState()后面再输出this.state.passwordFirst，值还是原来的。这时候利用setState的回调函数即可。
