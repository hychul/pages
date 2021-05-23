![spring-version](https://img.shields.io/badge/Spring_Boot-2.2.4-green.svg?style=flat-square)  

```terminal
X* TLSv1.2 (IN), TLS alert, close notify (256):
X* transfer closed with outstanding read data remaining
X* Closing connection 0
X* TLSv1.2 (OUT), TLS alert, close notify (256):
curl: (18) transfer closed with outstanding read data remaining
```
curl로 요청한 리퀘스트의 리스폰스에 다음과 같은 에러가 함께 전달되었다. 

FE 화면과 같이 호출된 api는 크롬에선 다음과 같이 표시된다.

![curl-transfer-closed-1](https://user-images.githubusercontent.com/18159012/117801284-1528e080-b28f-11eb-880a-cedb76a4b79c.png)

# 원인

해당 이슈의 일반적인 원인은 리스폰스 바디를 통해서 보내는 content length의 길이가 헤더의 content length보다 길어서 헤더만큼 읽었음 에도 바디가 끝나지 않아 문제가 되는 것이었다. 하지만 프로젝트에서 사용하는 transfer-encoding을 chunk로 사용하기 때문에 content-length를 제대로 설정하는 것으로 해결이 될 문제는 아니었다.

문제는 게이트웨이에서 헤더를 잘못 설정한 부분에서 발생했는데, GW -> Service로 요청을 라우팅하여 보낼때 헤더에 추가적으로 헤더를 더해 보내도록 하는 부분이 존재했다. 문제는 response의 헤더를 설정하는 부분이었다.

```java
@Override
public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
    ...
    exchange.getResponse().getHeaders().add("test-header", "!@#");
    ...
}
```

스프링에서 구현된 다른 리스폰스 헤더 설정도 위와같은 형태로 설정이 되고 있었기 때문에 별 생각없이 동이리하게 코드를 작성했지만, `AbstractServerHttpResponse` 에서 헤더의 상태가 COMMITED 상태인 경우, readonly로 설정되는 부분이 존재했다.

```java
public abstract class AbstractServerHttpResponse implements ServerHttpResponse {
    ...
    @Override
	public HttpHeaders getHeaders() {
		return (this.state.get() == State.COMMITTED ?
				HttpHeaders.readOnlyHttpHeaders(this.headers) : this.headers);
	}
    ...
```

해당 커밋이 이뤄진 후에 response를 수정하려고 하면 문제가 되었는데, gateway filter가 request를 서비스로 보낼때만 처리되는 줄 알았는데 서비스에서 처리된 후에 response를 받아 처리할 때에도 gateway filter가 다시 호출되어 한 요청당 필터가 두번 불려졌다.

![transfer-encoding-chunk-incompleted-1](https://user-images.githubusercontent.com/18159012/117935137-617f2980-b33e-11eb-94fc-3634c177278f.jpg)

때문에 response가 커밋 되어 readonly인 상황인지 `Response.isCommitted()` 메서드를 통해서 response의 상태를 확인할 수 있다.

```java
@Override
public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
    ...
    if (!exchange.getResponse().isCommitted()) {
        exchange.getResponse().getHeaders().add("test-header", "!@#");
    }
    ...
}
```

# 해결

<!-- https://www.baeldung.com/spring-cloud-custom-gateway-filters -->
위의 방법으로도 처리가 가능했지만, 해당 필터가 요청과 응답에 대해서 필터가 의도와 다르게 두번 동작하는 것이 궁금햇다. 확인한 결과 global filter의 동작이 서비스에 요청을 전달하기 전<sup>Pre</sup>의 로직과 후<sup>Post</sup>의 동작을 나눠서 처리하도록 되어있는데, 이는 `filter.chain()` 스트림의 동작을 기준으로 설정되어 있는 형태였다.

```java
@Override
public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
    logger.info("Global Pre Filter executed");
    return chain.filte(exchange)
                .then(Mono.fromRunnable(() -> {
                    logger.info("Global Post Filter executed");
                })
}
```

문제는 작성한 gateway filter가 리액터 스트림의 컨텍스트에 필요한 정보들을 넣고서 사용을 하려다 보니, pre, post 처리와 상관없이 리턴한 리액터 스트림의 동작이 두번씩 호출되도록 된 것이었다. 이 때문에 response 헤더를 설정하는 부분도 덩달아 두번 호출되었고, response가 commit된 이후에도 post 처리에서 헤더를 세팅하다 보니 문제가 발생했다.

```java
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        return ReactiveSecurityContextHolder
            .getContext()
            .map(context -> {
                ...
            }
            .flatMap(it -> chain.filter(it));
    }
```

해당 부분을 수정하기 위해 어트리뷰트를 사용하여 리액터 스트림이 처리가 되었는지 확인하도록 하여 서비스에 요청을 보내기 전과 후로 나눠 처리할 수 있도록 수정하였다.

```java
public abstract class ReactiveGlobalGatewayFilter implements GlobalFilter {

    public static final String REACTIVE_GLOBAL_FILTER_ATTR = "reactiveGlobalFilter";

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        return Mono.just(exchange)
                   .flatMap(it -> {
                       if (it.getAttribute(REACTIVE_GLOBAL_FILTER_ATTR) == null) {
                           it.getAttributes().put(REACTIVE_GLOBAL_FILTER_ATTR, true);
                           return preFilter(it);
                       } else {
                           return postFilter(it);
                       }
                   })
                   .flatMap(chain::filter);
    }

    public Mono<ServerWebExchange> preFilter(ServerWebExchange exchange) {
        // Global Pre Filter executed
        return Mono.just(exchange);
    }

    public Mono<ServerWebExchange> postFilter(ServerWebExchange exchange) {
        // Global Post Filter executed
        return Mono.just(exchange);
    }
}
```
