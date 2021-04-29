# 리액티브 스트림이란
리액티브 스트림은 그 이름에서 알 수 있듯이 비동기 처리를 위한 스트림을 의미한다. 리액티브 스트림은 이벤트들이 비동기적으로 생산<sup>Produce</sup>되고 소비<sup>Comsume</sup>되도록 한다.

비동기 이벤트 처리에서 중요한 요소 중 하나는 백프레셔<sup>Back Presure</sup>를 해결하는 것이다. 만약 생산자가 이벤트를 생성하는 속도가 소비자가 이를 처리하는 속도보다 빠르다면, 처리 되지 못한 이벤트는 리소스 부족으로 인해 제대로 처리되지 못하게 된다. 리액티브 스트림에선 이를 방지하기 위해 소비자가 생산자에게 보낼 데이터의 양을 알릴 수 있는 기능을 제공한다.

## Java 8 Stream과 차이
Reactor와 Stream의 가장 큰 차이는, Reactor는 푸시 모델<sup>Push Model</sup>을 사용하고 Stream은 풀 모델<sup>Pull Model</sup>을 사용한다는 것이다. 리액티브의 관점에서 이벤트들은 구독자가 들어왔을 때 구독자에게 푸시된다.

또한 Stream의 경우 풀 받은 모든 데이터들을 처리후 결과값을 리턴하지만, 리액티브 스트림의 경우 정해진 수의 이벤트가 아닌 무한한 이벤트가 생성될 수 있고, 이벤트를 처리하기 위한 구독자도 여러개가 될 수 있다. 뿐만아니라 스트림을 합치고 조절할 수 있다.

# 리액티브 스트림 이벤트
스트림은 시간이 지남에 따라 발생하는 일련의 데이터/이벤트/신호이다. 리액티브 스트림에선 다음 세가지 이벤트를 발생시킬 수 있다.

- onNext
- onComplete
- onError

스트림은 0개 이상의 `onNext` 이벤트를 발생시킨다. `onNext` 이벤트는 데이터를 포함한다. onComplete와 onError는 베타적으로 발생하며, 두 신호 모두 발생하지 않을 수도 있다.

리액티브 스트림은 Publisher를 통해 스트림을 정의하고 Publisher 가 발생시킨 이벤트를 Subscriber를 통해 처리한다.

# Publisher

비동기 적으로 이벤트 스트림을 처리하기 위해선 먼저 이벤트 스트림을 제공해야한다. 처리할 이벤트를 제공하지 않으면 아무것도 할 수 없기 때문에 코드에서도 가장 처음 설정하는 부분이기도 하다. 리액티브 스트림에선 이를 위해 두가지 데이터 타입을 제공한다.

## Flux

첫번째 타입은 Flux이다. 이 데이터 타입을 통해서 0...n 개의 `onNext` 이벤트를 발생 시킬 수 있다.

```java
Flux.just("1", "2", "3");
```

위의 코드로 세개의 String 이벤트를 생산하는 static 스트림을 정의한다.

## Mono

두번째 타입은 0...1개의 `onNext` 이벤트를 발생시킬 수 있는 Mono이다.

```java
Mono.just("foo");
```

위의 코드는 Flux의 예와 비슷하지만 단 하나의 String 이벤트를 생산한다는 차이점을 갖는다.

## Mono가 필요한 이유

Flux와 Mono 둘다 리액티브 스트림에서 정의하는 Publisher 인터페이스를 구현한다. 때문에 Publisher를 통해서 두개의 타입에 상관없이 리액티브 스트림을 사용할 수 있다.

```java
Publisher<String> just = Mono.just("foo");
just = Flux.just("1", "2", "3");
```

이렇게 구현되어 있는 것은 실제로도 유용한데, 리포지토리에서 엔티티를 찾아서 이를 사용할 때, `findOne()` 과 `findAll()` 의 메서드의 데이터 이벤트 갯수와 상관없이 이벤트를 처리할 수 있다.

# Subscriber

리액티브 스트림은 Publisher에 의해 이벤트가 발생하지만, Subscriber가 구독하기 전까진 아무런 동작을 하지 않는다. 더 정확하게 말하면 Subscriber가 이벤트를 요청하기 전까진 이벤트를 발생시키지 않는다.

