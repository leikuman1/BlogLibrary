---
title: sql常用工具
date: 2026-04-19 11:00:00
categories:
  - Sql50
tags:
  - 博客
  - 入门
---

写 SQL 题时，真正高频的工具不多，记住下面几个就够了。

## 1. 聚合函数

- `COUNT(*)`：统计行数
- `SUM(col)`：求和
- `AVG(col)`：求平均
- `MAX(col)` / `MIN(col)`：最大值 / 最小值

```sql
SELECT dept_id, COUNT(*) AS cnt, AVG(salary) AS avg_salary
FROM Employee
GROUP BY dept_id;
```

## 2. `CASE WHEN`

做条件判断、分类统计时最常用。

```sql
SELECT
    SUM(CASE WHEN score >= 60 THEN 1 ELSE 0 END) AS pass_cnt
FROM Scores;
```

## 3. `IFNULL()` / `COALESCE()`

处理空值，避免结果是 `NULL`。

```sql
SELECT name, IFNULL(bonus, 0) AS bonus
FROM Employee;
```

## 4. `ROW_NUMBER()`

分组排名、取每组第一条时非常常见。

```sql
SELECT *
FROM (
    SELECT *,
           ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rn
    FROM Employee
) t
WHERE rn = 1;
```

## 小结

刷题时先熟练这 4 个：

- 聚合函数：做统计
- `CASE WHEN`：做条件
- `IFNULL()` / `COALESCE()`：处理空值
- `ROW_NUMBER()`：做分组排名
