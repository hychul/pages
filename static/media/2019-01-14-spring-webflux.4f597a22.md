# WebFlux 빈 설정
- WebFluxAutoConfiguration // @EnableWebFlux 어노테이션을 위한 auto-configuration을 설정하는 클래스
  - ...
    - WebFluxConfigurationSupport // @ConditionalOnMissingBean 어노테이션을 통해 WebFluxAutoConfiguration에서 같은 타입의 다른 빈이 등록되지 않았을 경우 디폴트 빈으로 사용되는 빈을 등록한다.
      - ...
      - HandlerMapping 관련 빈 설정
        - RouterFunctionMapping // 맵핑 오더 : -1
          - RouterFunction은 afterPropertiesSet 메서드 → initRouterFunctions() → routerFunctions()메서드를 통해 빈으로 등록된 RouterFunction을 가져와 맵핑한다.
        - RequestMappingHandlerMapping // 맵핑 오더 : 0
        - 리소스 맵핑을 위한 HandlerMapping // 맵핑 오더 : LOWEST_PRECEDENCE - 1
      - HandlerAdapter 관련 빈 설정
        - HandlerFunctionAdapter // RouterFunction에 사용되는 HandlerFunction을 위한 어댑터
        - RequestMappingHandlerAdapter // @RequestMapping 어노테이션을 사용하는 핸들러 메서드에 사용 (어노테이션 기반)
        - SimpleHandlerAdapter // 리소스 맵핑에 사용되는 핸들러 어댑터
      - HandlerResultHandler 관련 빈 설정
        - ServerResponseResultHandler // HandlerFunction 에서 사용하는 retuen 타입인 ServerResponse를 담당
        - ResponseBodyResultHandler // @ResponseBody 어노테이션을 사용하는 핸들러 메서드 리턴 값을 담당
        - ViewResolutionResultHandler // View 리소스 담당 (View Resolver)
      - DispatcherHandler로 WebHandler 빈 설정
        - DispatcherHandler의 컨스트럭터에서 HandlerMapping, handlerAdapter, HandlerResultHandler 빈들을 불러와 세팅한다.
- HttpHandlerAutoConfiguration // HttpHandler 를 위한 auto-configuration 클래스
  - AnnotationConfig // nested static class
    - WebHandler 빈과 WebFilter 빈을 받아 HttpHandler(HttpWebHandlerAdapter)를 빌드한다. d
      - 체인된 WebHandler를 만든다
      (체인순서 : HttpWebHandlerAdapter (request와 response를 exchange로 묶음) → ExcpetionalHandlingWebHandler → FilteringWebHandler → DispatcherHandler)

# SpringApplication 초기화
- static SpringApplication.run()
  - new SpringApplication()
    - 클래스 path를 통해 webApplicationType을 지정한다 (NONT, SERVLET, REACTIVE)
  - SpringApplication.run()
    - createApplicationContext() // webApplicationType이 REACTIVE로 AnnotationConfigReactiveWebServerApplicationContext로 지정
    - prepareContext()
    - refreshContext()
      - AnnotationConfigReactiveWebServerApplicationContext.refresh()
        - prepareRefresh()
        - ...
        - onRefresh()
          - createWebServer() // jetty, netty, tomcat, undertow 네가지 WebServer가 존재한다. 여기선 netty를 사용한다고 가정 : NettyWebServer
            - NettyReactiveWebServerFactory.getWebServer() // HttpHandler는 이를 상속받은 ServerManager 클래스
              - createHttpServer() // TCP 서버를 기반으로 설정값을 통해 ssl 등을 설정한다
              - new ReactorHttpHandlerAdapter(httpHandler) // HttpHandler는 이를 상속받은 ServerManager 클래스
              - new NettyWebServer(httpServer, handlerAdapter, lifecycleTimeout)
          - ServerManager.get(getWebServerFactory()) // ServerManager가 설정될 때 HttpHandler는 uninitialized 상태
        - ...
        - finishRefresh()
          - ...
          - startReactiveWebServer()
            - getHttpHandler()
              - 빈 팩토리에서 HttpHanlder를 받아온다 // HttpHandlerAutoConfiguration 클래스에 HttpHandler 빈이 applicationContext를 사용한 빈을 통해 생성되도록 등록되어 있다
                - WebHandler 빈(DispatcherHandler)과 WebFilter(?) 빈을 받아 HttpHandler(HttpWebHandlerAdapter)를 빌드한다. 
                  - 체인된 WebHandler를 만든다 (처리순서 : HttpWebHandlerAdapter (request와 response를 exchange로 묶음) → ExcpetionalHandlingWebHandler → FilteringWebHandler → DispatcherHandler)
            - ServerManager.start(httpHandler)
              - 핸들러 설정
              - NettyWebServer.start()
    - ...
  - ...

# WebFlux Request 처리
NettyWebServer.handle() → ServerManager.handle() → 체인된 HttpHandler들 생략 → DispatcherHandler.handle() 의 과정으로 HttpHandler에서 리퀘스트가 처리된다.

DispatcherHandler에 전달된 exchange(앞선 체인 핸들러에서 묶인 request와 response)가 HandlerMapping → HandlerAdapter → HandlerResultHanlder 를 거쳐 처리되어 response를 반환한다.

