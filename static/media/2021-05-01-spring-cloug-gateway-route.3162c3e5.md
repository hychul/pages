회사에서 Zuul을 기반으로 작성되어 있는 게이트웨이를 SCG<sup>Spring Cloud Gateway</sup>로 변경하는 작업을 하고 있다. 이번 글에선 SCG의 라우트가 어떻게 동작하는지 알아보도록 한다.

> 기존에도 Reactor를 기반으로 동작하는 Spring Webflux로 노티 서비스를 만들어 보았지만, RDBMS를 위한 R2DBC의 정식 버전을 기대하고 구축했다가 아직도 1.0 버전이 나오지 않은 것을 한탄하며 RDBMS를 사용하지 않는 서비스에 NIO + 비동기를 사용하는게 좋을 것 같다고 생각을 했는데 다행히 해당 조건에 맞아 떨어지는 게이트웨이를 전환하는 작업을 맡게 되었다.

# SCG의 라우팅
기본적인 라우트는 특정 조건에 맞는 특정 요청이 게이트웨이에 들어왔을 때, 해당 요청을 특정한 주소로 변환하여 요청의 경로를 변환(Route)하는 것을 의미한다.

SCG에서 미리 설정한 조건들을 `PredicateSpec`을 통해서 생성하고, 해당 조건을 통해서 특정 요청을 특정한 후 필터들을 통해 주소를 변경하는 등, 요청을 수정하는 작업을 통해서 요청을 원하는 서비스로 라우트 시킨다.

<!-- 그림 -->
<!-- 요청 -> Predicates -> Filter -> 변경된 요청 -->

위의 과정을 위해 SCG에선 어플리케이션이 로드되거나 스프링에서 `RefreshRoutesEvent`가 발생할때, 라우팅 정보를 담고 있는 `Route`를 생성 및 업데이트한다. 이후 요청이 게이트웨이로 들어왔을 때 해당 요청의 조건에 해당하는 `Route` 를 찾아 해당 필터에 설정된 `GatewayFilter`와 모든 요청에 대해 설정된 `GlobalFilter`를 거치며 요청을 수정하는 과정을 통해 요청이 라우팅되게 된다.

# 라우팅의 설정
라우팅 설정은 설정 파일이나 직접 빈을 등록하여 설정할 수 있다. 두가지 방법 모두 결과 적으론 `RouteLocator`를 통해서 `Route`가 생성된다.

## 빈 등록을 통한 라우팅 설정
앞서 설명한 것과 같이 `Route`를 생성하여 요청을 라우팅하기 위해선 `RouteLocator`가 필요한데, 빈 등록을 통한 라우팅 설정에선 직접 `RouteLocator`를 빈으로 등록하면 된다.

```java
@SpringBootApplication
public class DemogatewayApplication {
    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
            .route("path_route", 
                   r -> r.path("/get")
                         .uri("http://httpbin.org"))
            .route("host_route", 
                   r -> r.host("*.myhost.org")
                         .uri("http://httpbin.org"))
            .route("rewrite_route", 
                   r -> r.host("*.rewrite.org")
                         .filters(f -> f.rewritePath("/foo/(?<segment>.*)", "/${segment}"))
                   .uri("http://httpbin.org"))
            .route("hystrix_route", 
                   r -> r.host("*.hystrix.org")
                         .filters(f -> f.hystrix(c -> c.setName("slowcmd")))
                         .uri("http://httpbin.org"))
            .route("hystrix_fallback_route", 
                   r -> r.host("*.hystrixfallback.org")
                         .filters(f -> f.hystrix(c -> c.setName("slowcmd")
                                                       .setFallbackUri("forward:/hystrixfallback")))
                         .uri("http://httpbin.org"))
            .route("limit_route", 
                   r -> r.host("*.limited.org").and().path("/anything/**")
                         .filters(f -> f.requestRateLimiter(c -> c.setRateLimiter(redisRateLimiter())))
                         .uri("http://httpbin.org"))
            .build();
    }
}
```

