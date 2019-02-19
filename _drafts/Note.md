# Spring Boot

Spring Boot 2.0 버전에서 JPA를 사용하기 위해선 build.gradle에 다음 dependency를 추가해야 된다. (2.1 버전에서 해결됨)

`compile("javax.xml.bind:jaxb-api:2.3.0")`

# WebTestClient

Test에서 `WebTestClient`를 사용해야 되서 `@WebFluxTest`어노테이션을 사용할 때, `AbstractErrorWebExceptionHandler`를 상속받아 사용하는 클래스에서 ' `ErrorAttributes`  no qualifying' 에러가 발생한다면 `@WebFluxTest`  대신 `@SpringBootTest`와 `@AutoConfigureWebTestClient` 어노테이션을 사용하면 된다.

```
package com.linecorp.lad.manager.personal;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.web.reactive.function.BodyInserters;

import com.linecorp.lad.manager.personal.model.HelloJpa;

import reactor.core.publisher.Flux;
import reactor.test.StepVerifier;

@SpringBootTest
@AutoConfigureWebTestClient
@AutoConfigureDataJpa
@DisplayName("Hello Controller Tests")
public class HelloControllerTests {

    @Autowired
    private WebTestClient client;

    @Test
    @DisplayName("/hello POST with param : Name")
    void helloPostTest() {
        var helloJpa = client.post().uri("/hello").body(BodyInserters.fromObject("test")).exchange()
                             .expectStatus().isOk()
                             .expectBody(HelloJpa.class)
                             .returnResult().getResponseBody();

        Assertions.assertEquals(Long.valueOf(1L), helloJpa.getId());
        Assertions.assertEquals("test", helloJpa.getName());
    }

    @Test
    @DisplayName("/hello/sse GET")
    void helloSseTest() {
        int count  = 3;
        Flux<String> result = client.get().uri("/hello/sse/" + count).exchange()
                                    .expectStatus().isOk()
                                    .returnResult(String.class).getResponseBody();

        StepVerifier.create(result)
                    .expectNext("hello sse 0")
                    .expectNext("hello sse 1")
                    .expectNext("hello sse 2")
                    .verifyComplete();
    }

    @Nested
    class HelloControllerGetTests {

        @Test
        @DisplayName("/hello GET with param : Name")
        void helloGetTest() {
            client.get().uri("/hello/1").exchange()
                  .expectStatus().isOk()
                  .expectBody(String.class).isEqualTo("{\"id\":1,\"name\":\"test\"}");
        }

        @Test
        @DisplayName("/hello GET no param")
        void helloTest() {
            client.get().uri("/hello").exchange()
                  .expectStatus().isOk()
                  .expectBody(String.class).isEqualTo("[{\"id\":1,\"name\":\"test\"}]");
        }
    }
}

```

# Spring Boot Profile

Spring Boot에선 프로파일 기반의 설정 파일을 기본 제공한다. `application-[프로파일].yml` 로 설정하여 사용할 수 있다.

# JPA Entity

JPA에 리스너가 존재하여 어노테이션 기반으로 Entity의 생명주기에 대한 이벤트 처리를 할 수 있다.

- PostLoad : 엔티티가 영속성 컨텍스트에 조회된 직후 또는 refresh를 호출한 후
- PrePersist : persist() 메서드를 호출해서 엔티티를 영속성컨텍스트에 관리하기 직전에 호출 된다. 식별자 생성 전략을 사용한 경우 엔티티에 식별자는 아직 존재 하지 않는다. 새로운 인스턴스를 merge할 때도 수행된다.
- PreUpdate : flush나 commit을 호출해서 엔티티를 데이터베이스에 수정하기 직전에 호출된다.
- PreRemove : remove() 메서드를 호출해서 엔티티를 영속성 컨텍스트에서 삭제하기 직전에 호출된다. 또한 삭제 명령어로 영속성 전이가 일어날 때도 호출 된다. orphanRemoval에 대해서는 flush나 commit시 호출 된다.
- Postpersist : flush나 commit을 호출해서 엔티티를 데이터베이스에 저장한 직후에 호출된다. 식별자가 항상 존재한다. 참고로 식별자 생성 전략이 IDENTITY면 식별자를 생성하기 위해 persist()를 호출한 직후에 바로 PostPersist가 호출 된다.
- PostUpdate : flush나 commit을 호출해서 엔티티를 데이터베이스에 수정한 직후에 호출 된다.
- PostRemove : flush나 commit을 호출해서 엔티티를 데이터베이스에 삭제한 직후에 호출된다.

```
@Entity
public class TestEntity {
    @Id
    private Long id;
    
    @PreUpdate
    protected void OnModified() {
        // Called just before update to DB
    }
}
```

