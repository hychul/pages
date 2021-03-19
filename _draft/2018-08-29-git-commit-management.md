---
title: Git 관리전략
date: 2018-08-29
categories:
- Git
tags:
- Git
- Development
---

fork target branch

~~~console
git remote add [upstream] [target repository]
~~~

```
git remote -v
git pull [upstream]
git checkout [branch]
```

```console
git pull [upstream] [branch]
git push origin [branch]
git pull [upstream] [branch] && git push origin [branch]
```