```java
public interface Publisher<T> {
    void subscribe(Subscriber<? super T> var1);
}
public interface Subscriber<T> {
    void onSubscribe(Subscription var1);

    void onNext(T var1);

    void onError(Throwable var1);

    void onComplete();
}
```

위의 코드는 리액터 스트림에서 정의하고 있는 Publisher와 Subscriber 인터페이스이다. 앞서 설명한 이벤트인 `onNext`, `onError` 그리고 `onComplete`가 Subscriber에 콜백 메서드처럼 정의되어있는 것을 알 수 있다. 하지만 설명하지 않는 부분이 하나 있는데 바로 `onSubscribe()` 메서드와 그의 파라메터인 Subscription이다.

Subscriber는 onSubscribe() 메서드의 파라메터로 얻은 Subscription을 통해 Publisher에게 이벤트를 요청한다. Subscriber가 어떻게 이벤트를 요청하고 처리하는지 코드로 알아보자.

```java
Flux.range(1, 3) // 1부터 3까지 세개의 이벤트를 발생시키는 Publisher
   .subscribe(new Subscriber<>() {
 @Override
    public void onSubscribe(Subscription subscription) {
  System.out.println("[Subscriber] onSubscribe");
 }

    @Override
    public void onNext(Integer item) {
    System.out.println("[Subscriber] `onNext` : " + item);
 }

    @Override
    public void onError(Throwable throwable) {
    System.out.println("[Subscriber] `onError` : " + throwable.getMessage());
 }

    @Override
    public void onComplete() {
    System.out.println("[Subscriber] onComplete");
 }
});
```
위의 코드는 각 이벤트 콜백 메서드에서 어떤 이벤트가 발생했는지 콘솔에 아웃풋을 남기도록 작성되었다. 하지만 직접 실행해보면 의도한 대로 동작하지 않고 `[Subscriber] onSubscribe` 로그만 남을 뿐이다. 그 이유는 이벤트를 요청하는 부분이 없기 때문이다.

Subscription 에는 이벤트를 요청하기 위한 `request(long size)` 메서드와 이벤트를 중지하기 위한 `cancel()` 메서드가 정의되어있다. 메서드 정의에서 알 수 있듯이 이벤트를 요청할 때 요청할 이벤트의 갯수를 지정할 수 있다.

## 이벤트 수보다 많은 Subscription 요청
Publisher가 갖고있는 데이터를 모두 `onNext` 이벤트를 통해서 처리하기 위해선 그 수와 같거나 더 많은 이벤트를 요청해야한다.

```java
   ...
 @Override
    public void onSubscribe(Subscription subscription) {
        System.out.println("[Subscriber] onSubscribe");
        subscription.request(3); // 이벤트 요청
   }
 ...
```
위와 같이 Publisher의 이벤트 갯수 만큼 이벤트를 요청하면 다음과 같이 처음 의도한 대로 동작하는 것을 알 수 있다.

```terminal
[Subscriber] onSubscribe
[Subscriber] `onNext` : 1
[Subscriber] `onNext` : 2
[Subscriber] `onNext` : 3
[Subscriber] onComplete
```

일반적으로 사용되는 Subscriber의 경우 long 형의 최댓값으로 이벤트를 요청하여 갯수에 상관없이 이벤트가 발생할 때마다 `onNext` 이벤트를 발생시키도록 요구한다.

실제로 Flux와 모노의 기본 Subscriber로 사용되는 LambdaSubscriber의 경우 `onSubscribe()` 에서 `Subscription.request(Long.MAX_VALUE)` 코드 라인을 통해 계속적인 이벤트를 Publisher에게 요청한다.

```java
   ...
 @Override
    public void onSubscribe(Subscription subscription) {
        System.out.println("[Subscriber] onSubscribe");
        subscription.request(Long.MAX_VALUE); // 이벤트 요청
   }
 ...
```

위와 같이 코드를 수정하더라도 위와 동일한 경과를 얻을 수 있다.

이벤트 수보다 적은 Subscription 요청
그렇다면 Publisher가 갖고있는 이벤트보다 적은 수의 이벤트를 요청하면 어떻게 동작하게 될까?

```java
 ...
    @Override
    public void onSubscribe(Subscription subscription) {
        System.out.println("[Subscriber] onSubscribe");
        subscription.request(1); // 요청 갯수 변경
   }
   ...
```

