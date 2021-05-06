기존 Spring Zuul 기반의 게이트 웨이를 Spring Cloud Gateway로 변경하는 작업중에 api 호출을 할 때, 다음과 같은 에러가 발생했다.

```terminal
java.net.UnknownHostException: line-ad-service-beta: nodename nor servname provided, or not known
    at java.base/java.net.Inet6AddressImpl.lookupAllHostAddr(Native Method)
    Suppressed: reactor.core.publisher.FluxOnAssembly$OnAssemblyException: 
Error has been observed at the following site(s):
    |_ checkpoint ⇢ Request to POST http://line-ad-service-beta/authenticate [DefaultWebClient]
    |_ checkpoint ⇢ org.springframework.security.web.server.authentication.AuthenticationWebFilter [DefaultWebFilterChain]
    |_ checkpoint ⇢ org.springframework.security.web.server.context.ReactorContextWebFilter [DefaultWebFilterChain]
    |_ checkpoint ⇢ org.springframework.security.web.server.header.HttpHeaderWriterWebFilter [DefaultWebFilterChain]
    |_ checkpoint ⇢ org.springframework.security.config.web.server.ServerHttpSecurity$ServerWebExchangeReactorContextWebFilter [DefaultWebFilterChain]
    |_ checkpoint ⇢ org.springframework.security.web.server.WebFilterChainProxy [DefaultWebFilterChain]
    |_ checkpoint ⇢ com.linecorp.lad.manager.webgw.filter.web.RequestBodyCacheFilter [DefaultWebFilterChain]
    |_ checkpoint ⇢ com.linecorp.lad.manager.webgw.filter.web.RequestContextWebFilter [DefaultWebFilterChain]
    |_ checkpoint ⇢ org.springframework.cloud.sleuth.instrument.web.TraceWebFilter [DefaultWebFilterChain]
    |_ checkpoint ⇢ HTTP GET "/!@#$%" [ExceptionHandlingWebHandler]
Stack trace:
    at java.base/java.net.Inet6AddressImpl.lookupAllHostAddr(Native Method)
    at java.base/java.net.InetAddress$PlatformNameService.lookupAllHostAddr(InetAddress.java:932)
```

기존 Zuul 게이트웨이가 Ribbon을 통해 각 서비스들을 discover 했기 때문에 단순히 WebClient 설정 만으로는 서비스 아이디를 통해 호스트 주소를 알 지 못해 서비스 아이디인 'line-ad-service-beta'가 호스트 주소로 변경되지 않고 그대로 api로 호출된 것이었다.

```java
@Configuration
public class WebClientConfig {
    ...
    @Bean
    public WebClient adsvcWebClient(WebClientFactory webClientFactory) {
        return webClientFactory.createWebClient("http://" + msaProperties.getMainService().getServiceId())
                               .mutate()
                               .build();
    }
    ...
```

위와 같이 `WebClientFactory`를 사용하여 `WebClient` 를 생성할 때 `filter()` 메서드를 통해서 클라이언트 로드 밸런서를 등록할 수 있다. 정확하게는 `ExchangeFilterFunction`을 등록하는 것이지만, 해당 인터페이스를 상속받는 로드 밸런서 구현체가 존재한다.

WebFlux로 작성된 노티 프로젝트의 경우 클라이언트 로드 밸런서를 `LoadBalancerExchangeFilterFunction` 으로 사용하고 있었는데, 해당 클래스는 deprecate 되었고, Spring Boot 2.2.0 버전부터 `ReactorLoadBalancerExchangeFilterFunction`가 추가되면서 대체 되었다.

# 기존 LoadBalancerExchangeFilterFunction

해당 `ExchangeFilterFunction`을 생성하기 위해선 `LoadBalancerClient`를 생성자의 파라메터로 전달해야한다. 파라메터로 전달한 로드밸런서 클라이언트는 리퀘스트에서 얻어낸 service id(호스트 주소, config에서 설정한 base url)를 통해 `ServiceInstance`를 반환하여 해당 인스턴스를 통해서 URI를 재구성한다.

# 2.2.0 이후의 ReactorLoadBalancerExchangeFilterFunction

