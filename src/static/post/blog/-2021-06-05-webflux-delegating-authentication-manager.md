Spring에선 하나의 인증 필터에서 여러 인증 방식을 사용활 수 있도록 MVC에선 `ProviderManger`, Webflux에선 `DelegatingReactiveAuthenticationManager` 를 제공한다.

MVC에선 `ProviderManager`의 생성자에서 여러 `AuthenticationProvider`들을 전달하여, `authenticate()` 메서드가 호출될 때 여러 인증을 한번에 사용할 수 있다.

Webflux에서도 여러 인증을 한번의 `authenticate()` 메서드를 통해 처리하기 위해 `DelegatingReactiveAuthenticationManager`를 제공하는데, 예외가 발생했을 때 MVC에서의 동작과는 차이가 있어 주의가 필요하다.

# MVC의 인증

`ProviderManager`의 `authenticate()` 메서드의 경우 블로킹 환경에서 사용되기 때문에 각각의 `AuthenticationProvider` 들을 반복복문 안에서 순회하며 처리하고, 인증이 성공한 경우 반복문을 빠져나와 생성된 `Authentication`을 반환한다.

그리고 기본적으로 반복문 안에선 try-catch 구문으로 예외처리를 하고 모든 인증이 실패한 경우 마지막으로 발생한 예외를 던지도록 하고 있다.

# Webflux의 인증

`DelegatingReactiveAuthenticationManager`의 경우 아주 간단한 방식으로 동작하는데 그 구현은 다음과 같다.

```java
public class DelegatingReactiveAuthenticationManager implements ReactiveAuthenticationManager {
	private final List<ReactiveAuthenticationManager> delegates;

    ...

	public Mono<Authentication> authenticate(Authentication authentication) {
		return Flux.fromIterable(this.delegates)
				.concatMap(m -> m.authenticate(authentication))
				.next();
	}
}
```

`ReactiveAuthenticationManager`들의 리스트를 갖고, `Flux.concatMap()`을 통해 리스트의 순서대로 처리되도록 되어있기 때문에 반복분 안에서 순회하면서 인증을 처리하는 것과 같이 처리되지만, 예외가 발생했을때 처리가 따로 없기 때문에 마지막으로 던져진 예외가 아니라, 처음 던져진 예외가 이후의 인증과 상관없이 바로 던져진다.

때문에 A-B 순서대로 `ReactiveAuthenticationManager`를 설정하고 위의 클래스를 통해서 인증을 처리하는 경우 B의 인증이 성공할 케이스 이더라도 A에서 예외가 발생한다면 B는 처리되지 못하게 된다.