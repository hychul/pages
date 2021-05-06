게이트 웨이 인증을 위해서 IDP<sup>Identity Provider</sup>에서 제공한 session id를 가지고 프로젝트의 서비스에 User 정보를 가져오려고 api를 호출할 때 다음과 같은 에러가 발생했다.

```terminal
java.lang.IllegalArgumentException: URI is not absolute: /authenticate
    at org.springframework.http.client.reactive.ReactorClientHttpConnector.connect(ReactorClientHttpConnector.java:104)
    Suppressed: reactor.core.publisher.FluxOnAssembly$OnAssemblyException: 
Error has been observed at the following site(s):
    |_ checkpoint ⇢ Request to POST /authenticate [DefaultWebClient]
    |_ checkpoint ⇢ org.springframework.security.web.server.authentication.AuthenticationWebFilter [DefaultWebFilterChain]
    |_ checkpoint ⇢ org.springframework.security.web.server.context.ReactorContextWebFilter [DefaultWebFilterChain]
    |_ checkpoint ⇢ org.springframework.security.web.server.header.HttpHeaderWriterWebFilter [DefaultWebFilterChain]
    |_ checkpoint ⇢ org.springframework.security.config.web.server.ServerHttpSecurity$ServerWebExchangeReactorContextWebFilter [DefaultWebFilterChain]
    |_ checkpoint ⇢ org.springframework.security.web.server.WebFilterChainProxy [DefaultWebFilterChain]
    |_ checkpoint ⇢ com.linecorp.admanager.webgateway.filter.web.RequestBodyCacheFilter [DefaultWebFilterChain]
    |_ checkpoint ⇢ com.linecorp.admanager.webgateway.filter.web.RequestContextWebFilter [DefaultWebFilterChain]
    |_ checkpoint ⇢ org.springframework.cloud.sleuth.instrument.web.TraceWebFilter [DefaultWebFilterChain]
    |_ checkpoint ⇢ HTTP GET "/!@#$%" [ExceptionHandlingWebHandler]
Stack trace:
    at org.springframework.http.client.reactive.ReactorClientHttpConnector.connect(ReactorClientHttpConnector.java:104)
    ...
```

해당 에러 후에 retry에서 DiscoveryClient와 관련해서 에러가 추가로 발생하길래 Eureka 이슈인줄 알았는데 해당 이슈는 로컬 phase 옵션을 잘못 준 것이었고 찾아보니 실제로 요청한 url이 '/authenicate' 만 적용이 되어서 요청이 되었었다. base url 설정을 WebClient 컨피그 파일에서 지정하고 있었기 때문에 이상하다고 생각했다.

```java
@Configuration
public class WebClientConfig {
    ...
    @Bean
    public WebClient adsvcWebClient(WebClientFactory webClientFactory) {
        // base url을 property를 통해 지정
        return webClientFactory.createWebClient("http://" + msaProperties.getMainService().getServiceId())
                               .mutate()
                               .build();
    }
    ...
```

확인해보니 WebClient를 통해서 api 호출을 할 때, URI 오브젝트를 파라메터로 전달하여 요청하는 경우 base url을 오버라이딩 하는 이슈가 있었다.

```java
public Mono<User> authenticate(String sessionId) {
    Authentication authentication = new Authentication().setSessionId(sessionId);

    UriComponents uriComponent = UriComponentsBuilder
            .fromUriString(AUTHENTICATION)
            .build();

    return webClient
            .post()
            .uri(uriComponent.toUri()) // 해당 부분 때문에 base url이 override 되었음
            .body(BodyInserters.fromValue(authentication))
            .retrieve()
            .bodyToMono(User.class);
}
```

`uriComponent.toUri()`를 `uriComponent.toUriString()`으로 변경하여 String 파라메터로 넘겨주거나, `uriComponent.uri(uriBuilder -> uriBuilder.pathSegment(pathSegments...))` 를 사용하여 '/' 로 구분되는 패스의 세그먼트를 일일히 전달하여 해결할 수 있다.