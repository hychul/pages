# 에러처리

onNext 이벤트를 통해  Publisher가 전달하는 데이터를 처리하는 것 처럼 onError 이벤트를 통해 Publisher에서 발생한 Exception을 처리할 수 있다.

```java
Flux.range(1, 3)
    .map(it -> {
        if (it == 3) throw new RuntimeException("Exception");
        return it;
    })
    .subscribe(
            item -> System.out.println("[Subscriber] onNext : " + item),
            e -> System.out.println("[Subscriber] onError : " + e.getMessage()),
            () -> System.out.println("[Subscriber] onComplete")
    );
```

위의 코드에선 Subscriber를 Consumer를 통해서 구현하였다. Flux의 기본 Subscriber는 long 형의 최댓값을 이용해 이벤트를 요청하므로 Publisher가 갖는 모든 이벤트를 요청받는다. 실행하면 다음과 같은 결과를 얻을 수 있다.

```terminal
[Subscriber] onNext : 1
[Subscriber] onNext : 2
[Subscriber] onError : Exception
```

Subscriber에서 onError 이벤트를 통해 에러를 처리할 수 있지만, Publisher에서도 에러가 발생했을 때 이를 처리할 수 있다.

## onErrorReturn

```java
Flux.range(1, 3)
    .map(it -> {
        if (it == 3) throw new RuntimeException("Exception");
        return it;
    })
    .onErrorReturn(-1)
    .subscribe(
            item -> System.out.println("[Subscriber] onNext : " + item),
            e -> System.out.println("[Subscriber] onError : " + e.getMessage()),
            () -> System.out.println("[Subscriber] onComplete")
    );
```

```terminal
[Subscriber] onNext : 1
[Subscriber] onNext : 2
[Subscriber] onNext : -1
[Subscriber] onComplete
```

## onErrorContinue

```java
Flux.range(1, 3)
    .map(it -> {
        if (it == 3) throw new RuntimeException("Exception");
        return it;
    })
    .onErrorContinue((e, item) -> System.out.println("[Publisher] onError : " + e.getMessage() + ", Cause by : " + item))
    .subscribe(
            item -> System.out.println("[Subscriber] onNext : " + item),
            e -> System.out.println("[Subscriber] onError : " + e.getMessage()),
            () -> System.out.println("[Subscriber] onComplete")
    );
```

```terminal
[Subscriber] onNext : 1
[Subscriber] onNext : 2
[Publisher] onError : Exception, Cause by : 3
[Subscriber] onComplete
```

## onErrorMap

```java
Flux.range(1, 3)
    .map(it -> {
        if (it == 3) throw new RuntimeException("Exception");
        return it;
    })
    .onErrorMap(e -> new RuntimeException("New Exception"))
    .subscribe(
            item -> System.out.println("[Subscriber] onNext : " + item),
            e -> System.out.println("[Subscriber] onError : " + e.getMessage()),
            () -> System.out.println("[Subscriber] onComplete")
    );
```

```terminal
[Subscriber] onNext : 1
[Subscriber] onNext : 2
[Subscriber] onError : New Exception
```

## doOnError

```java
Flux.range(1, 3)
    .map(it -> {
        if (it == 3) throw new RuntimeException("Exception");
        return it;
    })
    .doOnError((e) -> System.out.println("[Publisher] onError : " + e.getMessage()))
    .subscribe(
            item -> System.out.println("[Subscriber] onNext : " + item),
            e -> System.out.println("[Subscriber] onError : " + e.getMessage()),
            () -> System.out.println("[Subscriber] onComplete")
    );
```

```terminal
[Subscriber] onNext : 1
[Subscriber] onNext : 2
[Publisher] onError : Exception
[Subscriber] onError : Exception
```

## retry

```java
Flux.range(1, 3)
    .map(it -> {
        if (it == 3) throw new RuntimeException("Exception");
        return it;
    })
    .retry(1)
    .subscribe(
            item -> System.out.println("[Subscriber] onNext : " + item),
            e -> System.out.println("[Subscriber] onError : " + e.getMessage()),
            () -> System.out.println("[Subscriber] onComplete")
    );
```

```terminal
[Subscriber] onNext : 1
[Subscriber] onNext : 2
[Subscriber] onNext : 1 // 한번 재시도
[Subscriber] onNext : 2
[Subscriber] onError : Exception
```

