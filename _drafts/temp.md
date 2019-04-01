---
title: Multi Flex Server
date: 2019-03-23
categories:
- Development
tags:
- Development
- Java
- NIO
- Reactor

---

 소켓은 네트워크 상에서 서버와 클라이언트가 특정 포트를 통해 양방향 통신이 가능하도록 만들어주는 추상화된 리소스다.  하나의 소켓은 하나의 연결을 담당하기 때문에 다중 접속을 지원하기 위해선 연결 요청이 올 때 소켓을 새로운 프로세스 또는 스레드에 할당하여 데이터 송수신을 가능하게 하였다. 이렇게 소켓을 프로세스에 할당하는 방식을 **멀티 프로세스 기반 서버**, 스레드에 할당하는 방식을 **멀티 스레드 기반 서버**라고 한다. 하지만 이 두 방식은 컨텍스트 스위칭<sup>Context Switching</sup>의 오버헤드가 존재한다. 

![multiflex](https://user-images.githubusercontent.com/18159012/54667814-afb68a80-4b30-11e9-8e72-1ba65dbdfa21.png)

컨텍스트 스위칭은 각 컨텍스트에서 처리되는 복잡도가 적을 수록 비율적으로 더 많은 오버헤드가 발생한다. 이 오버헤드를 없애기 위해선 하나의 프로세스 혹은 스레드에서 여러 개의 소켓을 핸들링할 수 있어야 한다. 이를 **멀티 플렉싱 기반 서버**라고 하며, 리눅스 윈도우와 같은 OS들은 NIO를 지원하기 위해 `select`, `poll` 그리고 `epoll` 과 같은 시스템 콜을 제공하고, 자바에서도 `java.nio` 패키지를 통해 하나의 스레드에서 여러 채널을 모니터링할 수 있는 API가 1.4부터 제공하고 있다.

# 멀티 플렉싱

멀티 플렉싱은 논블록킹<sup>Non-blocking</sup> I/O를 활용한 모델로 기존 블록킹<sup>Blocking</sup> I/O와의 동작의 차이점을 갖는다. 기존 블록킹 I/O의 경우 데이터가 준비 될 때까지 블록된 상태로 대기하며 파일을 다 읽은 뒤에 읽은 데이터 그램과 컨트롤를 함께 반환한다.

![multiflex (1)](https://user-images.githubusercontent.com/18159012/54669068-c6aaac00-4b33-11e9-8532-19a1b32a95af.png)

이에 반해 논블록킹의 경우 요청과 함께 컨트롤을 반환하며, 파일을 읽고 데이터 그램을 생성할 수 있을 때 이벤트를 보내기 때문에, 파일을 읽을 동안 반환된 컨트롤을 통해 다른 작업을 수행할 수 있다.

![multiflex (2)](https://user-images.githubusercontent.com/18159012/54669316-68ca9400-4b34-11e9-94c4-851a5f1e946d.png)

## Java NIO

Java NIO에선 이런 논블록처리를 지원한다. 이를 이해하기 위해선 새롭게 추가된 몇가지에 대한 이해가 필요하다.

### Channel

기존 블록팅 I/O에선 스트림<sup>Stream</sup>을 사용하여 파일을 읽고 쓰는 것이 가능했지만, NIO에선 채널<sup>Channel</sup>을 사용한다.  채널은 스트림과 유사하지만 몇가지 차이점이 있다.

- 채널을 통해서는 읽고 쓸 수 있지만, 스트림은 일반적으로 단방향(읽기 혹은 쓰기)으로만 가능하다.
- 채널은 비동기적으로 읽고 쓸 수 있다.
- 채널은 항상 버퍼에서 부터 읽거나 쓴다.

네트워크 통신을 위해 `java.nio`에서 구현되어 있는 클래스는 다음과 같다.

- DatagramChannel

  : UDP를 이용해 데이터를 읽고 쓴다.

- SocketChannel
  : TCP를 이용해 데이터를 읽고 쓴다.

- ServerSocketChannel
  : 들어오는 TCP 연결을 수신<sup>listening</sup>할 수 있다. 들어오는 연결마다 `SocketChannel`이 만들어진다.

### Buffer

버퍼는 NIO에서 채널과 상호작용할 때 사용된다. 데이터는 버퍼를 통해 채널로 읽혀지거나 쓰여진다.

버퍼에 데이터를 쓸 때 버퍼는 쓰여진 데이터의 양을 기록한다. 만약 데이터를 읽어야한다면 flip() 메서드를 호출해서 버퍼를 쓰기 모드에서 읽기 모드로 전환해야 한다. 읽기 모드에서 버퍼를 사용하면 버퍼에 쓰여진 모든 데이터를 읽을 수 있습니다.
데이터를 읽은 후에는 버퍼를 지우고 다시 쓸 준비를 해야한다. `clear()` 혹은 `compact()`를 호출함으로써 전체 버퍼를 지울 수 있다. (`clear()` 메서드는 버퍼 전체를 지우고, `compact()` 메서드는 이미 읽은 데이터만 지운다.)

### Selector

셀렉터<sup>Selector</sup> 는 어느  채널이 IO event 를 가지고 있는지를 알려준다. `Selector.select()` 는 I/O 이벤트가 발생한 채널을 반환한다. 만약 반환할 채널이 없다면 블록상태로 대기한다.

하나의 스레드에서 여러 채널을 관리할 수 있기 때문에 셀렉터를 사용하면 단일 스레드에서 여러 네트워크 연결을 관리할 수 있다.

### SelectionKey

셀렉션 키<sup>SelectionKey</sup>는 셀렉터가 `select()` 메서드를 통해 이벤트가 발생한 채널을 가져올 때 반환된다. 이 셀렉션 키가 가지고 있는 몇가지 프로퍼티들이 존재하는데, 구독하는 이벤트의 집합, 처리 가능한 이벤트의 집합, 연관된 태널과 셀렉터, 부가적으로 첨부한 객체 등 셀렉터와 채널간의 관계와 커뮤니케이션을 위한 정보들을 포함한다.

# 멀티 플렉싱 기반 서버와 리액터

논블록킹 I/O 그리고 `java.nio`에서 지원하는 셀렉터를 사용하면 단일 스레드로 여러 네트워크 연결을 가능하게 할 수 있다.

![multiflex (3)](https://user-images.githubusercontent.com/18159012/54671233-d7a9ec00-4b38-11e9-94bf-90437944a9e3.png)

스프링에 새롭게 추가된 NIO 지원 모듈인 웹플럭스에서 지원하는 웹서버는 여러가지지만 웹서버를 거쳐 로직을 담당하는 레이어에선 모두 리액터를 기반으로 구현이 되어있다. 리액터는 NIO와는 별개로 동작하는 '비동기' 스트림이지만 멀티 플렉싱과 밀접한 관련이 있는 하나의 특징이 있는데, 바로 유연한 스레드 전환이 가능하다는 것이다.

셀렉터를 사용하여 구현한 웹서버라면, 클라이언트와 연결된 `SocketChannel`에서 처리할 이벤트가 있을 때, 적절한 핸들러를 찾아 request를 넘겨주고 reponse를 전달받는 과정을 거쳐야한다. 별도의 처리를 하지 않는다면 핸들러로 request를 넘겨주는 스레드는 셀렉터가 이벤트가 발생한 채널을 반환받기 위해 돌고 있는 루프<sup>Loop</sup>일 것이다.

만약 이 상황에서 request를 처리하는 동안 블록킹 상태가 된다면 이벤트 루프의 블록상태가 해제될 때까지 다른 채널에서 이벤트들이 핸들링되지 못하게 될 것이다. 만약 셀렉터가 request를 핸들러에 전달하고 핸들러가 다른 스레드에서 이를 처리한다면 셀렉터는 계속 다른 이벤트에 응답할 수 있다.

## NIO + Worker Thread

요청당 스레드를 사용하지 않기 위해 NIO를 사용하려 했는데 다른 스레드에서 요청을 처리해야한다니 이상하게 들릴 수 있지만, 요청에서 사용하는 스레드는 풀링을 통해 CPU가 지원하는 스레드의 수 만큼을 생성하여 사용한다. 사용가능한 스레드의 수보다 많은 스레드를 사용하는 경우엔 그 중 일부는 대기상태에 들어가기 때문에 오버헤드가 커지게 되기 때문이다.

웹플럭스에서 기본 웹서버로 사용되는 Netty에선 이를 Worker 스레드로 부르고 스레드 풀을 사용하여 동작한다. 컨트롤러의 핸들러 메서드는 Worker 스레드에서 호출되며 블록킹이되면 요청을 처리하기 위한 Worker 스레드가 스레드 풀에 반환되지 못하게 되고, 이런 호출이 동시에 일어날 경우 처리할 스레드가 부족하게 되어 요청을 제대로 처리하지 못하게 된다.

이 상황에서 또다시 새로운 스레드를 생성하지 않도록 리액터 스트림을 사용하여 이를 해결하도록 했다. 리액터는 비동기를 강제하지 않지만, `subscribeOn()`과 `publishOn()`과 같은 메서드를 사용하여 스레드를 손쉽게 전환할 수 있다. 때문에 리액터를 사용하면 별도의 스레드를 생성하지 않고 다른 API에서 제공하는 스레드로 전환할 수 있다. NIO를 지원하는 DB를 사용하도록 권장하는 이유도 NIO DB의 셀렉터 스레드로 전환하여 논블록킹한 동작을 보장 받을 수 있기 때문이다. 

# Example Code

같이보면 좋은 글 : http://jeewanthad.blogspot.com/2013/02/reactor-pattern-explained-part-1.html

​                                http://jeewanthad.blogspot.com/2013/02/reactor-pattern-explained-part-2.html

​                                http://jeewanthad.blogspot.com/2013/03/reacter-pattern-explained-part-3.html

# LADM-Personal

WebFlux에서 웹서버 - 리액터 스트림간의 변환을 제공하기 때문에 구현 레벨에서 리액터 스트림을 기반으로 구현되어있다. 앞서 설명한 것처럼 컨트롤러의 핸들러 메서드가 호출되는 스레드는 Netty 웹서버의 Worker 스레드이기 때문에 MVC와 다르게 핸들러 메서드에서 블록킹 API가 호출되거나 너무 많은 시간을 소모하도록 하는 경우 서버 전체에 영향을 끼칠 수 있다.

Personal 서버의 핸들러 메서드의 경우 `ReactiveRepository`, `AdsvcClient`, `Kafaka (Handler)` 에서 리액티브 스트림과 NIO 또는 스레드 풀을 사용한 비동기 구현을 통해 핸들러 메서드가 블록킹되지 않도록 지원하고 있다.

## AdsvcClient

Adaccount, Group을 구독하고, 광고의 상태가 변화 했을때 변화한 정보를 Personal에서 가공하여 알람을 보내기위해 Adsvc에 접근해야한다. Personal에선 다른 서버의 접근을 위해 `RestTemplate` 대신 `WebClient`를 사용한다. `WebClient`는 논블록을 지원하며 스프링 5.0부터 추가되었다. NIO를 사용하기 때문에  `WebClient`의 API가 사용하는 스레드는 nio 스레드를 사용하여 동작한다.

현재는 `subscribOn()` 메서드를 사용하여 동작할 스레드를 지정하고 있지만 추후에 삭제해도 논블록으로 잘 동작한다.

```kotlin
fun getUser(userId: Long): Mono<User> {
        return client.get()
                .uri(GET_USER, userId)
                .retrieve()
                .bodyToMono(User::class.java)
                .subscribeOn(httpScheduler)
                .publishOn(Schedulers.parallel())
                .log(Loggers.getLogger(log.name))
    }
```

## ReactiveJpaRepository

Personal에서 사용하는 MySQL, JPA는 아직 NIO 접근을 지원하지 않는다. 때문에 JPA를 그냥 사용하는 경우 메서드를 호출할 때마다 블록킹 API가 호출되어 문제가 될 수 있다. `ReactiveJpaRepository` 클래스는 `JpaRepository`와 스프링에서 비동기 리포지토리 표준으로 사용되는 `ReactiveCrudRepository` 를 상속받아 JPA를 비동기에서 사용할 수 있도록 하였다.

DB연결을 위한 스레드 수 만큼의 스레드 풀을 만들어 블록킹이 Worker 스레드에서 일어나지 않도록 하였다.

```java
open class ReactiveJpaRepository<T, ID>(protected val jpaRepository: JpaRepository<T, ID>) : ReactiveCrudRepository<T, ID> {
    companion object {
        val jpaScheduler: Scheduler = Schedulers.newParallel("jpa_parallel", 10, true)
    }

    override fun <S : T> save(entity: S): Mono<S> {
        return Mono.just(entity).map { jpaRepository.save(it) }
                .publishOn(Schedulers.parallel())
                .subscribeOn(jpaScheduler)
    }
	//...
}
```

## Kafka

카프카는 현재 다른 서비스들과 같이 블록킹을 사용하여 동작하고 있다. 웹서버를 통해 들어오는 다른 요청들과 달리 카프카는 카프카 스레드를 따로 관리하여 동작하는 것을 기대하기 때문에 Adsvc, Report와 같은 다른 서비스에서 공통으로 사용하는 KafkaListener와 KafkaSender를 사용하고 있다.

다른 점이라면 카프카 메세지를 처리할 때 리액티브 스트림을 사용한다는 점이다. 카프카가 알림을 보내기 위해 사용되는데, 이때 앞서 언급한 `ReactiveJpaRepository`를 상속받는 `NotiRepository`를 사용하여 노티 데이터에 접근한다. 이때 구현이 블록킹이 아닌 리액터 스트림을 사용하기 때문에 이를 사용하여 비동기로 동작한다.

~~현재는 Ack 문제로 인해 `block()` 메서드를 사용하여 리액터 스트림이 동기로 동작하도록 되어있다. 추후에 reactor-kafka 리뷰할 예정~~

### Handler

핸들러는 카프카로 전달받은 노티 메세지 혹은 노티 DB에 저장된 노티 데이터를 사용하여 적절한 작업을 수행한다.