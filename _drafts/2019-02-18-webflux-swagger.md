---
title: WebFlux Swagger
date: 2019-02-18
categories:
- Development
tags:
- Development
- Java
- Spring
- Webflux
- Swagger
---



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

