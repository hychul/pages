---
title: Reactor Stream Transform
date: 2019-07-23
categories:
- Development
tags:
- Development
- Java
- Reactor
---

리액터 스트림은 스레드 전환을 쉽게 해준다.

리액터 스트림은 자신이 동작하는 스레드에서 동기적으로 동작한다.

스트림을 다른 스트림으로 전환하거나 서로 다른 스트림을 합칠 수 있다.

`publishOn()`의 경우 처음 호출된 메서드만 `Schedulers`를 설정하고 이후의 메서들 호출은 무시된다.

`zip()`의 경우 누가 메서드를 호출했는지와 상관없이 마지막에 처리된 리액터 스트림의 스레드를 따른다.

`flatMap()`의 경우 `flatMap` 블록 안의 리액터 스트림이 나중에 호출되며, 나중에 호출된 리액터 스트림의 스레드를 따른다.