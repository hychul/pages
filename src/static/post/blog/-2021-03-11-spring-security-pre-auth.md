기존에 Spring MVC 로 작성된 게이트웨이를 Webflux 기반의 SCG<sup>Spring Cloug Gateway</sup>으로 변경하는 작업을 진행하고 있다. 기존의 프로젝트를 운영 중에 대체해야 하기 때문에 기존과 동일한 동작을 보장해야 하는데, 기존에 설정된 시큐리티가 Webflux로 넘어오면서 Reactor를 사용한 구조로 변경이 되면서 많은 부분이 함께 변경되었다.

# MVC

## preauth
기존 MVC의 pre-authentication 의 경우 다음과 같은 순서로 동작을 하였다.

```
AuthenticationFilter.doFilterInteranl() -> 
AuthenticationFilter.attemptAuthentication() -> // authenticationConverter를 통해서 request에서 authentication을 convert
AuthenticationManager.authenticate() -> ProviderManager.authenticate() ->
AuthenticationProvider.authenticate() -> PreAuthenticationProvider.authenticate()
```

converter에서 request를 가지고 authentication을 생성한 후, `PreAuthenticatedAuthenticationProvider`에서 Authentication 객체를 받아 UserDetails를 가져오는 로직이 존재한다.

## Provider Manager
`ProviderManager.authenticate()` -> `List<AuthenticationProvider>.foreach().authenticate()`

authentication 메서드 안에서 support로 지원하는 authentication provider 인지 확인을 한다.

# Webflux

AuthenticationWebFilter

```java
public class AuthenticationWebFilter implements WebFilter {
    ...
	@Override
	public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
		return this.requiresAuthenticationMatcher.matches(exchange)
			.filter( matchResult -> matchResult.isMatch())
			.flatMap( matchResult -> this.authenticationConverter.convert(exchange))
			.switchIfEmpty(chain.filter(exchange).then(Mono.empty()))
			.flatMap( token -> authenticate(exchange, chain, token));
	}

	private Mono<Void> authenticate(ServerWebExchange exchange,
		WebFilterChain chain, Authentication token) {
		WebFilterExchange webFilterExchange = new WebFilterExchange(exchange, chain);

		return this.authenticationManagerResolver.resolve(exchange.getRequest())
			.flatMap(authenticationManager -> authenticationManager.authenticate(token))
			.switchIfEmpty(Mono.defer(() -> Mono.error(new IllegalStateException("No provider found for " + token.getClass()))))
			.flatMap(authentication -> onAuthenticationSuccess(authentication, webFilterExchange))
			.onErrorResume(AuthenticationException.class, e -> this.authenticationFailureHandler
				.onAuthenticationFailure(webFilterExchange, e));
	}
    ...
```

converter에서 exchange로 부터 authentication 객체를 생성하고 이를 authentication() 메서드에서 처리.