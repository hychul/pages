아쉽게도 현재<sup>2019-02-18</sup>로선 Functional Endpoint를 사용하여 개발할 경우 WebFlux 프로젝트에서 Swagger를 사용할 방법이 없습니다. 기본 MVC 프로젝트와 같이 `@RequestMapping` 어노테이션을 사용해야 합니다.

먼저 Swagger 관련 모듈을 프로젝트에 추가합니다.

```groovy
repositories {
    // ...
    maven { url "http://oss.jfrog.org/artifactory/oss-snapshot-local"}
}

dependencies {
    // ...
	compile ("io.springfox:springfox-swagger2:${swagger}")
	compile ("io.springfox:springfox-swagger-ui:${swagger}")
	compile ("io.springfox:springfox-spring-webflux:${swagger}")
}
```

SwaggerConfig 클래스를 생성하여 Swagger의 Document 설정합니다. 여기서 주의할 점이 `genericModeSubstitutes()` 메서드를 사용하여 Swagger에서 `Mono`, `Flux`의 리스폰스를 Swagger UI에서 처리할 수 있도록 합니다.  
이를 추가하지 않을 경우 리스폰스 모델이 제대로 표시되지 않고 '{}'로 표시 됩니다.

```java
@Configuration
@EnableSwagger2WebFlux
@Profile({ "local", "alpha", "beta", "stage" })
public class SwaggerConfig {
    @Bean
    public Docket api() {
        return new Docket(DocumentationType.SWAGGER_2)
                .select()
                .apis(RequestHandlerSelectors.any())
                .paths(PathSelectors.any())
                .build()
                .genericModelSubstitutes(Optional.class, Mono.class, Flux.class);
    }
}
```

그리고 마지막으로 WebFlux에서 swagger-ui 화면을 출력할 수 있도록 관련 리소스 핸들러 설정을 추가합니다.

```java
@Configuration
public class WebFluxConfig implements WebFluxConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/swagger-ui.html**")
                .addResourceLocations("classpath:/META-INF/resources/");
        registry.addResourceHandler("/webjars/**")
                .addResourceLocations("classpath:/META-INF/resources/webjars/");
    }
}
```

