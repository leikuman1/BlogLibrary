---
title: python链接DB
categories: [Python]
tags: [FastAPI, DB]
date: 2026-04-24 20:01:39
---

## 1.引入依赖

在requirements.txt中添加以下依赖：

```txt
pymysql
sqlalchemy
pydantic-settings
```

pymysql是一个纯Python的MySQL客户端库，sqlalchemy是一个ORM（对象关系映射）工具，pydantic-settings用于管理配置,可以通过环境变量或配置文件来设置数据库连接参数。

这里多一嘴，和Java，C++相比，python是动态类型语言，灵活性更高，这是python的设计哲学之一，但是在开发大型项目中，动态类型容易导致类型错误，所有有了pydantic这样的库来提供类型检查和数据验证，pydantic-settings是pydantic的一个扩展，专门用于管理应用程序的配置，可以从环境变量、配置文件等多种来源加载配置.

## 2.配置数据库连接

现在项目根目录里新建一个.env文件，添加以下内容：

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=123456
DB_NAME=restaurant
```

这些环境变量将用于配置数据库连接。

再创建一个config.py文件，添加以下内容：

```python
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    db_host: str
    db_port: int
    db_user: str
    db_password: str
    db_name: str

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def database_url(self) -> str:
        return (
            f"mysql+pymysql://{self.db_user}:{self.db_password}"
            f"@{self.db_host}:{self.db_port}/{self.db_name}?charset=utf8mb4"
        )


settings = Settings()
```

这个配置类会从.env文件中读取数据库连接参数，并提供一个database_url属性来生成数据库连接字符串。

## 3. 创建数据库模型

在models/下根据数据库表结构创建所需要的数据

```python
class Menu(Base):
    __tablename__ = "menus"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False)
    price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    description: Mapped[str | None] = mapped_column(String(255), nullable=True)
    status: Mapped[int] = mapped_column(nullable=False, default=1)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
```

把表结构映射到具体的数据，有点像orm

再在session.py中添加以下内容：

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from app.core.config import settings


engine = create_engine(
    settings.database_url,
    echo=True,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
    expire_on_commit=False,
)


def get_db():
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

这个文件创建了一个数据库引擎，并定义了一个SessionLocal类来管理数据库会话。get_db函数是一个依赖项，可以在FastAPI的路由中使用，以便在请求期间获取数据库会话。

## 4. 使用数据库

在FastAPI的路由中，我们可以使用get_db依赖项来获取数据库会话，并执行数据库操作.

至此，我们已经成功地将FastAPI应用程序连接到MySQL数据库，并且可以使用SQLAlchemy进行数据库操作了。
