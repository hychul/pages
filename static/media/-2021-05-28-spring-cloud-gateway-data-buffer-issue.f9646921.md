```terminal
$ class org.springframework.core.io.buffer.DefaultDataBuffer cannot be cast to class org.springframework.core.io.buffer.NettyDataBuffer (org.springframework.core.io.buffer.DefaultDataBuffer and org.springframework.core.io.buffer.NettyDataBuffer are in unnamed module of loader 'app')
```


DefaultDataBufferFactory -> tomcat
NettyDataBufferFactory -> netty

```java
log.debug("Origin requestBody for dmp look a like audience creation : {}", requestBody);

                                                                          byte[] newRequestBody = makeLalMaxInjectedBody(requestBody, lalMax);
                                                                          log.debug("Lal max injected requestBody : {}", new String(newRequestBody, "UTF-8"));

                                                                          DefaultDataBuffer dataBuffer = new DefaultDataBufferFactory().wrap(ByteBuffer.wrap(newRequestBody));
                                                                          Flux<DataBuffer> body = Flux.just(dataBuffer);

                                                                          BodyInserter<Flux<DataBuffer>, ReactiveHttpOutputMessage> inserter = BodyInserters.fromDataBuffers(body);
                                                                          HttpHeaders headers = new HttpHeaders();
                                                                          headers.putAll(exchange.getRequest().getHeaders());
                                                                          CachedBodyOutputMessage outputMessage = new CachedBodyOutputMessage(exchange, headers);
                                                                          return inserter.insert(outputMessage, new BodyInserterContext())
                                                                                         .then(Mono.defer(() -> {
                                                                                             ServerHttpRequest decorator = decorate(exchange, outputMessage);
                                                                                             return chain.filter(exchange.mutate().request(decorator).build());
                                                                                         }));
```

```java
log.debug("Origin requestBody for dmp look a like audience creation : {}", requestBody);

                                                                          byte[] newRequestBody = makeLalMaxInjectedBody(requestBody, lalMax);
                                                                          log.debug("Lal max injected requestBody : {}", new String(newRequestBody, "UTF-8"));


                                                                          DataBuffer dataBuffer = new NettyDataBufferFactory(ByteBufAllocator.DEFAULT).wrap(newRequestBody);
                                                                          Flux<DataBuffer> body = Flux.just(dataBuffer);

                                                                          BodyInserter<Flux<DataBuffer>, ReactiveHttpOutputMessage> inserter = BodyInserters.fromDataBuffers(body);
                                                                          HttpHeaders headers = new HttpHeaders();
                                                                          headers.putAll(exchange.getRequest().getHeaders());
                                                                          CachedBodyOutputMessage outputMessage = new CachedBodyOutputMessage(exchange, headers);
                                                                          return inserter.insert(outputMessage, new BodyInserterContext())
                                                                                         .then(Mono.defer(() -> {
                                                                                             ServerHttpRequest decorator = decorate(exchange, outputMessage);
                                                                                             return chain.filter(exchange.mutate().request(decorator).build());
                                                                                         }));
```