위의 코드는 하나의 이벤트만을 요청했고 Publisher로 부터 하나의 이벤트를 전달 받는다. 하지만 결과를 보면 `onComplete` 이벤트가 발생하지 않는 것을 알 수 있다.

```terminal
[Subscriber] onSubscribe
[Subscriber] `onNext` : 1
```

Subscription의 `request()` 메서드는 Publisher에게 이벤트를 요청하는 pull 모델로 동작하지만, 그 요청한 갯수 만큼의 이벤트를 발생시키는 동안 Publisher는 push 모델로 동작한다. 때문에 Publisher의 이벤트가 남아있기 때문에 `onComplete` 이벤트를 발생시키지 않는 것이다.

# 스트림 변환 / 병합

리액티브 스트림은 Java 8 Stream에서 제공하는 `map()`, `filter()`, `flatMap()`과 같은 기능 뿐만 아니라 Flux와 Mono를 서로 전환하도록 하는 기능들을 제공한다.

## map
Java 8 Stream과 유사하다.

## filter
Java 8 Stream과 유사하다.

## flatMap
Java 8 Stream과 유사하다.

## collect
`collect()` 메서드는 Flux에서 발생하는 데이터를 모아서 Collection 형태로 변환하여 `Mono<Collection>` 형태로 스트림을 변환한다.

```java
Flux.range(1, 3)
   .collect(() -> new ArrayList<Integer>(),
             (collection, item) -> collection.add(item))
   .subscribe(
            item -> System.out.println("[Subscriber] `onNext` : " + item),
            e -> System.out.println("[Subscriber] `onError` : " + e.geㄴtMessage()),
           () -> System.out.println("[Subscriber] onComplete")
   );
```

```terminal
[Subscriber] `onNext` : [1, 2, 3]
[Subscriber] onComplete
```

onNext 이벤트는 collect() 메서드에 의해 스트림의 모든 데이터들이 Collection으로 합쳐지기 전까진 발생하지 않는다.

`collect()` 메서드 이외에도 `collectList()`나 `collectMap()`과 같이 자주 사용하는 자료형으로 변환하기 쉽도록 메서드를 제공한다. Mono의 변환은 MonoFromFluxOperator를 구현하는 클래스들을 통해서 동작하기 때문에 다른 방법들은 이를 참고하여 확인하면 된다.

## flatMapMany

`flatMap()`이 일반적으로 Flux에서 Flux, Mono에서 Mono를 생성하여 합칠때 사용것과는 다르게 Mono에서 Flux로 Publisher를 변환하며 합칠때 사용한다.

```java
Mono.just(1)
   .flatMapMany(item -> Flux.just(3, 2, 1))
   .subscribe(
        item -> System.out.println("[Subscriber] `onNext` : " + item),
        e -> System.out.println("[Subscriber] `onError` : " + e.getMessage()),
       () -> System.out.println("[Subscriber] onComplete")
);
```

```terminal
[Subscriber] `onNext` : 3
[Subscriber] `onNext` : 2
[Subscriber] `onNext` : 1
[Subscriber] onComplete
```

위의 코드에서 `flatMapMany()`가 호출된 이후에 사용되는 Publisher는 Flux로 변환되어 사용된다.

위의 메서드 이외에도 `flatMapIterable()`과 같은 메서드가 제공되는데, 스트림이 변환되는 과정은 FluxFromMonoOperator 라는 클래스를 구현하는 클래스들을 확인하면 된다.

## zipWith

리액티브 스트림은 다른 스트림으로의 변환뿐만 아니라 병합 기능도 제공한다. zipWith을 통해 다른 스트림과 병합하여 이벤트를 생성할 수 있다.

```java
Flux.range(1, 3)
   .map(i -> i * 10)
   .zipWith(Flux.range(1, Integer.MAX_VALUE),
             (first, second) -> String.format("First Flux: %d, Second Flux: %d", first, second))
   .subscribe(
        item -> System.out.println("[Subscriber] `onNext` : " + item),
        e -> System.out.println("[Subscriber] `onError` : " + e.getMessage()),
       () -> System.out.println("[Subscriber] onComplete")
   );
```

```terminal
[Subscriber] `onNext` : First Flux: 10, Second Flux: 1
[Subscriber] `onNext` : First Flux: 20, Second Flux: 2
[Subscriber] `onNext` : First Flux: 30, Second Flux: 3
[Subscriber] onComplete
```

