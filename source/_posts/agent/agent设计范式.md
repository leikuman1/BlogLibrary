---
title: agent设计范式
categories: [agent]
tags: []
date: 2026-05-19 22:26:58
---

目前，agent有三种设计范式：分别是React、Plan-and-Execute和Reflexion。

## React(Reasoning and Acting)

React范式就是一个循环，每个循环由三个步骤组成，形成一个完整的Throught-Action-Observation的闭环。

1. Thought：agent根据当前环境和上下文信息进行思考，决定action阶段要做什么。
2. Action：agent执行上一步决定的动作，调用工具或者进行交互。
3. Observation：agent接收action的结果，获取新的环境信息和上下文，进入下一轮循环。
   
为什么要把这三步分开？因为如果让模型直接行动，它可能会冲动决策，比如还没搞清楚用户到底要什么就急着调用工具，就想学生还没读懂题目就急着写答案一样。加入Thought阶段可以让模型先把问题理清楚，写出推理过程，而且这个过程是可见的，调试起来更加方便。

不过React范式有一个明显的缺点就是走一步看一步，每一步都是局部最优决策，处理非常复杂，需要全局规划的任务中，可能在中间几个子任务之间反复打转或忘了最初的目标是什么。

## Plan-and-Execute(先规划后执行)