![spring-webflux-0](https://user-images.githubusercontent.com/18159012/116578105-09165800-a94c-11eb-9ca6-eb320be1abec.png)

HandlerMapping을 통해 RouterFunction, RequestMapping, 리소스 맵핑 중 하나가 선택되어 이에 해당하는 Adapter를 통해 핸들러가 request를 처리하고 처리 결과를 HandlerResultAdapter를 통해 클라이언트에게 response로 전달한다.

# Webflux SSE 처리
ServerSentEventHttpMessageWriter 클래스에서 write() 메서드를 HandlerResultAdapter 로 부터 호출받아 SSE에 대한 response를 작성한다. (SSE가 아닌 경우엔 EncoderHttpMessageWriter로 처리 된다 ServerResponse를 생성할 때 사용되는 Bodyinserter에서 정해진다)

```java
public class ServerSentEventHttpMessageWriter implements HttpMessageWriter<Object> {
    ...
    @Override
    public Mono<Void> write(Publisher<?> input, ResolvableType actualType, ResolvableType elementType,
        @Nullable MediaType mediaType, ServerHttpRequest request, ServerHttpResponse response,
        Map<String, Object> hints) {
 
        Map<String, Object> allHints = Hints.merge(hints,
        getEncodeHints(actualType, elementType, mediaType, request, response));
 
        return write(input, elementType, mediaType, response, allHints);
    }
    ...
    @Override
    public Mono<Void> write(Publisher<?> input, ResolvableType elementType, @Nullable MediaType mediaType,
        ReactiveHttpOutputMessage message, Map<String, Object> hints) {
         
        mediaType = (mediaType != null && mediaType.getCharset() != null ? mediaType : DEFAULT_MEDIA_TYPE);
        DataBufferFactory bufferFactory = message.bufferFactory();
         
        message.getHeaders().setContentType(mediaType);
        return message.writeAndFlushWith(encode(input, elementType, mediaType, bufferFactory, hints));
    }
}
```

ReactorClientHttpRequest 클래스에서 writeAndFlushWith() 메서드를 통해 netty outbound를 통해 Publisher 타입의 body를 ByteBufs로 변환하여 내보내는데, SSE의 경우 body가 onComplete 시그널을 발생하지 않고 계속 onNext 시그널을 통해 데이터를 전달하여 연결이 끊어지지 않고 클라이언트에게 이벤트를 전달할 수 있다.

```java
class ReactorClientHttpRequest extends AbstractClientHttpRequest implements ZeroCopyHttpOutputMessage {
    ...
    @Override
    public Mono<Void> writeAndFlushWith(Publisher<? extends Publisher<? extends DataBuffer>> body) {
        Publisher<Publisher<ByteBuf>> byteBufs = Flux.from(body).map(ReactorClientHttpRequest::toByteBufs);
        return doCommit(() -> this.outbound.sendGroups(byteBufs).then());
    }
    ...
}
```


# WebFlux WebSocket 처리
WebSocket의 경우 사용하기 위해선 WebSocketHandlerAdapter와 웹소켓을 위한 HandlerMapping을 빈으로 등록해야한다.

WebSocketHandlerAdapter에선 web socket 연결로 업그레이드(핸드쉐이크)를 위해 HandShakeWebSocketService를 사용하여 request의 업그레이드 유무를 확인한 후 웹서버의 종류(Servlet, Jetty, Netty, Undertow)에 따라 설정된 upgrade strategy를 사용하여 웹소켓 연결로 업그레이드한다.

HttpServerOperation 클래스를 보면 NettyChannel에서 핸드 쉐이크 이후 sendWebsocket() 메서드를 통해 발생하는 시그널에 대해서 컨디션 체크 후 WebsocketHandler 에 넘겨주고 웹소켓 연결이 끊어지거나 에러 시그널의 경우에만 처리를 하는 WebSocketSubscriber를 할당하여 웹 소켓 커뮤니케이션을 처리한다.

```java
class HttpServerOperations extends HttpOperations<HttpServerRequest, HttpServerResponse> implements HttpServerRequest, HttpServerResponse {
    ...
    @Override
    public Mono<Void> sendWebsocket(@Nullable String protocols,
        int maxFramePayloadLength,
        BiFunction<? super WebsocketInbound, ? super WebsocketOutbound, ? extends Publisher<Void>> websocketHandler) {
        return withWebsocketSupport(uri(), protocols, maxFramePayloadLength, websocketHandler);
    }
    ...
    final Mono<Void> withWebsocketSupport(String url, @Nullable String protocols, int maxFramePayloadLength, BiFunction<? super WebsocketInbound, ? super WebsocketOutbound, ? extends Publisher<Void>> websocketHandler) {
        Objects.requireNonNull(websocketHandler, "websocketHandler");
        if (markSentHeaders()) {
            WebsocketServerOperations ops = new WebsocketServerOperations(url, protocols, maxFramePayloadLength, this);
            if (rebind(ops)) {
                return FutureMono.from(ops.handshakerResult)
                                 .doOnEach(signal -> {
                                    if(!signal.hasError() && (protocols == null || ops.selectedSubprotocol() != null)) {
                                        websocketHandler.apply(ops, ops).subscribe(new WebsocketSubscriber(ops, signal.getContext()));
                                    }
                                 });
            }
        }
        else {
            log.error(format(channel(), "Cannot enable websocket if headers have already been sent"));
        }
        return Mono.error(new IllegalStateException("Failed to upgrade to websocket"));
    }
}
```