1부터 3까지 3개의 데이터를 갖는 스트림과 1부터 무한한 갯수의 데이터를 갖는 스트림이 `zipWith()` 메서드를 통해 병합되었다. 결과 로그를 보면 더 적은 데이터를 갖는 스트림에 맞춰 `onNext` 이벤트를 발생시킨다. 이는 두 스트림의 순서를 바꾸더라도 동일하다.

## zip
앞서 언급한 `zipWith()` 메서드는 한 Publisher가 다른 Publisher와 결합하여 사용하기 위해서 사용하기 때문에 한번에 결합하는 Publisher의 갯수가 2개로 한정이 되어있다. Flux와 Mono에서는 2개 이상의 Publisher를 결합하기 위한 `zip()` 메서드를 제공한다.

```java
var flux1 = Flux.range(1, 15);
var flux2 = Flux.range(1, 10).map(it -> it * 10);
var flux3 = Flux.range(1, 5).map(it -> it * 100);
Flux.zip(flux1, flux2, flux3)
   .subscribe(item -> System.out.println("[Subscriber] `onNext` : " + item),
               e -> System.out.println("[Subscriber] `onError` : " + e.getMessage()),
               () -> System.out.println("[Subscriber] onComplete"));
```

```terminal
[Subscriber] `onNext` : [1,10,100]
[Subscriber] `onNext` : [2,20,200]
[Subscriber] `onNext` : [3,30,300]
[Subscriber] `onNext` : [4,40,400]
[Subscriber] `onNext` : [5,50,500]
[Subscriber] onComplete
```

`zip()` 메서드는 최대 8개의 Publisher를 결합할 수 있도록 인자가 최소 2개부터 8개까지 존재한다. 기본적인 내부 구현은 파라메터도 받은 Publidher들을 튜플Tuple로 구성하여 한번에 접근할 수 있도록 하는 것이지만, 인자가 2개인 경우엔 BiFunction을 사용하여 두 인자를 결합한 형태를 튜플이 아닌 다른 형태로 정의하여 사용할 수 있다.

```java
var flux1 = Flux.range(1, 15);
var flux2 = Flux.range(1, 10).map(it -> it * 10);
Flux.zip(flux1, flux2, (t1, t2) -> t1 + t2)
   .subscribe(item -> System.out.println("[Subscriber] `onNext` : " + item),
               e -> System.out.println("[Subscriber] `onError` : " + e.getMessage()),
               () -> System.out.println("[Subscriber] onComplete"));
}
```

```terminal
[Subscriber] `onNext` : 11
[Subscriber] `onNext` : 22
[Subscriber] `onNext` : 33
[Subscriber] `onNext` : 44
[Subscriber] `onNext` : 55
[Subscriber] `onNext` : 66
[Subscriber] `onNext` : 77
[Subscriber] `onNext` : 88
[Subscriber] `onNext` : 99
[Subscriber] `onNext` : 110
[Subscriber] onComplete
```

`zipWith()` 메서드와 마찬가지로 이벤트의 크기는 인자로 받은 Publisher 중 가장 적은 데이터를 갖는 스트림의 크기로 결정된다.

## then
다른 스트림 병합/변환 메서드와 달리 then() 메서드는 데이터를 전달하는 `onNext` 이벤트가 아니라 `onComplete` 에만 관여한다.

