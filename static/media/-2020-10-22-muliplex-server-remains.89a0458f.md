# MVC와의 차이점
WebFlux에서 웹서버 - 리액터 스트림간의 변환을 제공하기 때문에 구현 레벨에서 리액터 스트림을 기반으로 구현되어있다. 앞서 설명한 것처럼 컨트롤러의 핸들러 메서드가 호출되는 스레드는 Netty 웹서버의 Worker 스레드이기 때문에 MVC와 다르게 핸들러 메서드에서 블록킹 API가 호출되거나 너무 많은 시간을 소모하도록 하는 경우 서버 전체에 영향을 끼칠 수 있다.

Personal 서버의 핸들러 메서드의 경우 ReactiveRepository, AdsvcClient, Kafaka (Handler) 에서 리액티브 스트림과 NIO 또는 스레드 풀을 사용한 비동기 구현을 통해 핸들러 메서드가 블록킹되지 않도록 지원하고 있다.

## AdsvcClient
Adaccount, Group을 구독하고, 광고의 상태가 변화 했을때 변화한 정보를 Personal에서 가공하여 알람을 보내기위해 Adsvc에 접근해야한다. Personal에선 다른 서버의 접근을 위해 RestTemplate 대신 WebClient를 사용한다. WebClient는 논블록을 지원하며 스프링 5.0부터 추가되었다. NIO를 사용하기 때문에 WebClient의 API가 사용하는 스레드는 nio 스레드를 사용하여 동작한다.

현재는 subscribOn() 메서드를 사용하여 동작할 스레드를 지정하고 있지만 추후에 삭제해도 논블록으로 잘 동작한다.

```java
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

Personal에서 사용하는 MySQL, JPA는 아직 NIO 접근을 지원하지 않는다. 때문에 JPA를 그냥 사용하는 경우 메서드를 호출할 때마다 블록킹 API가 호출되어 문제가 될 수 있다. ReactiveJpaRepository 클래스는 JpaRepository와 스프링에서 비동기 리포지토리 표준으로 사용되는 ReactiveCrudRepository 를 상속받아 JPA를 비동기에서 사용할 수 있도록 하였다.

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

다른 점이라면 카프카 메세지를 처리할 때 리액티브 스트림을 사용한다는 점이다. 카프카가 알림을 보내기 위해 사용되는데, 이때 앞서 언급한 ReactiveJpaRepository를 상속받는 NotiRepository를 사용하여 노티 데이터에 접근한다. 이때 구현이 블록킹이 아닌 리액터 스트림을 사용하기 때문에 이를 사용하여 비동기로 동작한다.

현재는 Ack 문제로 인해 `block()` 메서드를 사용하여 리액터 스트림이 동기로 동작하도록 되어있다. 추후에 reactor-kafka 리뷰할 예정

## Handler
핸들러는 카프카로 전달받은 노티 메세지 혹은 노티 DB에 저장된 노티 데이터를 사용하여 적절한 작업을 수행한다.
