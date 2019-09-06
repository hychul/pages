---
title: Reactor의 block() 메서드 데드락 이슈
date: 2019-09-05
categories:
- Development
tags:
- Development
- Kotlin
- Reactor
---

이때 리액터 스트림을 라이브러리 지원 여부 등의 이유로 블록킹 환경에서 사용할 때 `block()` 또는 `blockOptional()` 메서드를 사용한다. 하지만 이 메서드들은 간혹가다가 데드락에 빠져버리는 [버그](https://github.com/reactor/reactor-netty/issues/710)를 갖고있다.

때문에 이를 해결할 수 있는 간단한 extension 메서드를 만들어 보았다.

```kotlin
fun <T> Mono<T>.safeBlock() : T {
    val latch = CountDownLatch(1)
    val resultSet = HashSet<T>(1)
    val errorSet = HashSet<Throwable>(1)

    this.subscribe(
            {
                resultSet.add(it)
            },
            {
                errorSet.add(it)
                latch.countDown()
            },
            {
                latch.countDown()
            })

    latch.await()

    if (errorSet.isNotEmpty())
        throw errorSet.first()

    return resultSet.first()
}

fun <T> Mono<T>.safeBlock(timeout: Long, unit: TimeUnit) : T {
    val latch = CountDownLatch(1)
    val resultSet = HashSet<T>(1)
    val errorSet = HashSet<Throwable>(1)

    this.subscribe(
            {
                resultSet.add(it)
            },
            {
                errorSet.add(it)
                latch.countDown()
            },
            {
                latch.countDown()
            })

    latch.await(timeout, unit)

    if (errorSet.isNotEmpty())
        throw errorSet.first()

    if (resultSet.isEmpty())
        throw Exception("Reactor process timeout")

    return resultSet.first()
}
```

비동기로 동작하는 스레드를 동기화 할 때 자주 사용하는 `CountDownLatch`를 사용하여 리액티브 스트림을 호출한 스레드가 리액티브 스트림 스레드의 작업이 완료될 때까지 기다리고, 기존 `block()` 메서드와 마찬가지로 스트림의 결과 혹은 에러를 리액티브 스트림을 호출한 스레드로 넘겨준다.