```java
var publish = Flux.interval(Duration.ofSeconds(1))
                 .take(3)
                 .map(it -> {
                      System.out.println("[Publisher] map : " + it);
                      return it;
                 })
                 .then();
publish.subscribe(item -> System.out.println("[Subscriber] `onNext` : " + item),
                  e -> System.out.println("[Subscriber] `onError` : " + e.getMessage()),
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

# 리액티브 스트림 스케줄러

리액티브 스트림은 비동기로 이벤트 스트림을 처리하기 위한 특수한 스트림이지만 따로 설정을 하지 않는다면 동기적으로 수행된다. 때문에 자신의 목적에 맞는 적정한 스케줄러(스레드)를 스트림에게 알려주어야 한다.

스케줄러는 리액티브 스트림의 이벤트 생성과 처리를 위한 Publisher와 Subscriber마다 따로 설정할 수 있다. 이를 위해 `publishOn()`과 `subscribeOn()` 메서드를 제공하는데, `publishOn()` 메서드는 Subscriber가 이벤트를 처리할 때 사용할 스레드를, `subscribeOn()` 메서드는 Publisher가 이벤트를 생성할 때 사용할 스레드를 설정한다.

메서드의 이름이 반대로 된 것같아 보일 수도 있지만 이벤트의 입장에서 생각해보면, Pulisher가 이벤트를 생성publish하여 보내는 곳의 스케줄러를 지정한다는 의미에서 'Producer publish events on ~ thread'의 뜻으로 해석한다면 이해하기 쉽다.

리액터는 다음 스케줄러들를 기본 제공한다.

- Schedulers.immediate() : 현재 쓰레드에서 실행한다.
- Schedulers.single() : 쓰레드가 한 개인 쓰레드 풀을 이용해서 실행한다. 즉 한 쓰레드를 공유한다.
- Schedulers.elastic() : 쓰레드 풀을 이용해서 실행한다. 블로킹 IO를 리액터로 처리할 때 적합하다. 쓰레드가 필요하면 새로 생성하고 일정 시간(기본 60초) 이상 유휴 상태인 쓰레드는 제거한다. 데몬 쓰레드를 생성한다.
- Schedulers.parallel() : 고정 크기 쓰레드 풀을 이용해서 실행한다. 병렬 작업에 적합하다.

## 커스텀 스케줄러
`immediate()`를 제외한 나머지 스케줄러들은 인스턴스로 만들어 관리 할 수 있다. 각 스케줄러 타입에 따라 위에서 설명한 특성을 갖으며, 커스텀한 이름과 설정을 할 수 있다.

elastic의 경우 유휴 상태가 되었을 때 제거되기 까지의 시간을, parallel의 경우 스레드 풀의 크기를 지정할 수 있다. elastic, parallel 그리고 single 스케줄러 모두 스레드의 이름과 데몬 쓰레드로서 동작할 것인지 지정할 수 있다.

# Hot Stream
위에서 언급한 예시들은 모두 Cold 스트림을 기반으로 설명했다. Cold 스트림은 고정된 크기의 데이터를 갖는 스트림을 말하며 사용하기 비교적 쉽다. Cold 스트림의 경우 Subscriber가 구독을 했을 때부터 `onNext` 이벤트를 발생시키기 때문이다. 하지만 구독을 한때부터 이벤트가 발생한다는 특성 때문에 Cold 스트림의 Subscriber는 하나만 존재할 수 있다.

이에 반해 실제 상황에선 계속적으로 이벤트가 발생하는 스트림을 처리하길 기대할 수 있다. 이때 Hot 스트림을 통해 고정된 크기가 아닌 데이터를 여러 Subscriber가 처리하도록 할 수 있다.

## connect()를 이용한 스트림 이벤트 스트리밍

Cold 스트림에선 구독이 이뤄지는 시점부터 Producer가 이벤트를 스트리밍하기 시작한다. 하지만 hot 스트림은 다수의 Subscriber가 구독을 할 수 있게 하기 위해 `connect()` 메서드가 호출되는 시점부터 이벤트 스트리밍을 시작한다.

```java
ConnectableFlux<Object> hotFlux = Flux.create(emitter -> {
    int i = 0;
    while(true) {
        emitter.next(i++);

        try {
            Thread.sleep(1000);
       } catch (InterruptedException e) {
            // DO NOTHING HERE
       }
   }
}).subscribeOn(Schedulers.parallel()).publish();

hotFlux.connect();

Thread.sleep(2000);
hotFlux.subscribe(item -> System.out.println("[Subscriber1] `onNext` : " + item));

