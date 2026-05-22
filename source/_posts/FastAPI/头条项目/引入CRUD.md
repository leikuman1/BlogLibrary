---
title: 引入CRUD
categories: [FastAPI]
tags: [头条项目, CRUD]
date: 2026-04-25 16:38:17
---


## 引入CRUD

接口实现流程的四个步骤

1. 模块化路由->APIRouter
2. 定义模型类->数据库表
3. 在crud文件夹里创建文件，封装操作数据库的方法
4. 在路由处理函数中调用crud的方法

下面展示具体的流程

## 模块化路由

比如说我们有个ai模块，有个接口要到ai_chat表里查询最近与ai的会话记录

首先在routers文件夹里创建一个ai.py文件，定义一个APIRouter实例，并且添加路由处理函数，如

```python
from fastapi import APIRouter
router = APIRouter(prefix="/api/ai", tags=["ai"])
@router.get("/ai")
async def get_session(skip: int=0,limit: int=10, db: AsyncSession=Depends(get_db)):
    result = await get_session_crud(db, skip, limit)
    return {
        "code": 200,
        "msg": "success",
        "data": result
    }
```

这个就相当于controller层了，负责处理请求和响应，调用crud层的方法来操作数据库。

## 定义模型类

在models文件夹里创建一个ai.py文件，定义一个ORM模型类来映射数据库表，如

```python
from datetime import datetime

from sqlalchemy import DateTime, String, Text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.now,
    )


class ai(Base):
    __tablename__ = "ai_chat"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(unique=True, nullable=False, comment="用户id")
    question: Mapped[str] = mapped_column(Text, nullable=False, comment="问题")
    answer: Mapped[str] = mapped_column(Text, nullable=False, comment="回答")
```

注意如果在模型类中如果不映射所有的字段，那么ORM就会忽略没映射的字段

## 在crud文件夹里创建文件，封装操作数据库的方法

其实如果业务比较复杂，这里应该加上schema，Service，Repository等层来分离不同的职责，但这里为了简单起见，就直接在crud里封装了。

```python
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from models.ai import ai


async def get_session_crud(db: AsyncSession, skip: int = 0, limit: int = 10):
    stmt = select(ai).offset(skip).limit(limit)
    result = await db.execute(stmt)
    return result.scalars().all()
```

这个函数就是封装了查询数据库的方法，接收一个数据库会话和分页参数，返回查询结果。

## 在路由处理函数中调用crud的方法

注意include到main.py里
而且router里的方法要和crud里定义的方法方法名不一样，防止和路由处理函数重名了