위의 코드에서 확인할 수 있듯이 path, host 등을 통해 라우팅할 요청을 특정하여 `Predicate<ServerWebExchange>`를 생성하고 `filters(f -> ...)` 메서드를 통해 설정한 필터들은 `GatewayFilter`로 생성된다. 해당 조건과 필터 그리고 변경될 호스트 uri는 `Route`가 생성될 때 전달된다.

## 설정 파일을 통한 라우팅 설정
설정 파일을 통해서 라우팅 설정을 하는 경우엔 바로 `RouteLocator`를 생성할 수 없기 때문에 설정 파일을 통해 `RouteDefinition`이라는 오브젝트를 생성한다. `GatewayProperties.routes`를 보면 `RouteDefinition`을 설정하도록 되어있는 것을 확인 할 수 있다.

설정 파일로 등록된 `RouteDefinition`은 `PropertiesRouteDefinitionLocator`에 전달되고, 해당 `DefinitionLocator`가 `RouteDefinitionRouteLocator` 라는 이름만 봐도 `RouteLocator`를 상속받은 빈에 주입되어 `Route`를 생성한다.

## DiscoveryClient를 통한 라우팅 설정
위의 두가지 방법은 모두 설정 파일이든 빈이든 직접 개발자가 라우팅 정보를 등록하는 방식이지만, 해당 방법 말고도 연결된 서비스들에 대해서 `Route`가 자동으로 생성될 수 있게 할 수 있다.

`spring.cloud.gateway.discovery.locator.enabled=true` 로 설정 파일에 설정을 한 경우 `DiscoveryClientRouteDefinitionLocator`가 빈으로 등록된다. Netflix Eureka, Consul 또는 Zookeeper 와 같은 `DiscoveryClient`가 등록되어 있는 경우 해당 클라이언트를 주입받아, 찾아낸 서비스들에 대한 `Route`가 생성된다.

```java
@Configuration(proxyBeanMethods = false)
@ConditionalOnProperty(value = "spring.cloud.discovery.reactive.enabled", matchIfMissing = true)
public static class ReactiveDiscoveryClientRouteDefinitionLocatorConfiguration {

    @Bean
    @ConditionalOnProperty(name = "spring.cloud.gateway.discovery.locator.enabled")
    public DiscoveryClientRouteDefinitionLocator discoveryClientRouteDefinitionLocator(
        ReactiveDiscoveryClient discoveryClient,
        DiscoveryLocatorProperties properties) {
      return new DiscoveryClientRouteDefinitionLocator(discoveryClient, properties);
    }
}
```

# 라우팅의 필터
생성된 `Route`가 어떤 과정으로 사용되는지 보기전에 라우팅에서 사용되는 필터에 대해서 먼저 확인 할 필요가 있다. 

Zuul의 경우 `shouldFilter()`와 같은 메서드를 오버라이딩 하여 특정 요청에서 `ZuulFilter`가 동작하도록 설정 할 수 있지만, 앞서 SCG에서 필터를 설정한 것을 보면 `RouteLocator`마다 필터를 설정하는 것을 확인 할 수 있다. 특정 요청에서 동작할 필터를 등록하는 것이지만, 스프링의 AOP를 생각하면 일일이 모든 라우팅에 대해서 필터를 설정하는 것은 매우 비효율적인 방식이다. 때문에 SCG에선 각 요청마다 동작할 `GatewayFilter`와 함께 `GlobalFilter` 라는 것을 제공한다.

## GatewayFilter
먼저 게이트웨이 필터의 경우 `GatewayFilterFactory`를 통해서 생성된다. 아마도 위에서 본것과 같이 설정 파일을 통해서 필터도 설정이 가능하게 하기 위해서 설정 파일을 읽어서 필터를 설정할 수 있게 하기 위해 해당 클래스를 통해서 설정되록 한 것같다. `RouteDefinition`을 통해서 라우팅 설정을 하게 한 것과 비슷하게 말이다.