Thread.sleep(2000);
hotFlux.subscribe(item -> System.out.println("[Subscriber2] `onNext` : " + item));
```

```terminal
[Subscriber1] `onNext` : 2
[Subscriber1] `onNext` : 3
[Subscriber1] `onNext` : 4
[Subscriber2] `onNext` : 4
[Subscriber1] `onNext` : 5
[Subscriber2] `onNext` : 5
[Subscriber1] `onNext` : 6
[Subscriber2] `onNext` : 6
[Subscriber1] `onNext` : 7
[Subscriber2] `onNext` : 7
...
```

위의 코드에서 `create()` 메서드를 통해 ConnectableFlux 객체를 생성하는데 이 Flux는 실제 데이터 이벤트를 발생시키기 전에 0...n 개의 Subscriber가 스트림을 구독할 수 있도록 하는 특수한 Flux다. 스트림에서 이벤트가 발생하기 시작하는 부분은 `connect()` 메서드가 호출될때이며, 이 메서드가 호출되기 전이라면 `subscribe()` 메서드를 통해 Subscriber가 스트림을 구독하도록 하더라도 이벤트를 발생되지 않는다.

Hot 스트림은 0...n 개의 Subscriber가 존재할 수 있지만, 실제 데이터의 처리를 Subscriber에서 이뤄지기 때문에 먼저 hot 스트림이 생성이 된다면 구독이 되기 전까지 생성되는 데이터들은 아무런 처리가 되지 못하고 버려지게 된다. 이런 경우 데이터가 유의미하게 처리될 수 있도록 `autoConnect()` 메서드를 제공한다.

## autoConnect()를 이용한 이벤트 스트리밍
`autoConnect()` 메서드의 경우 이벤트 스트리밍을 시작할 Subscriber의 수를 지정할 수 있다. default 값은 1로 설정되어 Subscriber가 구독을 시작 했을 때 이벤트 스트리밍을 시작한다.

```java
ConnectableFlux<Object> hotFlux = Flux.create(emitter -> {
    int i = 0;
    while(true) {
        emitter.next(i++);

        try {
            Thread.sleep(1000);
       } catch (InterruptedException e) {
            // DO NOTHING HERE
       }
   }
}).subscribeOn(Schedulers.parallel()).publish();

Flux<Object> autoConnectFlux = hotFlux.autoConnect();

Thread.sleep(2000);
autoConnectFlux.subscribe(item -> System.out.println("[Subscriber1] `onNext` : " + item));

Thread.sleep(2000);
hotFlux.subscribe(item -> System.out.println("[Subscriber2] `onNext` : " + item));
```

```terminal
[Subscriber1] `onNext` : 0
[Subscriber1] `onNext` : 1
[Subscriber1] `onNext` : 2
[Subscriber2] `onNext` : 2
[Subscriber1] `onNext` : 3
[Subscriber2] `onNext` : 3
[Subscriber1] `onNext` : 4
[Subscriber2] `onNext` : 4
[Subscriber1] `onNext` : 5
[Subscriber2] `onNext` : 5
...
```

`Thread.sleep()` 메서드를 통해 구독시점을 뒤로 미룬 후에도 첫 데이터부터 구독이 된것을 확인할 수 있다. `autoConnect()` 메서드를 통해 구독한 Subscriber를 체크하는 Flux를 생성하기 때문에 Subscriber의 수를 스트리밍 트리거로 사용하기 위해선 `autoConnect()` 메서드를 통해 반환받은 Flux를 사용하여 스트림을 구독해야한다.

## FluxProcessor를 이용한 이벤트 스트리밍

Hot 스트림에서 이전까지 알아본 방법들은 Flux 내부에서 만든 데이터를 이벤트로 사용하는 방법이다. 하지만 실제 리액티브 스트림을 사용할 때, 모든 로직을 리액티브 스트림을 통해 구현하기는 쉽지않다. 사용하는 라이브러리가 리액티브 스트림을 지원하지 않는다면 모든 기능을 리액티브 스트림으로 감싸서 구현하는 작업이 동반되기 때문이다. 이런경우 FluxProcessor 를 사용하여 리액티브 스트림 외부에서 이벤트를 발생시킬 수 있다.

```java
UnicastProcessor<Object> hotSource = UnicastProcessor.create();
ConnectableFlux<Object> hotFlux = hotSource.publish();
hotFlux.connect();

hotSource.onNext("0");

Thread.sleep(2000);
hotFlux.subscribe(item -> System.out.println("[Subscriber1] `onNext` : " + item));

hotSource.onNext("1");

Thread.sleep(2000);
hotFlux.subscribe(item -> System.out.println("[Subscriber2] `onNext` : " + item));

