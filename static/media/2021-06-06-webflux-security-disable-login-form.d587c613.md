Webflux에서 기존의 MVC와 달리 서블릿이 사라지면서 함께 시큐리티 쪽도 많은 변화가 있었다. 그중에서도 기본 시큐리티 필터 설정에서도 변화가 있었다.

Spring Security은 기본적인 인증 방법은 username과 password를 사용한 로그인을 통해 이뤄진다. 물론 대부분의 경우 유저가 지정한 방식으로 인증을 할 수 있도록 필터를 추가할 수 있지만, 해당 인증(혹은 로그인)을 하기 전에 별 다른 설정을 하지 않는다면 다음과 같은 기본 로그인 폼이 노출되게 된다.

<그림>

물론 인증을 통과하지 않았기 때문에 접근을 막은것은 당연한 것이지만, 브라우저의 '기본' 로그인 폼을 노출하는 것은 유저 경험에 그렇게 긍정적이지 않다.

때문에 해당 로그인 폼을 숨기고 로그인 화면으로 유도를 하거나 해야될텐데 다음과 같은 설정으로는 Webfluxd에선 기본 로그인 폼의 노출을 막을 수는 없다.

```java
@Bean
public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
    return http.formLogin().disable()
               .httpBasic().disable()
               ...
}
```

# Solution

위의 코드로 해결되지 않는 이유는 `ServerAuthenticationEntryPoint`에 있다.

인증이 통과되지 않는 경우 Webflux에선 `ServerAuthenticationEntryPoint`를 통해 인증이 안되었을 경우의 처리를 하게된다. 이때 http basic 설정을 확인해보면 엔트리 포인트를 `HttpBasicServerAuthenticationEntryPoint`를 사용하는 것을 확인할 수 있다.

해당 엔트리 포인트 구현체는 인증이 실패했을 때, 'WWW-Authenticate' 헤더를 사용하여 기본 로그인 폼을 노출하도록 응답한다. 때문에 다음과 같이 http basic에 대하여 엔트리 포인트를 변경해줘야 한다.

```java
@Bean
public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
    return http.formLogin().disable()
               .httpBasic().authenticationEntryPoint(new HttpStatusServerEntryPoint(HttpStatus.UNAUTHORIZED))
               ...
}
```

http basic 설정 외에도 `HttpBasicServerAuthenticationEntryPoint`를 기본 엔트리 포인트로 사용하는 부분이 있는데 이는 `AuthenticationWebFilter`이다.

```java
public class AuthenticationWebFilter implements WebFilter {
	...
	private ServerAuthenticationFailureHandler authenticationFailureHandler = new ServerAuthenticationEntryPointFailureHandler(new HttpBasicServerAuthenticationEntryPoint());
    ...
```

때문에 커스텀한 인증을 위해서 해당 필터에 컨버터 등을 설정하여 사용한다면 엔트리 포인트 설정에도 유의해야한다.

> ### References
> https://stackoverflow.com/questions/63614553/spring-webflux-disabling-login