때문에 새로운 게이트웨이 필터를 생성하는 경우 별다른 설정이 필요하지 않더라도 Config에 대한 클래스를 생성해야하는 번거로움이 있다.

```java
@FunctionalInterface
public interface GatewayFilterFactory<C> extends ShortcutConfigurable, Configurable<C> {
  ...
	GatewayFilter apply(C config);
  ...
```

## GlobalFilter
글로벌 필터의 경우 일반적으로 스프링에서 생각하는 필터와 그 모양이나 동작이 유사하다. 다른 점은 스프링의 필터의 경우 Dispatcher 이전에 동작하지만 게이트웨이의 글로벌 필터의 경우 Dispatcher에서 선택된 핸들러에 의해 동작하기 때문에 Dispatcher 이후에 동작하게 된다.

## 필터 순서

두 필터 모두 라우팅을 담당하는 핸들러인 `FilteringWebHandler` 에서 순서에 따라 재배치 된 후 `DefaultGatewayFilterChain`을 통해 필터 체이닝 된다.

<!-- 
FilterFactory
GlobalFilter
 -->


<!--
 > ### RouteDefinitionLocator
> 기본적으로 PropertiesRouteDefinitionLocator 와 InMemoryRouteDefinitionRepository
> ↓
> ### RouteDefinition
> DiscoveryClientRouteDefinitionLocator 에서 생성한다.
> DiscoveryClient를 통해서 실제 해당 서비스의 url을 사용한 RouteDefinition을 생성한다.
> 생성된 RouteDefinition은 RouteDefinitionLocator를 사용하는 RouteLocator를 통해서 Route로 변환되어 사용된다. 
> ↓
> ### RouteLocator
> RouteLocator를 반환한다.
> ↓
> ### Route
> RouteLocator를 통해 생성되며, 아이디, predicate, url(target), 필터 등이 존재한다. 
-->


# 라우팅의 동작
<!-- DispatcherHander -> handlerMapping (RoutePredicateHandlerMapping) -> RouteLocator -> Route -> FilteringWebHandler -> GatewayFilter -> GlobalFilter -->
이제 설정된 라우팅이 요청이 들어왔을 때 어떻게 동작하는지 살펴보자.

먼저 요청이 게이트웨이에 들어온 경우 `DispatcherHandler.handle()` 메서드를 통해 요청을 처리할 핸들러를 찾는다. 라우팅 설정에서 등록한 라우트 중 조건에 맞는 `Route`가 존재하는 경우, `RoutePredicateHandlerMapping`을 통해서 해당 `Route`를 `ServerWebExchangeUtils.GATEWAY_ROUTE_ATTR` 어트리뷰트에 저장한 후, `FilteringWebHandler` 핸들러로 반환한다.

반환된 `FilteringWebHandler`의 `handle()` 메서드가 호출될 때, `GATEWAY_ROUTE_ATTR`를 통해 `Route`를 어트리뷰트에서 꺼내어 게이트웨이 필터와 글로벌 필터를 가져와 순서에 맞게 재배치 한 후 필터 체인이 동작하게 한다.

여기까진 라우팅과 관련된 로직은 없고 설정된 라우트를 가지고 필터체인을 동작시키는 것을 볼 수 있는데, 예상 할 수 있듯이 실제적인 라우팅 관련 작업은 필터를 통해서 이뤄진다.
<!-- 
# DispatcherHandler.handle()  
handlerMappings 에서 exchange를 파라메터로 getHander() 메서드를 호출함

handlerMAppings에서 기본적인 controller나 router function 들에 대한 핸들러도  
-->

## 라우트 필터의 동작
라우트를 설정 할 때 uri에 'http-' 혹은 'https-'로 시작하는 일반적인 호스트 뿐만 아니라 다양한 스키마<sup>Scheme</sup>를 등록할 수 있는데 여기서는 'lb' 스키마를 사용하여 로드밸런서를 사용하여 라우팅되는 것을 예시로 라우트 필터의 동작을 확인한다.

