---
title: FastAPI DevDetails
categories: [FastAPI]
tags: []
date: 2026-04-27 22:27:04
---

## 系统架构

这里类比一下spring的四层架构，简单讲述一下FastAPI的架构思想。

首先，从大体上看，spring是四层架构，controller->service(impl)->mapper(dao)
这三层的任务分别是分发路由，处理业务，操作db，分别对应FastAPI的router，service，repository

