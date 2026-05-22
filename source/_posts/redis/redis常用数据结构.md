---
title: 常用数据结构和操作函数
date: 2026-04-19 12:00:00
categories:
  - Redis
tags:
  - 博客
  - 入门
---


## 1. String

最常用，适合存字符串、数字、JSON。

常用命令：
- `SET key value`：设置值
- `GET key`：取值
- `MSET k1 v1 k2 v2`：一次设置多个值
- `MGET k1 k2`：一次取多个值
- `INCR key`：数字加 1
- `DECR key`：数字减 1
- `SETEX key seconds value`：设置值并加过期时间
- `SETNX key value`：key 不存在才设置，常用于加锁

---

## 2. Hash

适合存对象、字段集合。

常用命令：
- `HSET key field value`：设置字段值
- `HGET key field`：取某个字段值
- `HMGET key f1 f2`：取多个字段值
- `HGETALL key`：取全部字段和值
- `HDEL key field`：删除字段
- `HINCRBY key field n`：字段数字加 n

---

## 3. List

双端列表，适合队列、消息流。

常用命令：
- `LPUSH key v1 v2`：从左边放入
- `RPUSH key v1 v2`：从右边放入
- `LPOP key`：从左边取出
- `RPOP key`：从右边取出
- `LRANGE key start end`：查看一段数据
- `LLEN key`：看长度

---

## 4. Set

无序、元素唯一，适合去重。

常用命令：
- `SADD key v1 v2`：添加元素
- `SREM key v1`：删除元素
- `SMEMBERS key`：查看全部元素
- `SISMEMBER key v`：判断元素在不在
- `SCARD key`：看元素个数
- `SINTER k1 k2`：求交集
- `SUNION k1 k2`：求并集

---

## 5. ZSet

有序集合，带分数，适合排行榜。

常用命令：
- `ZADD key score value`：添加元素和分数
- `ZREM key value`：删除元素
- `ZRANGE key 0 -1`：按分数从小到大查看
- `ZREVRANGE key 0 -1`：按分数从大到小查看
- `ZSCORE key value`：看元素分数
- `ZRANK key value`：看正序排名
- `ZINCRBY key n value`：分数加 n

---

## 6. Bitmap

按位存储，适合签到、活跃统计。

常用命令：
- `SETBIT key offset 1`：设置某一位
- `GETBIT key offset`：查看某一位
- `BITCOUNT key`：统计 1 的个数
- `BITOP op dest k1 k2`：做位运算

---

## 7. HyperLogLog

适合做去重计数、UV 统计。

常用命令：
- `PFADD key v1 v2`：添加数据
- `PFCOUNT key`：统计数量
- `PFMERGE newKey k1 k2`：合并统计

---

## 8. Stream

消息流，适合消息队列、消费组。

常用命令：
- `XADD key * field value`：添加消息
- `XRANGE key - +`：查看消息范围
- `XREAD STREAMS key id`：读取消息
- `XGROUP CREATE key group 0`：创建消费组
- `XREADGROUP GROUP g c STREAMS key >`：按消费组读消息
- `XACK key group id`：确认消息已消费

---

## 通用命令

几乎所有类型都会用到。

常用命令：
- `DEL key`：删除 key
- `EXPIRE key seconds`：设置过期时间
- `TTL key`：查看剩余过期时间
- `EXISTS key`：判断 key 是否存在
- `TYPE key`：查看 key 的类型
- `SCAN 0`：分页查 key

---

## 一句话速记

- `String`：值
- `Hash`：对象
- `List`：队列
- `Set`：去重集合
- `ZSet`：排行榜
- `Bitmap`：位统计
- `HyperLogLog`：基数统计
- `Stream`：消息队列
