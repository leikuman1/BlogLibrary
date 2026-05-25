---
title: Git基本操作
categories: [Git]
tags: []
date: 2026-05-21 08:19:45
---

## commit and checkout

commit是提交代码,产生一次commit指向父commit，checkout是切换分支

## merge

```bash
git merge <branch> # 将branch分支合并到当前分支
```

merge会产生一次新的commit，指向两个父commit

![在fixBug上merge main](img/git-merge-main.png)

![在main上merge fixBug](img/git-merge-bugFix.png)

merge的优势在于保留了每个merge的完整历史记录，缺点是每次merge都会多产生一个commit，如果分支较多，历史记录会变得很复杂
一般在main分支上merge dev

## rebase

```bash
git rebase <branch> # 将当前分支的commit移到branch分支的最新commit之后
```

一般在dev分支上rebase main
