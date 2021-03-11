# 리액티브 스트림이란

리액티브 스트림은 그 이름에서 알 수 있듯이 스레그를 사용한 비동기 처리를 지원하는 스트림을 의미한다. 리액티브 스트림은 이벤트들이 비동기적으로 생산<sup>Produce</sup>되고 소비<sup>Comsume</sup>되도록 한다.

비동기 이벤트 처리에서 중요한 요소 중 하나는 백프레셔<sup>Back Presure</sup>를 해결하는 것이다. 만약 생산자가 이벤트를 생성하는 속도가 소비자가 이를 처리하는 속도보다 빠르다면, 처리 되지 못한 이벤트는 리소스 부족으로 인해 제대로 처리되지 못하게 된다. 리액티브 스트림에선 이를 방지하기 위해 소비자가 생산자에게 보낼 데이터의 양을 알릴 수 있는 기능을 제공한다.

## Java 8 Stream과 차이

리액티브 스트림과 Stream의 가장 큰 차이는, 리액티브는 푸시 모델<sup>Push Model</sup>을 사용하고 Stream은 풀 모델<sup>Pull Model</sup>을 사용한다는 것이다. 리액티브의 관점에서 이벤트들은 구독자가 들어왔을 때 구독자에게 푸시된다.

또한 Stream의 경우 풀 받은 모든 데이터들을 처리후 결과값을 리턴하지만, 리액티브 스트림의 경우 정해진 수의 이벤트가 아닌 무한한 이벤트가 생성될 수 있고, 이벤트를 처리하기 위한 구독자도 여러개가 될 수 있다. 뿐만아니라 스트림을 합치고 조절할 수 있다.

# 리액티브 스트림 이벤트

스트림은 시간이 지남에 따라 발생하는 일련의 데이터/이벤트/신호이다. 리액티브 스트림에선 다음 세가지 이벤트를 발생시킬 수 있다.

- onNext
- onComplete
- onError

스트림은 0개 이상의 onNext 이벤트를 발생시킨다. onNext 이벤트는 데이터를 포함한다. onComplete와 onError는 베타적으로 발생하며, 두 신호 모두 발생하지 않을 수도 있다.

리액티브 스트림은 Publisher를 통해 스트림을 정의하고 Publisher 가 발생시킨 이벤트를 Subscriber를 통해 처리한다.

# Publisher

비동기 적으로 이벤트 스트림을 처리하기 위해선 먼저 이벤트 스트림을 제공해야한다. 처리할 이벤트를 제공하지 않으면 아무것도 할 수 없기 때문에 코드에서도 가장 처음 설정하는 부분이기도 하다. 리액티브 스트림에선 이를 위해 두가지 데이터 타입을 제공한다.

## Flux

첫번째 타입은 `Flux`이다. 이 데이터 타입을 통해서 0...n 개의 onNext 이벤트를 발생 시킬 수 있다. 

```java
Flux.just("1", "2", "3");
```

위의 코드로 세개의 String 이벤트를 생산하는 static 스트림을 정의한다.

## Mono

두번째 타입은 0...1개의 onNext 이벤트를 발생시킬 수 있는 `Mono`이다.

```java
Mono.just("foo");
```

위의 코드는 `Flux`의 예와 비슷하지만 단 하나의 String 이벤트를 생산한다는 차이점을 갖는다.

## Mono가 필요한 이유

`Flux`와 `Mono` 둘다 리액티브 스트림에서 정의하는 `Publisher` 인터페이스를 구현한다. 때문에 Publisher를 통해서 두개의 타입에 상관없이 리액티브 스트림을 사용할 수 있다.

```java
Publisher<String> just = Mono.just("foo");
just = Flux.just("foo");
```

이렇게 구현되어 있는 것은 실제로도 유용한데, 리액터를 사용하는 리포지토리에서 엔티티를 찾아서 이를 사용할 때, `findOne()` 과 `findAll()` 의 메서드의 데이터 이벤트 갯수와 상관없이 이벤트를 처리할 수 있다.

`Flux`도 동일하게 하나의 데이터만 담을 수 있지만 `Mono`는 이를 보장한다. `Flux`의 경우 데이터를 Subscriberr에게 넘겨주더라도 스트림의 종료는 선택적으로 일어나게 되지만. `Mono`는 데이터를 전달하고 스트림이 항상 종료된다. 또한 일반적인 경우에 하나의 오브젝트를 반환하는 메서드에서 콜렉션을 사용하지 않는 것처럼, 코드를 읽었을 때 직관적으로 스트림의 구성을 이해할 수 있게된다.

