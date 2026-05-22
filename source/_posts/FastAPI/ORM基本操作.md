---
title: ORM基本操作
categories: [FastAPI]
tags: [ORM]
date: 2026-04-25 08:51:37
---

## 安装依赖

本项目使用SQLAlchemy作为ORM工具，安装依赖：

```txt
sqlalchemy[asyncio]
aiomysql
```

## 创建数据库模型

先创建异步数据库引擎和会话：

```python
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
DATABASE_URL = "mysql+aiomysql://user:password@localhost/dbname"
engine = create_async_engine(DATABASE_URL, 
echo=True ##日志输出SQL语句
pool_size=10, ##连接池大小
max_overflow=20, ##连接池最大溢出数量
)
```

### 定义模型类

定义基类和模型类：

```python
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String
class Base:
    create_time = Column(Integer)
    update_time = Column(Integer)
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, index=True)
    email = Column(String(50), unique=True, index=True)
```

### 定义函数建表

```python
async def init_db():
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
```

再搞一个启动时调用的函数：

```python
@app.on_event("startup")
async def on_startup():
    await init_db()
```

这样就可以在应用启动时自动创建数据库表了。

总结一下，有三步：

1. 创建数据库引擎和会话
2. 定义模型类
3. 定义函数建表并在应用启动时调用
