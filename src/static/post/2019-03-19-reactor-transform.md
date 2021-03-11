# 스트림 변환 / 병합

리액티브 스트림은 Java 8 Stream에서 제공하는 `map()`, `filter()`, `flatMap()`과 같은 기능 뿐만 아니라 `Flux`와 `Mono`를 서로 전환하도록 하는 기능들을 제공한다.

## map

Java 8 Stream과 유사하다.

## filter

Java 8 Stream과 유사하다.

## flatMap

Java 8 Stream과 유사하다.

## collect

`collect()` 메서드는 `Flux`에서 발생하는 데이터를 모아서 Collection 형태로 변환하여 `Mono<Collection>` 형태로 스트림을 변환한다.

```java
Flux.range(1, 3)
    .collect(() -> new ArrayList<Integer>(),
             (collection, item) -> collection.add(item))
    .subscribe(
            item -> System.out.println("[Subscriber] onNext : " + item),
            e -> System.out.println("[Subscriber] onError : " + e.geㄴtMessage()),
            () -> System.out.println("[Subscriber] onComplete")
    );
```

```terminal
[Subscriber] onNext : [1, 2, 3]
[Subscriber] onComplete
```

onNext 이벤트는 `collect()` 메서드에 의해 스트림의 모든 데이터들이 `Collection`으로 합쳐지기 전까진 발생하지 않는다.

`collect()` 메서드 이외에도 `collectList()`나 `collectMap()`과 같이 자주 사용하는 자료형으로 변환하기 쉽도록 메서드를 제공한다. `Mono`의 변환은 `MonoFromFluxOperator`를 구현하는 클래스들을 통해서 동작하기 때문에 다른 방법들은 이를 참고하여 확인하면 된다.

## flatMapMany

`flatMap()`이 일반적으로 `Flux`에서 `Flux`, `Mono`에서 `Mono`를 생성하여 합칠때 사용것과는 다르게 `Mono`에서 `Flux`로 Publisher를 변환하며 합칠때 사용한다.

```java
Mono.just(1)
    .flatMapMany(item -> Flux.just(3, 2, 1))
    .subscribe(
        item -> System.out.println("[Subscriber] onNext : " + item),
        e -> System.out.println("[Subscriber] onError : " + e.getMessage()),
        () -> System.out.println("[Subscriber] onComplete")
);
```

```terminal
[Subscriber] onNext : 3
[Subscriber] onNext : 2
[Subscriber] onNext : 1
[Subscriber] onComplete
```

위의 코드에서 `flatMapMany()`가 호출된 이후에 사용되는 Publisher는 `Flux`로 변환되어 사용된다.

위의 메서드 이외에도 `flatMapIterable()`과 같은 메서드가 제공되는데, 스트림이 변환되는 과정은 `FluxFromMonoOperator` 라는 클래스를 구현하는 클래스들을 확인하면 된다.

## zipWith

리액티브 스트림은 다른 스트림으로의 변환뿐만 아니라 병합 기능도 제공한다. `zipWith`을 통해 다른 스트림과 병합하여 이벤트를 생성할 수 있다.

```java
Flux.range(1, 3)
    .map(i -> i * 10)
    .zipWith(Flux.range(1, Integer.MAX_VALUE),
             (first, second) -> String.format("First Flux: %d, Second Flux: %d", first, second))
    .subscribe(
        item -> System.out.println("[Subscriber] onNext : " + item),
        e -> System.out.println("[Subscriber] onError : " + e.getMessage()),
        () -> System.out.println("[Subscriber] onComplete")
    );
```

```terminal
[Subscriber] onNext : First Flux: 10, Second Flux: 1
[Subscriber] onNext : First Flux: 20, Second Flux: 2
[Subscriber] onNext : First Flux: 30, Second Flux: 3
[Subscriber] onComplete
```

1부터 3까지 3개의 데이터를 갖는 스트림과 1부터 무한한 갯수의 데이터를 갖는 스트림이 `zipWith()` 메서드를 통해 병합되었다. 결과 로그를 보면 더 적은 데이터를 갖는 스트림에 맞춰 onNext 이벤트를 발생시킨다. 이는 두 스트림의 순서를 바꾸더라도 동일하다.