# Subscriber

 리액티브 스트림은 Publisher에 의해 이벤트가 발생하지만, Subscriber가 구독하기 전까진 아무런 동작을 하지 않는다. 더 정확하게 말하면 Subscriber가 이벤트를 요청하기 전까진 이벤트를 발생시키지 않는다.

```java
public interface Publisher<T> {
    void subscribe(Subscriber<? super T> var1);
}
```

```java
public interface Subscriber<T> {
    void onSubscribe(Subscription var1);

    void onNext(T var1);

    void onError(Throwable var1);

    void onComplete();
}
```

 위의 코드는 리액터 스트림에서 정의하고 있는 Publisher와 Subscriber 인터페이스이다. 앞서 설명한 이벤트인 onNext, onError 그리고 onComplete가 Subscriber에 콜백 메서드처럼 정의되어있는 것을 알 수 있다. 하지만 설명하지 않는 부분이 하나 있는데  바로 `onSubscribe()` 메서드와 그의 파라메터인 `Subscription`이다.

 Subscriber는 `onSubscribe()` 메서드의 파라메터로 얻은 `Subscription`을 통해 Publisher에게 이벤트를 요청한다. Subscriber가 어떻게 이벤트를 요청하고 처리하는지 코드로 알아보자.

```java
Flux.range(1, 3) // 1부터 3까지 세개의 이벤트를 발생시키는 Publisher
    .subscribe(new Subscriber<>() {
	@Override
    public void onSubscribe(Subscription subscription) {
		System.out.println("[Subscriber] onSubscribe");
	}

    @Override
    public void onNext(Integer item) {
    	System.out.println("[Subscriber] onNext : " + item);
	}

    @Override
    public void onError(Throwable throwable) {
    	System.out.println("[Subscriber] onError : " + throwable.getMessage());
	}

    @Override
    public void onComplete() {
    	System.out.println("[Subscriber] onComplete");
	}
});
```

 위의 코드는 각 이벤트 콜백 메서드에서 어떤 이벤트가 발생했는지 콘솔에 아웃풋을 남기도록 작성되었다. 하지만 직접 실행해보면 의도한 대로 동작하지 않고 `[Subscriber] onSubscribe` 로그만 남을 뿐이다. 그 이유는 이벤트를 요청하는 부분이 없기 때문이다.

 `Subscription` 에는 이벤트를 요청하기 위한 `request(long size)` 와 이벤트를 중지하기 위한 `cancel()` 메서드가 정의되어있다. 메서드 정의에서 알 수 있듯이 이벤트를 요청할 때 요청할 이벤트의 갯수를 지정할 수 있다. 

## 이벤트 수보다 많은 Subscription 요청

Publisher가 갖고있는 데이터를 모두 onNext 이벤트를 통해서 처리하기 위해선 그 수와 같거나 더 많은 이벤트를 요청해야한다.

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
[Subscriber] onNext : 1
[Subscriber] onNext : 2
[Subscriber] onNext : 3
[Subscriber] onComplete
```

일반적으로 사용되는 Subscriber의 경우 long 형의 최댓값으로 이벤트를 요청하여 갯수에 상관없이 이벤트가 발생할 때마다 onNext 이벤트를 발생시키도록 요구한다.

실제로 Flux와 모노의 기본 Subscriber로 사용되는 LambdaSubscriber의 경우 onSubscribe() 에서 Subscription.request(Long.MAX_VALUE) 코드 라인을 통해 계속적인 이벤트를  Publisher에게 요청한다. 

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

## 이벤트 수보다 적은 Subscription 요청

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

 위의 코드는 하나의 이벤트만을 요청했고 Publisher로 부터 하나의 이벤트를 전달 받는다. 하지만 결과를 보면 onComplete 이벤트가 발생하지 않는 것을 알 수 있다.

```terminal
[Subscriber] onSubscribe
[Subscriber] onNext : 1
```

 Subscription의 request() 메서드는 Publisher에게 이벤트를 요청하는 pull 모델로 동작하지만, 그 요청한 갯수 만큼의 이벤트를 발생시키는 동안 Publisher는 push 모델로 동작한다. 때문에 Publisher에 요청되지 않은 이벤트가 남아있기 때문에 onComplete 이벤트를 발생시키지 않는다.



레퍼런스 : https://projectreactor.io/docs/core/release/reference/