```java
    @Bean
    public RouteLocator adserviceRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                      .route("test",
                             route -> route.path("/test/**")
                                           .uri("lb://test") // 'lb://serviceId' 포맷
                      )
                .build();
    }
```

### 글로벌 필터 등록 순서
먼저 기본적으로 등록되는 글로벌 필터들을 살펴보면 다음과 같다.

```
`RemomveCachedBodyFilter` : -2147483648
`AdaptCachedBodyGlobalFilter` : -2147483648
`NettyWriteResponseFilter` : -1
`ForwardPathFilter` : 0
*`RouteToRequestUrlFilter` : 10000
*`ReactiveLoadBalancerClientFilter` : 10150
`WebsocketRoutingFilter` : 2147483646
*`NettyRoutingFilter` : 2147483647
`ForwardRoutingFilter` : 2147483647
```

앞서 설명한 것과 같이 필터들은 순서<sup>Order</sup>에 의해 체이닝 되어 동작한다. 이중 로드 밸런스를 사용한 라우팅에서 사용되는 필터에는 이름 앞에 '*'로 표시를 해두었다.

### RouteToRequestUrlFilter
앞서 `RoutePredicateHandlerMapping`에서 추가했던 `ServerWebExchangeUtils.GATEWAY_ROUTE_ATTR` 에 `Route` 오브젝트가 존재하면, 필터에서 리퀘스트의 URI 를 기반으로 `Route` 오브젝트를 통해 새로운 URI를 생성하여 `ServerWebExchangeUtils.GATEWAY_REQUEST_URL_ATTR` 에 저장한다.

`Route`의 URI에 스키마가 존재한다면(여기선 'lb'), URI에서 이를 삭제하고 `ServerWebExchangeUtils.GATEWAY_SCHEME_PREFIX_ATTR` 에 이를 저장하여 다른 필터에서 사용할 수 있게 한다.
<!-- https://cloud.spring.io/spring-cloud-gateway/reference/html/#the-routetorequesturl-filter -->

### ReactiveLoadBalancerClientFilter
`RouteToRequestUrlFilter` 에서 저장된 새로운 URI에 대한 어트리뷰트인, `ServerWebExchangeUtils.GATEWAY_REQUEST_URL_ATTR`의 scheme이 'lb' 이거나, `ServerWebExchangeUtils.GATEWAY_SCHEME_PREFIX_ATTR`이 'lb'인 경우 `ReactorLoadBalancer`를 통해 서비스에 맞는 실제 호스트와 포트를 찾아 `ServerWebExchangeUtils.GATEWAY_REQUEST_URL_ATTR` 어트리뷰트에 URI를 업데이트한다. 그리고 수정되지 않은 원본 URL은 `GATEWAY_ORIGINAL_REQUEST_URL_ATTR`에 저장된디.

### NettyRoutingFilter
`ServerWebExchangeUtils.GATEWAY_REQUEST_URL_ATTR` 에 저장된 리퀘스트 uri를 가져와 스키마가 요청 가능한 'http' 혹은 'https'인지 확인 한 후, 요청이 처리 가능하다면 처리하데 된다.

</br>
<!-- 
GatewayDiscoveryClientAutoConfiguration  
ReactiveDiscoveryClientRouteDefinitionLocatorConfiguration  
discoveryClientRouteDefinitionLocator()


SCG 에서 디스커버리 클라이언트는 기본적으로 활성화 상태이지만, 디스커버리 클라이언트를 사용하는 `RouteDefinitionLocator`는 기본적으로 빈으로 등록되지 않기 때문에 다음의 프로퍼티를 사용하여 빈을 등록해야한다. 


> 디스커버리 클라이언트를 사용하는 라우트 로케이터를 등록하는 빈은 리액티브와 블록킹 두가지로 나눠지지만, 블록킹 빈의 경우 빈을 등록하는 메서드에서 사용하는 생성자가 `@Deprecated` 어노테이션이 달려있기 때문에 잘 확인하고 사용하는게 좋을 것 같다.

