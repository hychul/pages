```java
package com.linecorp.lad.manager.webgw.filter.gateway;

import java.nio.charset.StandardCharsets;
import java.util.List;

import org.reactivestreams.Publisher;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.MultiValueMap;
import org.springframework.web.server.ServerWebExchange;

import com.linecorp.lad.manager.commons.utils.JsonDataUtils;
import com.linecorp.lad.manager.webgw.exception.BaseException;
import com.linecorp.lad.manager.webgw.service.GeoDmpService;
import com.linecorp.lad.manager.webgw.service.model.LadmCountry;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
public class RespondingFilter implements WebFilter {

    private final FooService fooService;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        final String requestUri = exchange.getRequest().getURI().getPath();

        if (!matcher.match(antPathMatchingPattern, requestUri)) {
            return chain.filter(exchange);
        }

        return fooService.getBody()
                         .flatMap(geoDmpMapData -> {
                             ServerHttpResponse response = exchange.getResponse();
                             response.setStatusCode(HttpStatus.OK);
                             response.getHeaders().set("x-intercepted", "true");

                             byte[] bytes = JsonDataUtils.toJson(geoDmpMapData).getByte(StandardCharsetsUTF_8);                             
                             DataBuffer buffer = response.bufferFactory().wrap(bytes);      
                                                    
                             return response.writeWith(Mono.just(buffer));
                         });
    }
}
```