hotSource.onNext("2");
```

```terminal
[Subscriber1] `onNext` : 1
[Subscriber1] `onNext` : 2
[Subscriber2] `onNext` : 2
```

FluxProcessor는 이벤트를 다른 스트림으로 확장하기 위해 사용되는데, 위의 코드에서 사용한 UnicastProcessor 는 FluxProcessor를 상속받는 클래스로, `onNext()`, `onError()` 등의 메서드를 통해 UnicastProcessor 를 구독하는 Subscriber에게 이벤트를 전달할 수 있다. 덕분에 UnicastProcessor로 ConnectableFlux를 만들어 스트림 외부에서 이벤트를 생성할 수 있다.

# 에러처리

onNext 이벤트를 통해 Publisher가 전달하는 데이터를 처리하는 것 처럼 `onError` 이벤트를 통해 Publisher에서 발생한 Exception을 처리할 수 있다.

```java
Flux.range(1, 3)
   .map(it -> {
        if (it == 3) throw new RuntimeException("Exception");
        return it;
   })
   .subscribe(
            item -> System.out.println("[Subscriber] `onNext` : " + item),
            e -> System.out.println("[Subscriber] `onError` : " + e.getMessage()),
           () -> System.out.println("[Subscriber] onComplete")
   );
```

위의 코드에선 Subscriber를 Consumer를 통해서 구현하였다. Flux의 기본 Subscriber는 long 형의 최댓값을 이용해 이벤트를 요청하므로 Publisher가 갖는 모든 이벤트를 요청받는다. 실행하면 다음과 같은 결과를 얻을 수 있다.

```terminal
[Subscriber] `onNext` : 1
[Subscriber] `onNext` : 2
[Subscriber] `onError` : Exception
```

Subscriber에서 `onError` 이벤트를 통해 에러를 처리할 수 있지만, Publisher에서도 에러가 발생했을 때 이를 처리할 수 있다.

## onErrorReturn

```java
Flux.range(1, 3)
   .map(it -> {
        if (it == 3) throw new RuntimeException("Exception");
        return it;
   })
   .onErrorReturn(-1)
   .subscribe(
            item -> System.out.println("[Subscriber] `onNext` : " + item),
            e -> System.out.println("[Subscriber] `onError` : " + e.getMessage()),
           () -> System.out.println("[Subscriber] onComplete")
   );
```

```terminal
[Subscriber] `onNext` : 1
[Subscriber] `onNext` : 2
[Subscriber] `onNext` : -1
[Subscriber] onComplete
```

## onErrorContinue

```java
Flux.range(1, 3)
   .map(it -> {
        if (it == 3) throw new RuntimeException("Exception");
        return it;
   })
   .onErrorContinue((e, item) -> System.out.println("[Publisher] `onError` : " + e.getMessage() + ", Cause by : " + item))
   .subscribe(
            item -> System.out.println("[Subscriber] `onNext` : " + item),
            e -> System.out.println("[Subscriber] `onError` : " + e.getMessage()),
           () -> System.out.println("[Subscriber] onComplete")
   );
```

```terminal
[Subscriber] `onNext` : 1
[Subscriber] `onNext` : 2
[Publisher] `onError` : Exception, Cause by : 3
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
            item -> System.out.println("[Subscriber] `onNext` : " + item),
            e -> System.out.println("[Subscriber] `onError` : " + e.getMessage()),
           () -> System.out.println("[Subscriber] onComplete")
   );
```

```terminal
[Subscriber] `onNext` : 1
[Subscriber] `onNext` : 2
[Subscriber] `onError` : New Exception
```

## doOnError

```java
Flux.range(1, 3)
   .map(it -> {
        if (it == 3) throw new RuntimeException("Exception");
        return it;
   })
   .doOnError((e) -> System.out.println("[Publisher] `onError` : " + e.getMessage()))
   .subscribe(
            item -> System.out.println("[Subscriber] `onNext` : " + item),
            e -> System.out.println("[Subscriber] `onError` : " + e.getMessage()),
           () -> System.out.println("[Subscriber] onComplete")
   );
```

```terminal
[Subscriber] `onNext` : 1
[Subscriber] `onNext` : 2
[Publisher] `onError` : Exception
[Subscriber] `onError` : Exception
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
            item -> System.out.println("[Subscriber] `onNext` : " + item),
            e -> System.out.println("[Subscriber] `onError` : " + e.getMessage()),
           () -> System.out.println("[Subscriber] onComplete")
   );
```

```terminal
[Subscriber] `onNext` : 1
[Subscriber] `onNext` : 2
[Subscriber] `onNext` : 1 // 한번 재시도
[Subscriber] `onNext` : 2
[Subscriber] `onError` : Exception
```

레퍼런스 : https://projectreactor.io/docs/core/release/reference/