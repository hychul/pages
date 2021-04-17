# Hot Stream

위에서 언급한 예시들은 모두 Cold 스트림을 기반으로 설명했다. Cold 스트림은 고정된 크기의 데이터를 갖는 스트림을 말하며 사용하기 비교적 쉽다. Cold 스트림의 경우 Subscriber가 구독을 했을 때부터 onNext 이벤트를 발생시키기 때문이다. 하지만 구독을 한때부터 이벤트가 발생한다는 특성 때문에 Cold 스트림의 Subscriber는 하나만 존재할 수 있다.

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
hotFlux.subscribe(item -> System.out.println("[Subscriber1] onNext : " + item));

Thread.sleep(2000);
hotFlux.subscribe(item -> System.out.println("[Subscriber2] onNext : " + item));
```

```terminal
[Subscriber1] onNext : 2
[Subscriber1] onNext : 3
[Subscriber1] onNext : 4
[Subscriber2] onNext : 4
[Subscriber1] onNext : 5
[Subscriber2] onNext : 5
[Subscriber1] onNext : 6
[Subscriber2] onNext : 6
[Subscriber1] onNext : 7
[Subscriber2] onNext : 7
...
```

위의 코드에서 `create()` 메서드를 통해  `ConnectableFlux` 객체를 생성하는데 이 `Flux`는 실제 데이터 이벤트를 발생시키기 전에 0...n 개의 Subscriber가 스트림을 구독할 수 있도록 하는 특수한 `Flux`다. 스트림에서 이벤트가 발생하기 시작하는 부분은 `connect()` 메서드가 호출될때이며, 이 메서드가 호출되기 전이라면 `subscribe()` 메서드를 통해 Subscriber가 스트림을 구독하도록 하더라도 이벤트를 발생되지 않는다.

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
autoConnectFlux.subscribe(item -> System.out.println("[Subscriber1] onNext : " + item));

Thread.sleep(2000);
hotFlux.subscribe(item -> System.out.println("[Subscriber2] onNext : " + item));
```

```terminal
[Subscriber1] onNext : 0
[Subscriber1] onNext : 1
[Subscriber1] onNext : 2
[Subscriber2] onNext : 2
[Subscriber1] onNext : 3
[Subscriber2] onNext : 3
[Subscriber1] onNext : 4
[Subscriber2] onNext : 4
[Subscriber1] onNext : 5
[Subscriber2] onNext : 5
...
```

`Thread.sleep()` 메서드를 통해 구독시점을 뒤로 미룬 후에도 첫 데이터부터 구독이 된것을 확인할 수 있다. `autoConnect()` 메서드를 통해 구독한 Subscriber를 체크하는 `Flux`를 생성하기 때문에 Subscriber의 수를 스트리밍 트리거로 사용하기 위해선 `autoConnect()` 메서드를 통해 반환받은 `Flux`를 사용하여 스트림을 구독해야한다.

## FluxProcessor를 이용한 이벤트 스트리밍

Hot 스트림에서 이전까지 알아본 방법들은 `Flux` 내부에서 만든 데이터를 이벤트로 사용하는 방법이다. 하지만 실제 리액티브 스트림을 사용할 때, 모든 로직을 리액티브 스트림을 통해 구현하기는 쉽지않다. 사용하는 라이브러리가 리액티브 스트림을 지원하지 않는다면 모든 기능을 리액티브 스트림으로 감싸서 구현하는 작업이 동반되기 때문이다. 이런경우 `FluxProcessor` 를 사용하여 리액티브 스트림 외부에서 이벤트를 발생시킬 수 있다.

```java
UnicastProcessor<Object> hotSource = UnicastProcessor.create();
ConnectableFlux<Object> hotFlux = hotSource.publish();
hotFlux.connect();

hotSource.onNext("0");

Thread.sleep(2000);
hotFlux.subscribe(item -> System.out.println("[Subscriber1] onNext : " + item));

hotSource.onNext("1");

Thread.sleep(2000);
hotFlux.subscribe(item -> System.out.println("[Subscriber2] onNext : " + item));

hotSource.onNext("2");
```

```terminal
[Subscriber1] onNext : 1
[Subscriber1] onNext : 2
[Subscriber2] onNext : 2
```

`FluxProcessor`는 이벤트를 다른 스트림으로 확장하기 위해 사용되는데, 위의 코드에서 사용한 `UnicastProcessor` 는 `FluxProcessor`를 상속받는 클래스로,  `onNext()`, `onError()` 등의 메서드를 통해 `UnicastProcessor` 를 구독하는 Subscriber에게 이벤트를 전달할 수 있다. 덕분에 `UnicastProcessor`로 `ConnectableFlux`를 만들어 스트림 외부에서 이벤트를 생성할 수 있다.