새롭게 추가된 클래스의 경우 기존에 사용하던 `LoadBalancerClient`가 아닌 `ReactiveLoadBalancer.Factory<ServiceInstance>`(이하 로드밸런서 팩토리)를 사용하도록 되어있다. 해당 팩토리 클래스는 service id를 파라메터로 받고 `ReactiveLoadBalancer`를 반환하는 `getInstance()` 메서드가 존재하는데, 아마도 service id에 따라서 여러 로드 밸런서를 사용할 수 있게 확장성을 주고 싶었던 것 같다.

```java
public interface ReactiveLoadBalancer<T> {
    ...
	@FunctionalInterface
	interface Factory<T> {
		ReactiveLoadBalancer<T> getInstance(String serviceId);
	}
    ...
}
```

실제로 Spring Cloud에서 구현하고 있는 로드밸런서는 `ReactorLoadBalancerExchangeFilterFunction`과 `LoadBalancerClientFactory`가 있다. 두 클래스 모두 별다른 설정을 하지 않는다면 기본 스프링 설정 클래스에 의해서 빈으로 등록되는데, 로드밸런서 팩토리를 구현하는 `LoadBalancerClientFactory`의 경우 `NamedContextFactory`를 상속받아, 서비스 아이디를 통해 로드 밸런서를 반환한다.

## NamedContextFactory

해당 팩토리는 `AnnotationConfigApplicationContext`를 통해서 `BeanFactoryUtil`을 통해 적절한 로드밸런서를 반환한다.


로드밸런서 팩토리가 빈으로 등록될 때, `@LoadBalancerClients` 혹은 `@LoadBalancerClient` 어노테이션이 붇은 로드밸런서 클라이언트에 대한 설정 클래스를 로드한다. 두 어노테이션에 `LoadBalancerClientConfigurationRegistrar`가 임포트 되어있기 때문인데, `@LoadBalancerClients` 붙은 클래스 중 value 혹은 defaultConfiguration 프로퍼티나 `@LoadBalancerClient` 어노테이션에 configuration 프로퍼티에 설정된 로드밸런서 클라이언트를 담고있는 `LoadBalancerClientSpecification`을 생성하고 생성된 인스턴스는 로드 밸런서 팩토리에 전달된다.

```java
@Configuration
public class LoadBalancerAutoConfiguration {

	private final ObjectProvider<List<LoadBalancerClientSpecification>> configurations;

	public LoadBalancerAutoConfiguration(
			ObjectProvider<List<LoadBalancerClientSpecification>> configurations) {
		this.configurations = configurations;
	}

	@Bean
	public LoadBalancerClientFactory loadBalancerClientFactory() {
		LoadBalancerClientFactory clientFactory = new LoadBalancerClientFactory();
		clientFactory.setConfigurations(
				this.configurations.getIfAvailable(Collections::emptyList));
		return clientFactory;
	}
}
```

설정 스펙들은 로드밸런서 팩토리에서 `getInstance()` 가 호출될 때, 해당 스펙 인스턴스에서 서비스 아이디 문자열을 갖는 로드 밸런서를 먼저 찾고, 없는 경우 defaultConfiguration 프로퍼티로 등록된 "default"로 시작하는 로드밸런서 설정 클래스를 탐색하여 로드밸런서를 사용한다.

# Ribbon을 사용하는 SCG에서 리액터 로드 밸런서 사용할때 주의점

`ReactorLoadBalancerExchangeFilterFunction`를 사용하기 위해선 리본 로드밸런서 클라이언트를 빈으로 등록하지 않고 있어야하는 조건이 설정 클래스인 `ReactorLoadBalancerExchangeFilterFunctionConfig`에 `@Conditional(OnNoRibbonDefaultCondition.class)` 어노테이션으로 걸려있기 때문에 설정 파일에서 Ribbon 로드밸런서 옵션을 꺼야한다. MVC 에서 사용하는 `RibbonLoadBalancerClient`을 사용하지 않게 하기 위해서 인것 같음.

```yml
spring:
  cloud:
    loadbalancer:
      ribbon:
        enabled: false
```