```yml
spring:
  cloud:
    gateway:
      discovery:
        locator:
          enabled: true
          lower-case-service-id: true
```

`DiscoveryLocatorProperties` 에 `urlExpression` 멤버변수를 보면 "'lb://'+serviceId" 형태로 기본 정의가 되어있는 것을 볼 수 있다.

```java
@ConfigurationProperties("spring.cloud.gateway.discovery.locator")
public class DiscoveryLocatorProperties {
    ...
    private String urlExpression = "'lb://'+serviceId";
    ...
``` 

해당 설정을 하지 않고 DiscoveryClientRouteDefinitionLocator를 등록하지 않아도 서비스 이름으로 라우팅이 가능한데, 해당 DefinitionLocator는 eureka 등을 통한 DiscoveryClient 서비스 인스턴스를 찾아 라우트 데피니션을 추가하는 역할이기 때문에, 직접 RouteLocator를 빈으로 등록하고 서비스 이름을 명시적으로 추가된 서비스 인스턴스의 경우 해당 DefinitionLocator를 통해서 과정을 거쳐 최종적으로 RouteLocator를 등록한 것과 같이 동작하기 때문에 동일하게 동작한다.

다만 해당 DefinitionLocator를 사용하는 경우 연결된 모든 서비스에 대한 RouteDefinition, 즉 Route가 생성될 수 있으니 직접 RouteLocator를 직접 등록하여 사용하는게 보안적인 측면에서 더 나을 것 같다.

---

-->

<!-- 

# 라우팅 설정

프로퍼티 파일(yml 파일)만으로도 라우트 설정이 가능하다 (내가 제일 싫어하는거..)


프로퍼티로 라우트 설정하면 해당 프로퍼티를 읽어 게이트웨이의 라우트 설정(Route Definition)이 `PropertiesRouteDefinitionLocator`의 `convertToRoute()` 메서드를 통해 `Flux<Route>`로 변환된어 리액트 스트림 환경에서 사용된다.

## RouteDefinitionRouteLocator.getRoutes() 사용하는 곳

### AbstractGatewayControllerEndpoint
actuator 등을 통해 라우트 아이디에 해당하는 라우팅 정보를 가져올 수 있다.

### GatewayControllerEndpoint, GatewayLegacyControllerEndpoint
AbstractGatewayControllerEndpoint를 상속받아 Actuator를 프로젝트에 추가하면 “/routes” uri를 통해 설정된 라우팅 정보를 확인할 수 있다.

### WeightCalculatorWebFilter  
일정 시간마다 발생히나느 `RefreshRoutesEvent` 이벤트가 `onApplicationEvent()` 메서드를 통해서 감지되었을 때, routeLocator 에 대해서 리액터 `subscribe()` 메서드를 통해 `RouteDefinitionLocator` 등에서 RouteDefinition을 Route 오브젝트로 변환되도록 함  

아마도 캐싱 또는 라우터 동작 확인을 위해서 인듯

### RoutePredicateHandlerMapping.loookupRoute(ServerWebExcahnge exchange)  
`ServerWebExcahnge` 를 통해 요청 받은 uri에 대해서 predicate 값을 통해 라우팅 시킴

### CachingRouteLocator  
해당 인스턴스가 생성되거나 `RefreshRoutesEvent`를 받았을 때 fetch
기본적으로 생성되며, `CompositeRouteLocator`를 delegator 생성자 파라메터로 받아 생성된다.

### CompositeRouteLocator  
auto config에 의해 기본 cacheCompositeRouteLocator 빈으로 등록됨

## RouteDefinition  
yml 파일을 사용하여 라우팅에 대한 정보를 정의한다.   
- Predicate  
  리퀘스트가 게이트웨이에 전달되었을때, 이를 라우팅 하기 위한 조건을 명시한다.
- GatewayFilter  
  리퀘스트가 게이트웨이에 전달되어 predicated를 통해 조건을 만족할 때, 리퀘스트에 특정 설정을 추가할 수 있다.
- 웹소켓 라우팅 필터 

-->