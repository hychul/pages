![spring-version](https://img.shields.io/badge/Spring_Boot-2.2.4-green.svg?style=flat-square)  

Zuul 게이트웨이를 SCG<sup>Spring Cloud Gateway</sup>로 변경하는 작업을 진행중인데, 기존에 톰캣 설정이 되어있는 부분 중 context path 설정이 되어있는 부분이 있어 이를 Webflux에서 동일하게 설정해줘야 했다.

> Context Path
> WAS<sup>Web Application Server</sup>에서 웹어플리케이션을 구분하기 위한 path.
> 한 WAS 내에서의 구분 뿐만 아니라 웹 어플리케이션의 배포 phase 등을 별도로 지정하여 활용할 수도 있다.

# 톰캣의 context path 설정
<!-- https://sambalim.tistory.com/76 -->
/conf폴더 내의 server.xml파일에서 <Host>내의 <Context>에서 파일경로의 변경이 가능하다.

```xml
<Host name="localhost" appBase="webapps" unpackWARs="true" autoDeploy="true">
    ...
    <Context path="/" docBase="firstDoc.war" reloadable="true" />
    <Context path="/hello" docBase="secondDoc.jsp" reloadable="true" />
</Host>
```

위와같이 설정한 경우 `http://localhost/test`는 `firstDoc.war/test`에 접근한다. 각 컨텍스트의 루트 경로를 지정한다고 이해하면 쉽다.

# Spring Boot MVC에서의 context path 설정
<!-- https://www.baeldung.com/spring-boot-context-path -->
기본적으로 Spring Boot에서 '/'를 기본 context path로 사용하지만 변경을 원할 경우 다른 config 옵션과 마찬가지로 property를 통해서 context path를 설정할 수 있다.

톰캣과 달리 스프링 자체가 파일(웹 어플리케이션)이기 때문에 path에 대한 설정만 하면 된다.

**Spring Boot 1.X**
- `server.context-path`

**Spring Boot 2.X**
- `server.servlet.context-path`

**java config를 사용한 방법**
```java
@Bean
public WebServerFactoryCustomizer<ConfigurableServletWebServerFactory> webServerFactoryCustomizer() {
    return factory -> factory.setContextPath("/simplify");
}
```

> **설정의 우선순위**
> 1. Java Config
> 2. Command Line Arguments
> 3. Java System Properties
> 4. OS Environment Variables
> 5. application.properties in Current Directory
> 6. application.properties in the classpath (src/main/resources or the packaged jar file)

# Webflux에서의 context path 설정
webflux는 서블릿을 기반으로 동작하지 않는다. 실제로 MVC의 서블릿 컨테이너의 역할을 하는 부분이 WebServer라는 이름으로 Spring에서 사용된다.

요청마다 서블릿 컨테이너에서 서블릿(웹어플리케이션)을 찾아 스레드를 할당하는 MVC와 다르게, Webflux에선 서블릿 없이 NettyWebServer 등을 사용하기 때문에 서블릿 컨텍스트에서 설정하는 context path를 대체하기 위해 필터를 활용해야한다.



```java
@RequiredArgsConstructor
@Component
public class ContextPathWebFilter implements WebFilter {

    private final ServerProperties serverProperties;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        final String contextPath = Optional.ofNullable(serverProperties.getServlet().getContextPath()).orElse("/");

        ServerHttpRequest request = exchange.getRequest();
        if (request.getURI().getPath().startsWith(contextPath)) {
            return chain.filter(
                    exchange.mutate()
                            .request(request.mutate().contextPath(contextPath).build())
                            .build());
        }
        
        exchange.getResponse().setStatusCode(HttpStatus.NOT_FOUND);
        return exchange.getResponse().setComplete();
    }
}
```

시큐리티 설정이 없는 프로젝트라면 위의 설정만으로 가능하지만, 시큐리티가 있는 프로젝트에서 헬스 체크 등의 api를 사용하는 경우라면 필터 순서를 조정해야한다. 
시큐리티의 필터 오더가 -100(`WebFluxSecurityConfiguration.WEB_FILTER_CHAIN_FILTER_ORDER`)이고 기본 필터 오더가 0이기 때문에 시큐리티에서 요청이 먼저 필터링될 수 있다. 어차피 서블릿 컨테이너에서 서블릿이 동작하기 전에 수행하던 작업이므로 `Integer.MIN_VALUE`를 사용하면 될 것 같다.

request의 context path를 지정한 경우 해당 request의 path는 항상 context path로 시작 되어야 하기 때문에 게이트웨이에서 라우트를 위해 context path를 path에서 지워야 한다면 `RouteLocator` 설정에서 `RewritePathGatewayFilterFactory`를 사용하는 것이 좋다.