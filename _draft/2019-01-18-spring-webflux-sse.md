# Webflux SSE 처리

ServerSentEventHttpMessageWriter 클래스에서 write() 메서드를 HandlerResultAdapter 로 부터 호출받아 SSE에 대한 response를 작성한다. (SSE가 아닌 경우엔 EncoderHttpMessageWriter로 처리 된다 ServerResponse를 생성할 때 사용되는 Bodyinserter에서 정해진다)

```java
public class ServerSentEventHttpMessageWriter implements HttpMessageWriter<Object> {
	//... 	
	@Override
	public Mono<Void> write(Publisher<?> input,
							ResolvableType actualType,
							ResolvableType elementType,
							@Nullable MediaType mediaType,
							ServerHttpRequest request,
							ServerHttpResponse response,
							Map<String, Object> hints) {
		Map<String, Object> allHints = Hints.merge(hints,getEncodeHints(actualType, elementType, mediaType, request, response));
		return write(input, elementType, mediaType, response, allHints);
	}
	//...
	@Override
	public Mono<Void> write(Publisher<?> input,
							ResolvableType elementType,
							@Nullable MediaType mediaType,
                            ReactiveHttpOutputMessage message,
                            Map<String, Object> hints) {
		mediaType = (mediaType != null && mediaType.getCharset() != null ?
					mediaType :
					DEFAULT_MEDIA_TYPE);
		DataBufferFactory bufferFactory = message.bufferFactory();
		message.getHeaders().setContentType(mediaType);
		return message.writeAndFlushWith(encode(input, elementType, mediaType, bufferFactory, hints));
	}
}
```

ReactorClientHttpRequest 클래스에서 writeAndFlushWith() 메서드를 통해 netty outbound를 통해 Publisher 타입의 body를 ByteBufs로 변환하여 내보내는데, SSE의 경우 body가 onComplete 시그널을 발생하지 않고 계속 onNext 시그널을 통해 데이터를 전달하여 연결이 끊어지지 않고 클라이언트에게 이벤트를 전달할 수 있다.

```java
class ReactorClientHttpRequest extends AbstractClientHttpRequest implements ZeroCopyHttpOutputMessage {
    // ...
    @Override
    public Mono<Void> writeAndFlushWith(Publisher<? extends Publisher<? extends DataBuffer>> body) {
        Publisher<Publisher<ByteBuf>> byteBufs = Flux.from(body).map(ReactorClientHttpRequest::toByteBufs);
        return doCommit(() -> this.outbound.sendGroups(byteBufs).then());
    }
    //...
}
```

