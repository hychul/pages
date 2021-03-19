# WebFlux WebSocket 연결

WebSocket의 경우 사용하기 위해선 `WebSocketHandlerAdapter`와 웹소켓을 위한 `HandlerMapping`을 빈으로 등록해야한다.

`WebSocketHandlerAdapter`에선 web socket 연결로 업그레이드(핸드쉐이크)를 위해 `HandShakeWebSocketService`를 사용하여 request의 업그레이드 유무를 확인한 후 웹서버의 종류(Servlet, Jetty, Netty, Undertow)에 따라 설정된 upgrade strategy를 사용하여 웹소켓 연결로 업그레이드한다.

HttpServerOperation 클래스를 보면 NettyChannel에서 핸드 쉐이크 이후 `sendWebsocket()` 메서드를 통해 발생하는 시그널에 대해서 컨디션 체크 후 `WebsocketHandler` 에 넘겨주고 웹소켓 연결이 끊어지거나 에러 시그널의 경우에만 처리를 하는 `WebSocketSubscriber`를 할당하여 웹 소켓 커뮤니케이션을 처리한다.

```java
class HttpServerOperations extends HttpOperations<HttpServerRequest, HttpServerResponse> implements HttpServerRequest, HttpServerResponse {
    //...
    @Override
    public Mono<Void> sendWebsocket(@Nullable String protocols,
                                    int maxFramePayloadLength,
                                    BiFunction<? super WebsocketInbound, ? super WebsocketOutbound, ? extends Publisher<Void>> websocketHandler) {
        return withWebsocketSupport(uri(), protocols, maxFramePayloadLength, websocketHandler);
    }
    //...
    final Mono<Void> withWebsocketSupport(String url,
                                          @Nullable String protocols,
                                          int maxFramePayloadLength,
                                          BiFunction<? super WebsocketInbound, ? super WebsocketOutbound, ? extends Publisher<Void>> websocketHandler) {
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

