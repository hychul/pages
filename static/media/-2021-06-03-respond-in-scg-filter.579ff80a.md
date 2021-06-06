```java
@Component
@RequiredArgsConstructor
public class RespondingFilter implements WebFilter {

    private final FooService fooService;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        return fooService.getBody()
                         .flatMap(geoDmpMapData -> {
                             ServerHttpResponse response = exchange.getResponse();
                             response.setStatusCode(HttpStatus.OK);
                             response.getHeaders().set("X-INTERCEPTED", "true");

                             byte[] bytes = JsonDataUtils.toJson(geoDmpMapData).getByte(StandardCharsetsUTF_8);                             
                             DataBuffer buffer = response.bufferFactory().wrap(bytes);      

                             return response.writeWith(Mono.just(buffer));
                         });
    }
}
```
