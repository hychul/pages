---
title: Spring WebFlux
date: 2019-01-11
categories:
- Spring
tags:
- Development
- Spring
- Java
- WebFlux
---

![spring-webflux-01](https://user-images.githubusercontent.com/18159012/51081064-56923b00-172a-11e9-96b5-1f433a9e8b91.png)

 스프링이 5.0 버전으로 넘어가면서 기존 MVC 뿐만 아니라 WebFlux라는 논블록킹<sup>non-block</sup> 기반의 리액티브 스트림<sup>reactive stream</sup>을 지원하는 리액티브 스택 웹 프레임워크가 추가되었다. 기존 Spring MVC가 서블릿을 기반으로 한 웹앱을 위한 프레임워크였다면, Spring WebFlux의 경우 논블록을 지원하는 웹서버인 Netty, Undertow 그리고 Servlet 3.1+ 등을 지원한다. 

 스프링 5.0에선 WebFlux를 통해 더 적은 스레드, 더 적은 하드웨어 리소스로 동시성 문제를 해결할 수 있다. 서블릿 3.1에서도 논블록킹 I/O를 지원하지만 기존 Spring MVC에서 사용하던 블록킹 API를 사용하기 어렵다. 때문에 새로운 논블록킹 웹 스택인 WebFlux를 추가하여 논블록킹 웹앱을 개발 가능하게 하였다.

 새로운 웹 스택에선 논블록 뿐만 아니라 함수형 프로그래밍에 대한 지원도 추가되었다. 덕분에 WebFlux에선 기존 Spring MVC에서 사용되던 어노테이션<sup>annotation</sup> 기반의 컨트롤러 뿐만 아니라 함수형 엔드포인트<sup>functional endpoint</sup>를 사용하여 웹앱을 구성할 수 있게 되었다.

 다음은 WebFlux가 어떻게 동작하는지 설명한다.

# WebFlux의 Request 처리

Spring MVC에서 request를 적절한 controller에 넘겨주기 위해 `DispatcherServlet`을 사용했던 것과 유사하게 Spring WebFlux에선 `DispatcherHandler` 클래스를 사용한다.

NettyWebServer.handle() → ServerManager.handle() → 체인된 HttpHandler들 생략 → DispatcherHandler.handle() 의 과정으로 리퀘스트가 처리된다.

DispatcherHandler에 전달된 exchange(앞선 체인 핸들러에서 묶인 request와 response)가 HandlerMapping → HandlerAdapter → HandlerResultHanlder 를 거쳐 처리되어 response를 반환한다.

![spring-webflux-02](https://user-images.githubusercontent.com/18159012/51080959-424d3e80-1728-11e9-8025-09ecc4250b78.png)

HandlerMapping을 통해 RouterFunction, RequestMapping, 리소스 맵핑 중 하나가 선택되어 이에 해당하는 Adapter를 통해 핸들러가 request를 처리하고 처리 결과를 HandlerResultAdapter를 통해 클라이언트에게 response로 전달한다.

# 내부 구현

## WebFlux 빈 설정

 WebFlux 프레임워크를 사용하기 위해선 @EnableWebFlux 어노테이션을 사용하여 스프링 프레임워크에게 WebFlux로 동작하는 것을 알려야한다. WebFlux에선 기존 MVC 방식과 다른 웹서버와 리퀘스트 처리 방식을 사용하기 때문에 WebFlux를 위한 Spring 프레임워크의 빈 설정이 동작하게 된다.

> - WebFluxAutoConfiguration //  `@EnableWebFlux`어노테이션을 위한 auto-configuration 클래스
>   - ...
>   - WebFluxConfigurationSupport // `@ConditionalOnMissingBean` 어노테이션을 통해 `WebFluxAutoConfiguration`에서 같은 타입의 다른 빈이 등록되지 않았을 경우 디폴트 빈으로 사용되는 빈을 등록한다.
>     - ...
>     - HandlerMapping 관련 빈 설정
>       - RouterFunctionMapping // 맵핑 오더 : -1
>         - RouterFunction은 afterPropertiesSet 메서드 → initRouterFunctions() → routerFunctions()메서드를 통해 빈으로 등록된 RouterFunction을 가져와 맵핑한다.
>       - RequestMappingHandlerMapping // 맵핑 오더 : 0
>       - 리소스 맵핑을 위한 HandlerMapping // 맵핑 오더 : `LOWEST_PRECEDENCE - 1`
>     - HandlerAdapter 관련 빈 설정
>       - HandlerFunctionAdapter // `RouterFunction`에 사용되는 `HandlerFunction`을 위한 어댑터
>       - RequestMappingHandlerAdapter // `@RequestMapping` 어노테이션을 사용하는 핸들러 메서드에 사용 (어노테이션 기반)
>       - SimpleHandlerAdapter // 리소스 맵핑에 사용되는 핸들러 어댑터
>     - HandlerResultHandler 관련 빈 설정
>       - ServerResponseResultHandler // `HandlerFunction` 에서 사용하는 retuen 타입인 `ServerResponse`를 담당
>       - ResponseBodyResultHandler // `@ResponseBody` 어노테이션을 사용하는 핸들러 메서드 리턴 값을 담당
>       - ViewResolutionResultHandler // View 리소스 담당 (View Resolver)
>     - DispatcherHandler로 WebHandler 반 설정
>       - DispatcherHandler의 컨스트럭터에서 HandlerMapping, handlerAdapter, HandlerResultHandler 빈들을 불러와 세팅한다.
>
> 
>
> - HttpHandlerAutoConfiguration // HttpHandler 를 위한 auto-configuration 클래스
>   - AnnotationConfig // nested static class
>     - WebHandler 빈과 WebFilter 빈을 받아 HttpHandler(HttpWebHandlerAdapter)를 빌드한다.
>       - 체인된 WebHandler를 만든다 
>         (체인순서 : HttpWebHandlerAdapter (request와 response를 exchange로 묶음) → ExcpetionalHandlingWebHandler → FilteringWebHandler → DispatcherHandler)

>  Spring Boot에서 초기화를 사용하기 위해 사용되는 `SpringBootApplication`에는 `EnableAutoConfiguration` 어노테이션이 설정되어 있다. 때문에 Spring Boot를 사용하면 auto-configuration들이 호출되게 된다.

## SpringApplication 초기화

SpringApplication을 실행하기 위해 `main()` 메서드에선 `SpringApplication.run()` static 메서드를 통해 Spring 어플리케이션을 실행한다. `run()` 메서드를 실행하면 `SpringApplication` 인스턴스를 생성하고 

> - static SpringApplication.run()
>
> - new SpringApplication()
>
>  - 클래스 path를 통해 `webApplicationType`을 지정한다 (NONT, SERVLET, REACTIVE)
>
> - SpringApplication.run()
>
>  - createApplicationContext() // `webApplicationType`이 `REACTIVE`로 `AnnotationConfigReactiveWebServerApplicationContext`로 지정
>
>  - prepareContext()
>
>  - refreshContext()
>
>    - AnnotationConfigReactiveWebServerApplicationContext.refresh()
>
>      - prepareRefresh()
>
>      - ...
>
>      - onRefresh()
>
>        - createWebServer() // jetty, netty, tomcat, undertow 네가지 `WebServer`가 존재한다. 여기선 netty를 사용한다고 가정 : `NettyWebServer`
>          - NettyReactiveWebServerFactory.getWebServer() // `HttpHandler`는 이를 상속받은 `ServerManager` 클래스
>            - createHttpServer() // TCP 서버를 기반으로 설정값을 통해 ssl 등을 설정한다
>            - new ReactorHttpHandlerAdapter(httpHandler) // `HttpHandler`는 이를 상속받은 `ServerManager` 클래스
>            - new NettyWebServer(httpServer, handlerAdapter, lifecycleTimeout)
>        - ServerManager.get(getWebServerFactory()) // `ServerManager`가 설정될 때 `HttpHandler`는 uninitialized 상태
>
>      - ...
>
>      - finishRefresh()
>
>        - ...
>
>        - startReactiveWebServer()
>
>          - getHttpHandler()
>
>            - 빈 팩토리에서 `HttpHanlder`를 받아온다 // HttpHandlerAutoConfiguration 클래스에 HttpHandler 빈이 applicationContext를 사용한 빈을 통해 생성되도록 등록되어 있다
>
>              - - WebHandler 빈(DispatcherHandler)과 WebFilter(?) 빈을 받아 HttpHandler(HttpWebHandlerAdapter)
>
>                  를 빌드한다.
>
>                  - 체인된 WebHandler를 만든다 (처리순서 : HttpWebHandlerAdapter (request와 response를 exchange로 묶음) → ExcpetionalHandlingWebHandler → FilteringWebHandler → DispatcherHandler)
>
>          - ServerManager.start(httpHandler)
>
>            - 핸들러 설정
>            - NettyWebServer.start()
>
>  - ...
>
> - ...
