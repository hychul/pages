`AdaptCachedBodyGlobalFilter`

```java
@Component
public class RequestBodyCacheWebFilter implements WebFilter {
    public static final String REQUEST_BODY_KEY = "CACHED_REQUEST_BODY_MAP_ATTR";

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        ServerRequest serverRequest = ServerRequest.create(exchange, HandlerStrategies.withDefaults().messageReaders());
        Mono<byte[]> monoBody = serverRequest.bodyToMono(new ParameterizedTypeReference<byte[]>() {})
                                                 .doOnNext(data -> {
                                                     Optional.ofNullable(JsonDataUtils.fromJson(data, new TypeReference<Map>() {}))
                                                             .ifPresent(it -> exchange.getAttributes().put(REQUEST_BODY_KEY, it));
                                                 });

        BodyInserter<Mono<byte[]>, ReactiveHttpOutputMessage> bodyInserter = BodyInserters.fromPublisher(monoBody, new ParameterizedTypeReference<byte[]>() {});
        HttpHeaders headers = new HttpHeaders();
        headers.putAll(exchange.getRequest().getHeaders());

        CachedBodyOutputMessage outputMessage = new CachedBodyOutputMessage(exchange, headers);
        return bodyInserter.insert(outputMessage, new BodyInserterContext())
                           .then(Mono.defer(() -> {
                               ServerHttpRequest decorator = decorate(exchange, outputMessage);
                               return chain.filter(exchange.mutate().request(decorator).build());
                           }));
    }

    ServerHttpRequestDecorator decorate(ServerWebExchange exchange, CachedBodyOutputMessage outputMessage) {
        return new ServerHttpRequestDecorator(exchange.getRequest()) {
            @Override
            public Flux<DataBuffer> getBody() {
                return outputMessage.getBody();
            }
        };
    }
}
```