## zip

앞서 언급한 `zipWith()` 메서드는 한 Publisher가 다른 Publisher와 결합하여 사용하기 위해서 사용하기 때문에 한번에 결합하는 Publisher의 갯수가 2개로 한정이 되어있다. `Flux`와 `Mono`에서는 2개 이상의 Publisher를 결합하기 위한 `zip()` 메서드를 제공한다.

```java
var flux1 = Flux.range(1, 15);
var flux2 = Flux.range(1, 10).map(it -> it * 10);
var flux3 = Flux.range(1, 5).map(it -> it * 100);
Flux.zip(flux1, flux2, flux3)
    .subscribe(item -> System.out.println("[Subscriber] onNext : " + item),
               e -> System.out.println("[Subscriber] onError : " + e.getMessage()),
               () -> System.out.println("[Subscriber] onComplete"));
```

```terminal
[Subscriber] onNext : [1,10,100]
[Subscriber] onNext : [2,20,200]
[Subscriber] onNext : [3,30,300]
[Subscriber] onNext : [4,40,400]
[Subscriber] onNext : [5,50,500]
[Subscriber] onComplete
```

`zip()` 메서드는 최대 8개의 Publisher를 결합할 수 있도록 인자가 최소 2개부터 8개까지 존재한다. 기본적인 내부 구현은 파라메터도 받은 Publidher들을 튜플<sup>Tuple</sup>로 구성하여 한번에 접근할 수 있도록 하는 것이지만, 인자가 2개인 경우엔 `BiFunction`을 사용하여 두 인자를 결합한 형태를 튜플이 아닌 다른 형태로 정의하여 사용할 수 있다.

```java
var flux1 = Flux.range(1, 15);
var flux2 = Flux.range(1, 10).map(it -> it * 10);
Flux.zip(flux1, flux2, (t1, t2) -> t1 + t2)
    .subscribe(item -> System.out.println("[Subscriber] onNext : " + item),
               e -> System.out.println("[Subscriber] onError : " + e.getMessage()),
               () -> System.out.println("[Subscriber] onComplete"));
}
```

```terminal
[Subscriber] onNext : 11
[Subscriber] onNext : 22
[Subscriber] onNext : 33
[Subscriber] onNext : 44
[Subscriber] onNext : 55
[Subscriber] onNext : 66
[Subscriber] onNext : 77
[Subscriber] onNext : 88
[Subscriber] onNext : 99
[Subscriber] onNext : 110
[Subscriber] onComplete
```

zipWith()` 메서드와 마찬가지로 이벤트의 크기는 인자로 받은 Publisher 중 가장 적은 데이터를 갖는 스트림의 크기로 결정된다.

## then

다른 스트림 병합/변환 메서드와 달리 `then()` 메서드는 데이터를 전달하는 onNext 이벤트가 아니라 onComplete 에만 관여한다. 

```java
var publish = Flux.interval(Duration.ofSeconds(1))
                  .take(3)
                  .map(it -> {
                      System.out.println("[Publisher] map : " + it);
                      return it;
                  })
                  .then();
publish.subscribe(item -> System.out.println("[Subscriber] onNext : " + item),
                  e -> System.out.println("[Subscriber] onError : " + e.getMessage()),
                  () -> System.out.println("[Subscriber] onComplete"));
```

```terminal
[Publisher] map : 0
[Publisher] map : 1
[Publisher] map : 2
[Subscriber] onComplete
```

콘솔에 찍힌 로그를 보면 알겠지만, `then()` 메서드 이후에 구독한 Subscrriber에선 onNext에 대한 이벤트를 받지 못하고 단순히 구독한 스트림이 끝났는지만 이벤트로 전달받는다. `then()` 메서드가 호출되면 

리액티브 스트림은 동기처리를 하지 않기 때문에 어떤 작업이 언제 끝날지 외부에선 알 수가 없다. 때문에 스트림의 내부 동작과 상관없이 작업이 모두 끝난 뒤에 다음 작업을 실행해야 할 때 `then()` 메서드를 사용할 수 있다.